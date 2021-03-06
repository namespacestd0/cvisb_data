import pandas as pd
import helpers
from datetime import datetime
from Bio import SeqIO
from .generate_viral_seq_dataset import get_viralseq_dataset
from .generate_viral_seq_datadownload import get_viralseq_downloads

DATADIR = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/"
alignment_file = f"{DATADIR}/input_data/expt_summary_data/viral_seq/clean_ebola_orfs_aln_2019.11.12.fasta"
metadata_file = f"{DATADIR}/input_data/expt_summary_data/viral_seq/survival_dataset_ebov_public_2019.11.12.csv"


def clean_ebola_viral_seq(export_dir, alignment_file, uncurated_file, metadata_file, expt_cols, patient_cols, sample_cols, download_cols, dateModified, version, updatedBy, saveFiles, verbose, virus="Ebola"):
    # --- constants ---
    today = datetime.today().strftime('%Y-%m-%d')
    # Custom, extra properties specific to viral sequencing
    exptCols = expt_cols.copy()
    exptCols.extend(['genbankID', 'inAlignment', 'cvisb_data'])

    # --- read in metadata ---
    md = pd.read_csv(metadata_file)

    # --- Initial checks ---
    dupe_patientID = md[md.duplicated(
        subset=["patientID", "patient_timepoint"], keep=False)]
    if(len(dupe_patientID) > 0):
        helpers.log_msg(
            f"DATA ERROR: {len(dupe_patientID)} duplicate patient ids found in virus sequences:", verbose)
        helpers.log_msg(dupe_patientID[['patientID']].sort_values(
            "patientID"), verbose)
        helpers.log_msg("-" * 50, verbose)
    dupe_accession = md[md.duplicated(subset=["accession"], keep=False)]
    if(len(dupe_accession) > 0):
        helpers.log_msg(
            f"DATA ERROR: {len(dupe_accession)} duplicate accession IDs found in virus sequences:", verbose)
        helpers.log_msg(dupe_patientID[[
                        'patientID', 'patient_timepoint', 'accession']].sort_values("accession"), verbose)
        helpers.log_msg("-" * 50, verbose)

    # --- clean up common properties, across patient/expt/sample/downloads/dataset ---
    md['variableMeasured'] = f"{virus} virus sequence"
    md['measurementTechnique'] = "Nucleic Acid Sequencing"
    md['measurementCategory'] = "virus sequencing"
    md['includedInDataset'] = f"{virus.lower()}-virus-seq"
    md['creator'] = None
    md['correction'] = None
    md['sourceFiles'] = "; ".join(
        [alignment_file.split("/")[-1], metadata_file.split("/")[-1]])
    md['version'] = version
    md['dateModified'] = dateModified
    md['updatedBy'] = updatedBy
    md['releaseDate'] = today
    md['dataStatus'] = "final"
    md['publisher'] = md.apply(getPublisher, axis=1)
    md['batchID'] = None
    md['experimentDate'] = md.date
    md['isControl'] = False

    # --- clean up patient metadata ---
    md['privatePatientID'] = md.patientID
    md['KGH_id'] = md.patientID.apply(
        helpers.checkIDstructure).apply(lambda x: not x)
    md['outcome_copy'] = md.outcome
    md['outcome'] = md.outcome.apply(helpers.cleanOutcome)
    md['cohort'] = virus
    md['alternateIdentifier'] = md.patientID.apply(helpers.listify)
    md['country'] = md.country_iso3.apply(helpers.getCountry)
    md['admin2'] = md.admin2.apply(lambda x: cleanAdmin(x, 2))
    md['admin3'] = md.admin3.apply(lambda x: cleanAdmin(x, 3))
    md['admin4'] = md.admin4.apply(lambda x: cleanAdmin(x, 4))
    md['exposureLocation'] = md.apply(getExposure, axis=1)
    md['homeLocation'] = md.import_country.apply(helpers.getCountry)
    md['homeLocation'] = md.homeLocation.apply(helpers.listify)
    md['countryName'] = md.country.apply(helpers.pullCountryName)
    md['infectionYear'] = md.year
    md['samplingDate'] = md.date
    md['species'] = md.host.apply(helpers.convertSpecies)
    # Patient timepoints
    md['visitCode'] = md.patient_timepoint.apply(lambda x: str(x))
    # Note: not technically true; if a KGH patient, could have patient / survivor data.
    # But-- since only uploading the non-KGH patient data, should be fine.
    md['hasPatientData'] = False
    md['hasSurvivorData'] = False

    # --- clean up experiment properties ---
    md['inAlignment'] = md.curated.apply(bool)
    md['cvisb_data'] = md.CViSB_data.apply(bool)
    citation_dict = helpers.createCitationDict(md, "source_pmid")
    md['citation'] = md["source_pmid"].apply(
        lambda x: helpers.lookupCitation(x, citation_dict))
    # Make sure arrays are arrays
    md['citation'] = md.citation.apply(helpers.listify)
    md['experimentID'] = md.apply(lambda x: getExptID(x, virus), axis=1)
    md['genbankID'] = md.accession

    # --- clean up sample properties ---
    md['sampleLabel'] = md.label
    md['sampleType'] = "viralRNA"
    md['creatorInitials'] = f"{(updatedBy.split(' ')[0][0] + updatedBy.split(' ')[1][0]).lower()}"
    md['sampleID'] = md.apply(
        lambda x: f"{x.creatorInitials}-{x.sampleLabel}_{x.sampleType}", axis=1)

    # --- clean up download properties ---
    md['name'] = md.apply(lambda x: x.patientID + "_" + x.accession, axis=1)
    md['identifier'] = md.apply(lambda x: x.patientID + "_" + x.accession, axis=1)
    md['contentUrl'] = md.apply(lambda x: "https://www.ncbi.nlm.nih.gov/nuccore/" + x.accession, axis=1)
    md['additionalType'] = 'raw data'
    md['experimentIDs'] = md.experimentID.apply(lambda x: [x])
    md['contentUrlRepository'] = "GenBank"
    md['contentUrlIdentifier'] = md.accession

    # --- Merge together data and metadata ---
    seqs = getDNAseq(alignment_file, uncurated_file, virus)

    merged = pd.merge(md, seqs, on="sequenceID", how="outer", indicator=True)
    no_seq = merged[merged._merge == "left_only"]
    seq_only = merged[merged._merge == "right_only"]
    if(len(no_seq) > 0):
        helpers.log_msg(f"\tDATA ERROR: no sequence found in sequence alignment file for {len(no_seq)} patients:", verbose)
        helpers.log_msg(no_seq  ['patientID'], verbose)
        helpers.log_msg("-" * 50, verbose)
    if(len(seq_only) > 0):
        helpers.log_msg(f"\tDATA ERROR: no patient found in sequence metadata file for {len(seq_only)} sequences:", verbose)
        helpers.log_msg(seq_only['sequenceID'], verbose)
        helpers.log_msg("-" * 50, verbose)

    # Make sure arrays are arrays
    # merged['data'] = merged.data.apply(helpers.listify)

    # --- partition data to different endpoints ---
    patients = md.loc[~ md.KGH_id, patient_cols]
    # de-duplicate patients; some patients are timepoints of the same person
    patients.drop_duplicates(subset=["patientID", "cohort", "outcome", "countryName", "infectionYear", "species"], inplace = True)
    samples = md.loc[~ md.KGH_id, sample_cols]
    experiments = merged[exptCols]

    # --- Call to get data downloads, dataset ---
    dwnlds = md[download_cols]
    all_dwnlds = get_viralseq_downloads(dateModified, dwnlds, experiments, version, virus)
    ds = get_viralseq_dataset(dateModified, dwnlds, md, version, virus)

    # [Export]  ----------------------------------------------------------------------------------------------------
    if(saveFiles):
        # --- experiments ---
        experiments.to_json(
            f"{output_dir}/experiments/virus_seq_experiments_{today}.json", orient="records")

        # --- patients ---
        patients.to_json(
            f"{output_dir}/patients/virus_seq_patients_{today}.json", orient="records")
        # --- samples ---
        samples.to_json(
            f"{output_dir}/samples/virus_seq_samples_{today}.json", orient="records")

    return({"patient": patients, "sample": samples, "dataset": ds, "datadownload": all_dwnlds, "experiment": experiments})
# sum(md.duplicated(subset = "accession"))


def getPublisher(row, varName="CViSB_data"):
    # Check binary if CVISB_data
    if(row[varName]):
        return([helpers.cvisb])

def getExptID(row, virus):
    if(virus == "Ebola"):
        expt_stub = "EBOV_seq_"
    if(virus == "Lassa"):
        expt_stub = "LASV_seq_"
    return(expt_stub + row.patientID + row.visitCode)

def getDNAseq(alignment_file, uncurated_alignment, virus, seq_type="DNAsequence", segment=None, data_type="VirusSeqData"):
    all_seq = list(SeqIO.parse(alignment_file, "fasta"))
    if(uncurated_alignment is not None):
        uncurated_seq = list(SeqIO.parse(uncurated_alignment, "fasta"))
    else:
        uncurated_seq = list()

    # curated sequences
    curated = pd.DataFrame(columns=['sequenceID', 'curated'])
    for seq in all_seq:
        seq_obj = [{
        seq_type: str(seq.seq).upper(),
        "@type": data_type,
        "virus": virus,
        "curated": True,
        "virusSegment": segment}]
        curated = curated.append(pd.DataFrame({'sequenceID': seq.id, 'curated': seq_obj}))

    uncurated = pd.DataFrame(columns=['sequenceID', 'uncurated'])
    for seq in uncurated_seq:
        seq_obj = [{
        seq_type: str(seq.seq).upper(),
        "@type": data_type,
        "virus": virus,
        "curated": False,
        "virusSegment": segment}]
        uncurated = uncurated.append(pd.DataFrame({'sequenceID': seq.id, 'uncurated': seq_obj}))

    # Merge together curated and uncurated
    df = pd.merge(curated, uncurated, how="outer", on="sequenceID", indicator=True)
    df['data'] = df.apply(combineSeqs, axis=1)
    cols2return = ['sequenceID', 'data']
    return(df[cols2return])

def combineSeqs(row):
    if(row.uncurated == row.uncurated):
        if(row.curated == row.curated):
            return([row.curated, row.uncurated])
        else:
            return([row.uncurated])
    else:
        return([row.curated])


def cleanAdmin(location, admin_level):
    if(location==location):
        loc_clean = location.replace("_", " ").title()
        return( {'administrativeUnit': admin_level,'name': loc_clean})

def getExposure(row):
    if((row.country == row.country) & (row.country is not None)):
        arr = [row.country]
        if((row.admin2 == row.admin2) & (row.admin2 is not None)):
            arr.append(row.admin2)
        if((row.admin3 == row.admin3) & (row.admin3 is not None)):
            arr.append(row.admin3)
        if((row.admin4 == row.admin4) & (row.admin4 is not None)):
            arr.append(row.admin4)
        return(arr)
