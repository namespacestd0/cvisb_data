# @name:        compile_cvisb_data.py
# @summary:     compiles together all data for upload to the CViSB website.
# @description: Pulls in all data from the various data sources across CViSB, in the form of tabular data.
# @sources:
# @depends:     pandas, argparse
# @author:      Laura Hughes
# @email:       lhughes@scripps.edu
# @license:     Apache-2.0
# @date:        31 October 2019
# @use:         python compile_cvisb_data.py # imports / saves all
# @use:         python compile_cvisb_data.py -t patients hla lassa-viral-seq # only runs compilation for patient data (from Tulane), HLA data (from Andersen lab), Lassa viral sequencing data (from Andersen lab)

import pandas as pd
import argparse
import json
import logging
from helpers import setupLogging, log_msg, getSource
from datetime import datetime

# --- cleanup modules ---
import clean_viral_seq as viralseq
import clean_serology as serology
import clean_hla as hla
import clean_patients as patients
import config

"""
Parser inputs
"""
# setup command line argument parser
parser = argparse.ArgumentParser(description='Compile together data for CViSB from raw files')
parser.add_argument('--nosave', '-n', default=False, action='store_true',
                    help='supress saving all combined data as .jsons for upload')
parser.add_argument('--export-sample', '-e', required=False, type=int, default=0,
                    help='number of records to save a portion of as a test upload; 0 by default (as in, do not save a sample aside from the full download)')
parser.add_argument("--types", "-t", required=False,
                    # 0 or more values expected => creates a list
                    help="Which source types should be pulled in. Should correspond to the dataset IDs: one of 'patients', 'hla', 'lassa-viral-seq', 'ebola-viral-seq', 'systems-serology'. Multiple types can be specified by separating by a space, and by default all data will be combined.",  nargs="*",
                    type=str, default=["patients", "hla", "lassa-viral-seq", "systems-serology"])
                    # type=str, default=["patients", "hla", "lassa-viral-seq", "ebola-viral-seq", "systems-serology"])
parser.add_argument('--verbose', '-v', default=False, action='store_true', help='whether to print log file to the console')


"""
Function to call when fed the "types" argument.
Each function should return a dict of form:
{ "patient": [...], "sample": [...], "dataset": [...], "datadownload": [...], "experiment": [...] }
"""
SWITCHER = {
    "patient-dictionary": lambda: patients.compile_patient_roster(config.ACUTE_IDS_FILE, config.ACUTE_LASSA_FILE,
    config.SURVIVOR_IDS, config.SURVIVOR_EBOLA_FILE, config.DICTCOLS,
    config.PATIENTS_DATE, config.PATIENTS_UPDATEDBY, config.PATIENTS_VERSION, config.VERBOSE),
    "patients": lambda: patients.compile_patients(config.ACUTE_IDS_FILE, config.ACUTE_LASSA_IDS, config.ACUTE_LASSA_FILE,
    config.SURVIVOR_IDS, config.SURVIVOR_EBOLA_FILE, config.PATIENTCOLS, config.EXPTCOLS, config.DICTCOLS,
    config.PATIENTS_DATE, config.PATIENTS_UPDATEDBY, config.PATIENTS_VERSION, config.VERBOSE),
    "hla": lambda:  hla.clean_hla(config.EXPORTDIR, config.HLA_FILE, config.HLA_DATE, config.HLA_VERSION, config.HLA_UPDATEDBY, config.EXPTCOLS, config.PATIENTCOLS, config.SAMPLECOLS, config.DOWNLOADCOLS, config.SAVEINIVIDUAL, config.VERBOSE),
    "systems-serology": lambda: serology.clean_serology(config.SEROLOGY_FILE, config.EXPTCOLS,
    config.SEROLOGY_UPDATEDBY, config.SEROLOGY_DATE, config.SEROLOGY_VERSION, config.VERBOSE, config.EXPORTDIR),
    "lassa-viral-seq": lambda: viralseq.clean_viral_seq(config.EXPORTDIR, config.LVIRAL_AAFILE, config.LVIRAL_ALIGNEDFILE,
                                                        config.LVIRAL_RAWFILE, config.LVIRAL_MDFILE, config.ID_DICT,
                                                        config.EXPTCOLS, config.PATIENTCOLS, config.SAMPLECOLS, config.DOWNLOADCOLS,
                                                        config.LVIRAL_DATE, config.LVIRAL_VERSION, config.LVIRAL_UPDATEDBY,
                                                        config.SAVEINIVIDUAL, config.VERBOSE),
    "ebola-viral-seq": lambda: viralseq.clean_ebola_viral_seq(config.EXPORTDIR, config.EVIRAL_ALIGNEDFILE,
                                                        config.EVIRAL_MDFILE,
                                                        config.EXPTCOLS, config.PATIENTCOLS, config.SAMPLECOLS, config.DOWNLOADCOLS,
                                                        config.EVIRAL_DATE, config.EVIRAL_VERSION, config.EVIRAL_UPDATEDBY,
                                                        config.SAVEINIVIDUAL, config.VERBOSE)
}


def call_cleaning(type, *args):
    result = SWITCHER.get(type, lambda *_: "ERROR: source type not valid")(*args)
    return(result)

"""
Logging setup
"""
setupLogging(config.LOGFILE)


"""
Compiles together all data after they have been cleaned, compiled, and coerced into
the CViSB data schema format.  After each cleanup function has been called, the data
are saved as a .json to be uploaded.
"""
def compile_data(args):
    config.VERBOSE = args.verbose
    log_msg(f"{datetime.today()}: starting CViSB data cleanup", args.verbose)
    # empty arrays to hold results
    patients = pd.DataFrame()
    samples = pd.DataFrame()
    datasets = pd.DataFrame()
    datadownloads = pd.DataFrame()
    experiments = pd.DataFrame()

    # clean, then combine.
    for type in args.types:
        log_msg(f"\n{'*'*150}", args.verbose)
        log_msg(f"cleaning {type}", args.verbose)

        result = call_cleaning(type)
        log_msg(f"\ncleaning for {type} finished.", args.verbose)
        log_msg(f"\t{len(result['patient'])} patients added.", args.verbose)
        log_msg(f"\t{len(result['sample'])} samples added.", args.verbose)
        log_msg(f"\t{len(result['experiment'])} experiments added.", args.verbose)
        log_msg(f"\t{len(result['dataset'])} datasets added.", args.verbose)
        log_msg(f"\t{len(result['datadownload'])} data downloads added.", args.verbose)
        log_msg(f"{'*'*150}\n", args.verbose)

        patients = pd.concat([patients, result["patient"]], ignore_index=True)
        samples = pd.concat([samples, result["sample"]], ignore_index=True)
        experiments = pd.concat(
            [experiments, result["experiment"]], ignore_index=True)
        datasets = pd.concat([datasets, result["dataset"]], ignore_index=True)
        datadownloads = pd.concat(
            [datadownloads, result["datadownload"]], ignore_index=True)

    # check that there's no duplicate IDs!
    log_msg("\n\nChecking IDs to ensure no duplicates...", args.verbose)
    if(len(patients) > 0):
        checkIDs(patients, 'patient', "patientID", args.verbose)
    if(len(samples) > 0):
        checkIDs(samples, 'sample', "sampleID", args.verbose)
    if(len(experiments) > 0):
        checkIDs(experiments, 'experiment', "experimentID", args.verbose)
    if(len(datasets) > 0):
        checkIDs(datasets, "dataset", "identifier", args.verbose)
    if(len(datadownloads) > 0):
        checkIDs(datadownloads, "datadownload", "identifier", args.verbose)
    log_msg("done checking for duplicate IDs.", args.verbose)


    combined = cleanCombined(patients, samples, experiments, datasets, datadownloads)
    # print(combined)

    # --- save jsons ---
    if(not args.nosave):
        saveJson(
            combined['patient'], f"{config.EXPORTDIR}/patients/CViSB__patient_ALL_{config.today}.json")
        saveJson(
            combined['sample'], f"{config.EXPORTDIR}/samples/CViSB__sample_ALL_{config.today}.json")
        saveJson(
            combined['dataset'], f"{config.EXPORTDIR}/datasets/CViSB__dataset_ALL_{config.today}.json")
        saveJson(combined['datadownload'],
                 f"{config.EXPORTDIR}/datadownloads/CViSB__datadownload_ALL_{config.today}.json")
        saveJson(combined['experiment'],
                 f"{config.EXPORTDIR}/experiments/CViSB__experiment_ALL_{config.today}.json")

    # --- save a sample of the data ---
    sample_n = args.export_sample
    if(sample_n > 0):
        if(sample_n < len(combined['patient'])):
            psample = combined['patient'].sample(sample_n)
        else:
            psample = combined['patient']

        if(sample_n < len(combined['sample'])):
            ssample = combined['sample'].sample(sample_n)
        else:
            ssample = combined['sample']

        if(sample_n < len(combined['dataset'])):
            dssample = combined['dataset'].sample(sample_n)
        else:
            dssample = combined['dataset']

        if(sample_n < len(combined['datadownload'])):
            dsample = combined['datadownload'].sample(sample_n)
        else:
            dsample = combined['datadownload']

        if(sample_n < len(combined['experiment'])):
            esample = combined['experiment'].sample(sample_n)
        else:
            esample = combined['experiment']

        saveJson(psample, f"{config.EXPORTDIR}/patients/CViSB__patient-randomsample_{config.today}.json")
        saveJson(ssample, f"{config.EXPORTDIR}/samples/CViSB__sample-randomsample_{config.today}.json")
        saveJson(dssample, f"{config.EXPORTDIR}/datasets/CViSB__dataset-randomsample_{config.today}.json")
        saveJson(dsample, f"{config.EXPORTDIR}/datadownloads/CViSB__datadownload-randomsample_{config.today}.json")
        saveJson(esample, f"{config.EXPORTDIR}/experiments/CViSB__experiment-randomsample_{config.today}.json")

    return(combined)

"""
Function to handle combining all the data into a single object; also allows for
any global changes that need to be made at the end.
For example: creating `sourceCitation`, which is `row.citation ? row.citation : rowpublisher;`
"""
def cleanCombined(patients, samples, experiments, datasets, datadownloads):
    experiments['sourceCitation'] = experiments.apply(getSource, axis = 1)
    patients['sourceCitation'] = patients.apply(getSource, axis = 1)

    combined = {"patient": patients, "sample": samples, "dataset": datasets,
                "datadownload": datadownloads, "experiment": experiments}
    return(combined)

def saveJson(data, export_file):
    # with open(export_file, 'w') as outfile:
        # json.dump(data, outfile)
    data.to_json(export_file, orient="records")


def checkIDs(df, type, variable, verbose):
    dupes = df[df.duplicated(subset=[variable])]
    if(len(dupes) > 0):
        log_msg(f"\tDATA ERROR: {type} contains {len(dupes)} duplicate ids:", verbose)
        log_msg("\t\t" + str(pd.unique(dupes[variable])), verbose)

if __name__ == '__main__':
    compile_data(parser.parse_args())
