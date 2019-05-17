# Imports and cleans viral sequencing data, to throw into Angular app.

import pandas as pd
from Bio import SeqIO
import os
from datetime import datetime

os.chdir("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/clean_patients/")
# Helper functions for cleanup...
import helpers

# [Commonalities]  ----------------------------------------------------------------------------------------------------
today = datetime.today().strftime('%Y-%m-%d')

exptCols = ['privatePatientID', 'experimentID', 'GenBank_ID',
            'measurementTechnique', 'publisher', 'publication', 'data']

def getPublisher(row, varName="CViSB_data"):
    # Check binary if CVISB_data
    if(row[varName]):
        return([{
            "@type": "Organization",
            "url": "https://cvisb.org/",
            "name": "Center for Viral Systems Biology",
            "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "technical support",
                "url": "https://cvisb.org/",
                "email": "info@cvisb.org"
            }
        }])

def getDNAseq(all_seq, df, df_id):
    for seq in all_seq:
        id = seq.id.split("|")[0]
        if(sum(df[df_id] == id) == 0):
            print(seq.id)
        df.loc[df[df_id] == id, 'data'] = {"DNAsequence": str(seq.seq)}
    return(df)

expt_dir = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/output_data/experiments/"

# [IDs from KGH]  ----------------------------------------------------------------------------------------------------
id_dict = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/output_data/patients/patients_2019-05-15_PRIVATE_dict.json"

ids = pd.read_json(id_dict)

ids.reset_index(inplace=True)
ids.rename(columns={'index': 'ID'}, inplace=True)

# Import data  ----------------------------------------------------------------------------------------------------
ebv_file = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/expt_summary_data/viral_seq/survival_dataset_ebov_02262019.csv"
lsv_file = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/expt_summary_data/viral_seq/survival_dataset_lasv_04112019.csv"

# [Ebola]  ----------------------------------------------------------------------------------------------------
ebv = pd.read_csv(ebv_file)

ebv.head()
# Ebola: check IDs if they're from KGH. Most are not.
ebv['privatePatientID'] = ebv.sample_id.apply(helpers.interpretID)
ebv['KGH_id'] = ebv.sample_id.apply(
    helpers.checkIDstructure).apply(lambda x: not x)

ebv['outcome'] = ebv.outcome.apply(helpers.cleanOutcome)
ebv['cohort'] = "Ebola"
ebv['experimentID'] = ebv.apply(
    lambda x: "EBV_seq" + str(x.name).zfill(3), axis=1)
ebv['GenBank_ID'] = ebv.ncbi_accession
ebv['measurementTechnique'] = "viral sequencing"
ebv['dateModified'] = today
ebv['CViSB_data'] = False
ebv['publisher'] = ebv.apply(getPublisher, axis=1)
ebv['publication'] = None

# Read in Ebola sequence data
ebv_seq = list(SeqIO.parse(
    "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/expt_summary_data/viral_seq/ebola_wg_ntseq_names_02152019_orfs.fasta", "fasta"))
ebv['data'] = None
ebv = getDNAseq(ebv_seq, ebv, 'sample_id')
sum(ebv.data.apply(lambda x: x is None))

ebv[ebv.data.apply(lambda x: x is None)]
ebv[exptCols].sample(6)

ebv = pd.merge(ebv, ids, how="left", indicator=True,
               right_on="ID", left_on="privatePatientID")
ebv.columns
ebv['mergeIssue'] = None
ebv = helpers.checkMerge2(ebv,
                          mergeCols2Check=['outcome', 'cohort'],
                          df1_label="Ebola Viral Seq Data", df2_label="Tulane metadata",
                          mergeCol="ID", dropMerge=False,
                          errorCol="mergeIssue", leftErrorMsg="", rightErrorMsg="")

ebv.mergeIssue.value_counts()

ebv.loc[ebv.mergeIssue == ebv.mergeIssue, ['sample_id', 'ncbi_accession',
                                           'outcome', 'outcome_x', 'outcome_y', 'cohort', 'cohort_x', 'cohort_y']]
ebv.groupby('KGH_id')._merge.value_counts()
ebv.columns

ebv.groupby("publication").KGH_id.value_counts()

ebv.iloc[253]

# [Lassa]  ----------------------------------------------------------------------------------------------------
lsv = pd.read_csv(lsv_file)


lsv.columns
lsv.head()

lsv['privatePatientID'] = lsv.sample_id.apply(helpers.interpretID)

lsv['outcome'] = lsv.outcome.apply(helpers.cleanOutcome)
lsv['cohort'] = "Lassa"
lsv['countryName'] = lsv.country

lsv['KGH_id'] = lsv.sample_id.apply(
    helpers.checkIDstructure).apply(lambda x: not x)

lsv['experimentID'] = lsv.apply(
    lambda x: "LSV_seq" + str(x.name).zfill(3), axis=1)
lsv['GenBank_ID'] = lsv.ncbi_accession
lsv['measurementTechnique'] = "viral sequencing"
lsv['dateModified'] = today
lsv['publisher'] = lsv.apply(getPublisher, axis=1)
lsv['publication'] = lsv.Source_PMID

# Import DNA sequences
lsv_seq = list(SeqIO.parse(
    "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/expt_summary_data/viral_seq/Sseg_lasv_mafft_aln_04102019.fasta", "fasta"))
lsv['data'] = None
lsv = getDNAseq(lsv_seq, lsv, 'sample_id')

sum(lsv.data.apply(lambda x: x is None))

lsv[exptCols].sample(4)

# Merge in the known set of ids...
lsv = pd.merge(lsv, ids, how="left", indicator=True,
               right_on="ID", left_on="privatePatientID")

lsv.groupby('KGH_id')._merge.value_counts()

lsv['mergeIssue'] = None
lsv = helpers.checkMerge2(lsv,
                          mergeCols2Check=['outcome', 'cohort'],
                          df1_label="Ebola Viral Seq Data", df2_label="Tulane metadata",
                          mergeCol="ID", dropMerge=False,
                          errorCol="mergeIssue", leftErrorMsg="", rightErrorMsg="")

lsv.mergeIssue.value_counts()
sum((lsv.countryName_x != lsv.countryName_y) &
    (lsv.countryName_y == lsv.countryName_y))

# [Merge and export: experimental data]  ----------------------------------------------------------------------------------------------------
expts = pd.concat([ebv[exptCols], lsv[exptCols]])
expts.to_json(f"{expt_dir}viral_seq_{today}.json", orient="records")
