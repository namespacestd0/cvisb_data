CVISB_DEFAULT_SETTINGS = {
    'index': {
        'number_of_shards': '10',
        'auto_expand_replicas': '0-all',
        'number_of_replicas': '0'
    }
}

CVISB_ENDPOINTS = {
    "sample": {
        "cache_key": "Sample",
        "private_index": "sample_metadata_current",
        "public_index": "sample_metadata_public_current",
        "public_fields": ['AVLinactivated', 'species', 'freezingBuffer', 'derivedIndex', 'dilutionFactor', 'protocolURL', 'patientID', 'sampleType', 'protocolVersion', 'sampleGroup', 'dateModified', 'visitCode'],
        "elasticsearch_public_index_body": {
            "settings": CVISB_DEFAULT_SETTINGS,
            "mappings": {
                "sample": {
                    "dynamic": "true",
                    "dynamic_date_formats": ["yyyy-MM-dd"]
                }
            }
        },
        "elasticsearch_private_index_body": {
            "settings": CVISB_DEFAULT_SETTINGS,
            "mappings": {
                "sample": {
                    "dynamic": "true",
                    "dynamic_date_formats": ["yyyy-MM-dd"]
                }
            }
        }
    },
    "datadownload": {
        "cache_key": "DataDownload",
        "private_index": "datadownload_metadata_current",
        "public_index": "datadownload_metadata_public_current",
        "public_fields": ['sourceCode.author.contactPoint.contactType', 'author.address.addressCountry.url', 'sourceCode.publication.pageEnd', 'datePublished', '@id', 'publisher.address.addressLocality', 'author.address.addressRegion', 'publication.name', 'sourceCode.publication.datePublished', 'sourceCode.author.address.addressLocality', 'sourceCode.author.contactPoint.email', 'author.address.addressCountry.name', 'sourceCode.publication.name', 'publisher.award', 'author.address.addressCountry.identifier', 'sourceCode.@id', 'publisher.contactPoint.url', 'author.name', 'author.logo', 'publisher.address.streetAddress', 'sourceCode.citation', 'additionalType', 'sourceCode.publication.identifier', 'dateCreated', 'publisher.contactPoint.email', 'description', 'sourceCode.publication.journalName', 'sourceCode.author.url', 'sourceCode.author.award', 'publisher.address.addressRegion', 'sourceCode.author.address.addressCountry.url', 'publisher.email', 'author.award', 'keywords', 'author.contactPoint.email', 'publisher.address.addressCountry.identifier', 'sourceCode.publication.pageStart', 'sourceCode.author.name', 'experimentIDs', 'publisher.name', 'sourceCode.version', 'author.description', 'measurementTechnique', 'publication.pageStart', 'publication.journalName', 'author.contactPoint.url', 'isBasedOn', 'sourceCode.author.address.addressCountry.alternateName', 'contentUrl', 'publication.volumeNumber', 'sourceCode.dateModified', 'sourceCode.codeRepository', 'sourceCode.programmingLanguage', 'sourceCode.author.logo', 'publisher.address.addressCountry.name', 'sourceCode.author.email', 'publisher.contactPoint.contactType', 'sourceCode.identifier', 'sourceCode.author.address.addressRegion', 'publication.pageEnd', 'author.address.addressCountry.alternateName', 'sourceCode.author.parentOrganization', 'sourceCode.license', 'sourceCode.publication.volumeNumber', 'dateModified', 'publisher.address.postalCode', 'publication.datePublished', 'publisher.url', 'author.parentOrganization', 'author.alternateName', 'author.contactPoint.contactType', 'publisher.address.addressCountry.url', 'publisher.address.addressCountry.alternateName', 'sourceCode.author.description', 'author.address.postalCode', 'publication.url', 'publisher.parentOrganization', 'sourceCode.description', 'publisher.logo', 'sourceCode.author.contactPoint.url', 'publisher.alternateName', 'sourceCode.publication.url', 'includedInDataset', 'name', 'publication.identifier', 'sourceCode.datePublished', 'encodingFormat', 'sourceCode.author.alternateName', 'author.url', 'sourceCode.publication.issueNumber', 'author.email', 'contentUrlRepository', 'author.address.streetAddress', 'sourceCode.author.address.postalCode', 'identifier', 'sourceCode.author.address.streetAddress', 'sameAs', 'publication.issueNumber', 'sourceCode.name', 'author.address.addressLocality', 'contentUrlIdentifier', 'publisher.description', 'sourceCode.author.address.addressCountry.name', 'sourceCode.author.address.addressCountry.identifier'], 
        "elasticsearch_public_index_body": {
            "settings": CVISB_DEFAULT_SETTINGS,
            "mappings": {
                "datadownload": {
                    "dynamic": "true",
                    "dynamic_date_formats": ["yyyy-MM-dd"]
                }
            }
        },
        "elasticsearch_private_index_body": {
            "settings": CVISB_DEFAULT_SETTINGS,
            "mappings": {
                "datadownload": {
                    "dynamic": "true",
                    "dynamic_date_formats": ["yyyy-MM-dd"]
                }
            }
        }
    },
    "dataset": {
        "cache_key": "Dataset",
        "private_index": 'dataset_metadata_current',
        "public_index": 'dataset_metadata_public_current',
        "public_fields": ['distribution.publisher.alternateName', 'funder.email', 'sourceCode.author.contactPoint.contactType', 'author.address.addressCountry.url', 'publisher.address.addressLocality', '@id', 'dataDownloadIDs', 'distribution.sameAs', 'distribution.publisher.contactPoint.email', 'spatialCoverage.identifier', 'sourceCode.author.address.addressLocality', 'funder.address.addressCountry.name', 'sourceCode.author.contactPoint.email', 'distribution.sourceCode.author.alternateName', 'distribution.sourceCode.author.url', 'citation.pageEnd', 'sourceCode.publication.name', 'distribution.publisher.address.addressRegion', 'variableMeasured', 'funder.contactPoint.email', 'distribution.author.name', 'sourceCode.@id', 'publisher.contactPoint.url', 'author.name', 'distribution.sourceCode.publication.volumeNumber', 'publisher.address.streetAddress', 'distribution.publisher.award', 'funder.contactPoint.url', 'distribution.@id', 'sourceCode.publication.journalName', 'distribution.sourceCode.author.address.postalCode', 'publisher.contactPoint.email', 'sourceCode.author.award', 'distribution.author.address.addressCountry.name', 'funder.logo', 'publisher.address.addressRegion', 'distribution.author.contactPoint.url', 'sourceCode.author.address.addressCountry.url', 'funder.address.addressCountry.identifier', 'license', 'publisher.email', 'distribution.datePublished', 'distribution.publisher.address.addressCountry.url', 'spatialCoverage.alternateName', 'distribution.author.alternateName', 'author.contactPoint.email', 'distribution.sourceCode.author.address.addressCountry.url', 'distribution.sourceCode.author.address.addressCountry.identifier', 'funder.parentOrganization', 'spatialCoverage.url', 'funder.url', 'distribution.publication.volumeNumber', 'distribution.sourceCode.author.logo', 'sourceCode.publication.pageStart', 'funder.award', 'distribution.publisher.name', 'distribution.contentUrl', 'publisher.name', 'distribution.author.address.addressCountry.identifier', 'author.description', 'distribution.sourceCode.author.address.addressCountry.name', 'author.contactPoint.url', 'funder.address.addressRegion', 'distribution.author.address.postalCode', 'distribution.publisher.parentOrganization', 'distribution.author.contactPoint.contactType', 'sourceCode.dateModified', 'sourceCode.codeRepository', 'sourceCode.programmingLanguage', 'sourceCode.author.logo', 'spatialCoverage.name', 'funder.address.addressCountry.alternateName', 'publisher.address.addressCountry.name', 'distribution.identifier', 'distribution.publication.journalName', 'distribution.isBasedOn', 'sourceCode.identifier', 'distribution.publication.pageStart', 'citation.issueNumber', 'url', 'publisher.url', 'publisher.address.addressCountry.url', 'author.contactPoint.contactType', 'author.alternateName', 'distribution.author.description', 'funder.address.postalCode', 'publisher.parentOrganization', 'funder.address.addressLocality', 'distribution.sourceCode.description', 'publisher.alternateName', 'sourceCode.publication.url', 'distribution.publication.url', 'distribution.author.address.addressCountry.url', 'distribution.author.email', 'distribution.sourceCode.publication.issueNumber', 'sourceCode.datePublished', 'sourceCode.author.alternateName', 'distribution.sourceCode.name', 'distribution.sourceCode.publication.pageEnd', 'distribution.publisher.email', 'author.address.streetAddress', 'sourceCode.author.address.postalCode', 'distribution.sourceCode.publication.name', 'distribution.sourceCode.citation', 'distribution.sourceCode.author.contactPoint.contactType', 'distribution.sourceCode.version', 'sourceCode.author.address.streetAddress', 'distribution.contentUrlRepository', 'distribution.publication.name', 'sameAs', 'distribution.author.url', 'distribution.sourceCode.@id', 'author.address.addressLocality', 'publisher.description', 'sourceCode.name', 'publication', 'distribution.author.logo', 'distribution.keywords', 'temporalCoverage.gte', 'distribution.description', 'datePublished', 'temporalCoverage.lt', 'distribution.publication.datePublished', 'author.address.addressRegion', 'distribution.sourceCode.author.email', 'distribution.sourceCode.author.address.addressRegion', 'sourceCode.publication.pageEnd', 'distribution.sourceCode.author.address.addressCountry.alternateName', 'temporalCoverage.lte', 'distribution.author.address.addressRegion', 'sourceCode.publication.datePublished', 'distribution.sourceCode.author.address.streetAddress', 'distribution.publisher.address.streetAddress', 'distribution.sourceCode.author.contactPoint.email', 'author.address.addressCountry.name', 'publisher.award', 'distribution.sourceCode.programmingLanguage', 'author.address.addressCountry.identifier', 'distribution.author.award', 'distribution.dateCreated', 'author.logo', 'distribution.sourceCode.author.award', 'distribution.publisher.address.postalCode', 'sourceCode.citation', 'sourceCode.publication.identifier', 'funder.contactPoint.contactType', 'sourceCode.author.url', 'description', 'distribution.measurementTechnique', 'funder.name', 'schemaVersion', 'author.award', 'citation.volumeNumber', 'distribution.publisher.address.addressLocality', 'keywords', 'distribution.sourceCode.author.description', 'distribution.experimentIDs', 'publisher.address.addressCountry.identifier', 'distribution.publisher.url', 'distribution.publication.identifier', 'distribution.author.address.streetAddress', 'distribution.publisher.contactPoint.contactType', 'sourceCode.author.name', 'sourceCode.version', 'funder.address.addressCountry.url', 'distribution.name', 'measurementTechnique', 'funder.alternateName', 'distribution.sourceCode.author.name', 'distribution.sourceCode.publication.identifier', 'sourceCode.author.address.addressCountry.alternateName', 'funder.address.streetAddress', 'distribution.sourceCode.publication.pageStart', 'distribution.author.contactPoint.email', 'distribution.encodingFormat', 'funder.description', 'distribution.sourceCode.license', 'sourceCode.author.email', 'publisher.contactPoint.contactType', 'distribution.publication.pageEnd', 'distribution.publisher.contactPoint.url', 'distribution.sourceCode.author.contactPoint.url', 'includedInDataCatalog', 'author.address.addressCountry.alternateName', 'distribution.sourceCode.codeRepository', 'sourceCode.author.address.addressRegion', 'sourceCode.author.parentOrganization', 'sourceCode.license', 'citation.name', 'distribution.sourceCode.identifier', 'dateModified', 'distribution.publisher.address.addressCountry.name', 'distribution.sourceCode.datePublished', 'sourceCode.publication.volumeNumber', 'distribution.publication.issueNumber', 'publisher.address.postalCode', 'author.parentOrganization', 'sourceCode.author.description', 'publisher.address.addressCountry.alternateName', 'distribution.publisher.description', 'author.address.postalCode', 'distribution.author.address.addressLocality', 'temporalCoverage.gt', 'citation.url', 'distribution.publisher.address.addressCountry.alternateName', 'sourceCode.description', 'publisher.logo', 'sourceCode.author.contactPoint.url', 'citation.pageStart', 'citation.journalName', 'citation.datePublished', 'name', 'distribution.publisher.address.addressCountry.identifier', 'distribution.includedInDataset', 'sourceCode.publication.issueNumber', 'author.url', 'author.email', 'distribution.sourceCode.publication.datePublished', 'distribution.author.parentOrganization', 'distribution.sourceCode.author.address.addressLocality', 'identifier', 'distribution.author.address.addressCountry.alternateName', 'distribution.publisher.logo', 'distribution.sourceCode.publication.url', 'distribution.sourceCode.author.parentOrganization', 'distribution.sourceCode.publication.journalName', 'distribution.sourceCode.dateModified', 'distribution.dateModified', 'sourceCode.author.address.addressCountry.name', 'sourceCode.author.address.addressCountry.identifier', 'citation.identifier', 'distribution.additionalType', 'distribution.contentUrlIdentifier'],
        "elasticsearch_private_index_body": {
            "settings": CVISB_DEFAULT_SETTINGS,
            "mappings": {
                "dataset": {
                    "dynamic": "true",
                    "dynamic_date_formats": ["yyyy-MM-dd"],
                    "dynamic_templates": [
                        {
                            "temporalCoverageDateRange": {
                                "path_match": "temporalCoverage",
                                "mapping": {
                                    "dynamic": "false",
                                    "format": "yyyy-MM-dd",
                                    "type": "date_range"
                                }
                            }
                        }
                    ]
                }
            }
        },
        "elasticsearch_public_index_body": {
            "settings": CVISB_DEFAULT_SETTINGS,
            "mappings": {
                "dataset": {
                    "dynamic": "true",
                    "dynamic_date_formats": ["yyyy-MM-dd"],
                    "dynamic_templates": [
                        {
                            "temporalCoverageDateRange": {
                                "path_match": "temporalCoverage",
                                "mapping": {
                                    "dynamic": "false",
                                    "format": "yyyy-MM-dd",
                                    "type": "date_range"
                                }
                            }
                        }
                    ]
                }
            }
        }
    },
    "experiment": {
        "cache_key": "Experiment",
        "private_index": 'experiment_metadata_current',
        "public_index": 'experiment_metadata_public_current',
        "public_fields": ['experimentID', 'data.DRB1', 'analysisCode.publication.name', 'batchID', 'publisher.address.addressLocality', 'publication.name', 'data.SNP.mutatedAA', 'data.skinTemperature.skinTemperature', 'data.DPA1', 'data.y', 'data.daysSinceAdmit', 'data.time', 'publisher.contactPoint.url', 'data.systolicPressure', 'publisher.address.streetAddress', 'analysisCode.author.address.addressCountry.url', 'analysisCode.publication.issueNumber', 'data.SNPlocation', 'publisher.contactPoint.email', 'data.diastolicPressure', 'data.SNP.SNP', 'data.systolicPressure.systolicPressure', 'publisher.address.addressRegion', 'publisher.email', 'data.DRB4', 'data.diastolicPressure.time', 'data.meanArterialPressure.meanArterialPressure', 'data.accelerometry.z', 'data.meanArterialPressure', 'publisher.name', 'data.SNP.originalAA', 'publication.journalName', 'analysisCode.author.name', 'analysisCode.author.logo', 'data.alanineAminotransferase', 'data.totalProtein', 'analysisCode.publication.journalName', 'patientID', 'GenBank_ID', 'analysisCode.@id', 'data.totalBilirubin', 'data.aspatateAminotransferase', 'analysisCode.author.url', 'data.DRB5', 'publisher.address.addressCountry.name', 'data.SNP.SNPdetected', 'analysisCode.publication.url', 'analysisCode.author.address.addressCountry.name', 'data.creatinine', 'data.mutatedAA', 'data.albumin', 'data.DQA1', 'publisher.url', 'publisher.address.addressCountry.url', 'publication.datePublished', 'data.respiratoryRate.time', 'analysisCode.author.address.streetAddress', 'analysisCode.publication.identifier', 'publisher.parentOrganization', 'publication.url', 'data.C', 'data.bodyTemperature.time', 'data.ECG.voltage', 'publisher.alternateName', 'data.timepoint', 'data.heartRate', 'publication.identifier', 'analysisCode.description', 'data.meanArterialPressure.time', 'analysisCode.dateModified', 'data.totalCarbonDioxide', 'data.diastolicPressure.diastolicPressure', 'data.DQB1', 'data.accelerometry.time', 'analysisCode.license', 'data.skinTemperature.time', 'analysisCode.publication.datePublished', 'publisher.description', 'analysisCode.author.parentOrganization', 'analysisCode.publication.volumeNumber', 'analysisCode.name', 'data.z', 'data.DRB3', 'data.voltage', 'analysisCode.author.address.addressRegion', 'analysisCode.author.description', 'data.originalAA', 'data.AAsequence', 'data.systolicPressure.time', 'data.accelerometry.x', 'data.bodyTemperature', 'data.B', 'analysisCode.author.address.addressLocality', 'data.heartRate.heartRate', 'analysisCode.citation', 'data.alkalinePhosphatase', 'data.respiratoryRate.respiratoryRate', 'publisher.award', 'analysisCode.version', 'data.sodium', 'analysisCode.author.address.addressCountry.alternateName', 'analysisCode.publication.pageStart', 'analysisCode.author.contactPoint.url', 'data.DPB1', 'analysisCode.author.address.addressCountry.identifier', 'description', 'data.isReferenceSeq', 'analysisCode.author.address.postalCode', 'analysisCode.author.email', 'data.heartRate.time', 'publisher.address.addressCountry.identifier', 'analysisCode.identifier', 'analysisCode.author.contactPoint.email', 'data.oxygenSaturation.time', 'experimentDate', 'measurementTechnique', 'publication.pageStart', 'data.oxygenSaturation.oxygenSaturation', 'data.x', 'data.SNPdetected', 'data.respiratoryRate', 'data.SNP.SNPlocation', 'publication.volumeNumber', 'analysisCode.author.alternateName', 'analysisCode.datePublished', 'publisher.contactPoint.contactType', 'analysisCode.publication.pageEnd', 'data.SNP', 'analysisCode.codeRepository', 'SRA_ID', 'publication.pageEnd', 'analysisCode.programmingLanguage', 'dateModified', 'publisher.address.postalCode', 'data.referenceSeq', 'publisher.address.addressCountry.alternateName', 'data.glucose', 'publisher.logo', 'data.ECG.time', 'data.oxygenSaturation', 'data.skinTemperature', 'data.bodyTemperature.bodyTemperature', 'data.calcium', 'name', 'data.virus', 'data.accelerometry.y', 'data.chloride', 'data.bloodUreaNitrogen', 'data.A', 'analysisCode.author.award', 'publication.issueNumber', 'analysisCode.author.contactPoint.contactType', 'data.potassium', 'data.DNAsequence'], 
        "elasticsearch_private_index_body": {
            "settings": CVISB_DEFAULT_SETTINGS,
            "mappings": {
                "experiment": {
                    "dynamic": "true",
                    "dynamic_date_formats": ["yyyy-MM-dd"]
                }
            }
        },
        "elasticsearch_public_index_body": {
            "settings": CVISB_DEFAULT_SETTINGS,
            "mappings": {
                "experiment": {
                    "dynamic": "true",
                    "dynamic_date_formats": ["yyyy-MM-dd"]
                }
            }
        }
    },
    "patient": {
        "cache_key": "Patient",
        "public_index": 'patient_metadata_public_current',
        "private_index": 'patient_metadata_current',
        "public_fields": ['symptoms.symptoms.hepatomegaly', 'piccolo.piccolo.RUQtenderness', 'contactGroupIdentifier', 'symptoms.symptoms.crepitations', 'medications.drug', 'symptoms.symptoms.headache', 'comaScore.motorResponse', 'piccolo.piccolo.splenomegaly', 'piccolo.piccolo.confusion', 'piccolo.piccolo.inflammation', 'pregnant', 'symptoms.symptoms.jointSwelling', 'weight', 'piccolo.piccolo.side_pain', 'symptoms.timepoint', 'piccolo.piccolo.noSymptoms', 'rapidDiagostics.RDTresult', 'elisa.ELISAvalue', 'piccolo.piccolo.lymphadenopathy', 'rtpcr.viralLoad', 'symptoms.symptoms.bleeding_none', 'symptoms.symptoms.vomit', 'symptoms.symptoms.edema', 'piccolo.piccolo.other_pain', 'piccolo.piccolo.bleeding_gums', 'symptoms.symptoms.burning_eyes', 'symptoms.symptoms.bleeding_vaginal', 'symptoms.symptoms.malaise', 'LassaExposed', 'symptoms.symptoms.hiccups', 'symptoms.symptoms.soreThroat', 'symptoms.symptoms.light_sensitivity', 'comaScore.eyeOpening', 'symptoms.symptoms.eye_foreign_body_sensation', 'piccolo.piccolo.otherSymptoms', 'piccolo.piccolo.burning_eyes', 'piccolo.piccolo.bleeding_hematoma', 'symptoms.symptoms.abdominalTenderness', 'piccolo.piccolo.abdominal_pain', 'symptoms.symptoms.blurry_vision', 'symptoms.symptoms.side_pain', 'patientID', 'piccolo.piccolo.seizures', 'symptoms.symptoms.dyspnea', 'symptoms.symptoms.fever', 'symptoms.symptoms.bleeding_gums', 'piccolo.piccolo.hiccups', 'symptoms.daysSinceAdmit', 'symptoms.symptoms.inflammation', 'medications.doseUnits', 'gender', 'daysOnset', 'symptoms.symptoms.joint_pain', 'medications.doseDuration', 'piccolo.piccolo.headache', 'country.identifier', 'piccolo.piccolo.bleeding_urine', 'symptoms.symptoms.hearing_loss', 'piccolo.timepoint', 'piccolo.piccolo.malaise', 'symptoms.symptoms.dizziness', 'piccolo.piccolo.joint_pain', 'admittedLassaWard', 'outcome', 'symptoms.symptoms.bleeding_nose', 'symptoms.symptoms.seizures', 'cohort', 'elisa.assayType', 'symptoms.symptoms.bleeding_sputum', 'rtpcr.RTPCRvalue', 'elisa.virus', 'piccolo.piccolo.eye_foreign_body_sensation', 'symptoms.symptoms.shortnessBreath', 'symptoms.symptoms.lymphadenopathy', 'symptoms.symptoms.bleeding_urine', 'piccolo.piccolo.tremors', 'symptoms.symptoms.bleeding_stools', 'piccolo.piccolo.blurry_vision', 'piccolo.piccolo.conjunctivitis', 'piccolo.piccolo.diarrhea', 'sameAs', 'piccolo.daysSinceAdmit', 'relatedTo', 'symptoms.symptoms.splenomegaly', 'symptoms.symptoms.RUQtenderness', 'piccolo.piccolo.bleeding_nose', 'comaScore.verbalResponse', 'symptoms.symptoms.confusion', 'country.name', 'symptoms.symptoms.convulsions', 'symptoms.symptoms.cough', 'piccolo.piccolo.jointSwelling', 'country.url', 'symptoms.symptoms.decreasedUrination', 'symptoms.symptoms.rash', 'elisa.ELISAresult', 'symptoms.symptoms.abdominal_pain', 'piccolo.piccolo.rales', 'piccolo.piccolo.disorientation', 'height', 'rtpcr.RTPCRresult', 'symptoms.symptoms.appetiteLoss', 'symptoms.symptoms.muscle_pain', 'medications.doseFrequency', 'piccolo.piccolo.eye_pain', 'piccolo.piccolo.retrosternal_pain', 'piccolo.piccolo.bleeding_vaginal', 'piccolo.piccolo.shortnessBreath', 'medications.doseNumeric', 'medications.daysSinceAdmit', 'symptoms.symptoms.vision_loss', 'symptoms.symptoms.bleeding_injection', 'symptoms.symptoms.rales', 'symptoms.symptoms.bleeding_other', 'piccolo.piccolo.fever', 'LassaHHDeaths', 'piccolo.piccolo.light_sensitivity', 'piccolo.piccolo.bleeding_injection', 'piccolo.piccolo.hepatomegaly', 'daysInHospital', 'comaScore.glasgowComaScore', 'medications.drugRoute', 'piccolo.piccolo.facialSwelling', 'symptoms.symptoms.otherSymptoms', 'symptoms.symptoms.dry_eyes', 'piccolo.piccolo.vision_loss', 'piccolo.piccolo.convulsions', 'symptoms.symptoms.eye_pain', 'age', 'symptoms.symptoms.bleeding_hematoma', 'piccolo.piccolo.appetiteLoss', 'piccolo.piccolo.decreasedUrination', 'piccolo.piccolo.weakness', 'piccolo.piccolo.jaundice', 'symptoms.symptoms.noSymptoms', 'piccolo.piccolo.rash', 'dateModified', 'symptoms.symptoms.disorientation', 'country.alternateName', 'infectionYear', 'comaScore.daysSinceAdmit', 'piccolo.piccolo.cough', 'symptoms.symptoms.conjunctivitis', 'piccolo.piccolo.edema', 'symptoms.symptoms.retrosternal_pain', 'symptoms.symptoms.bleeding_vomit', 'piccolo.piccolo.dizziness', 'rapidDiagostics.virus', 'piccolo.piccolo.bleeding_stools', 'symptoms.symptoms.other_pain', 'piccolo.piccolo.back_pain', 'piccolo.piccolo.soreThroat', 'piccolo.piccolo.bleeding_sputum', 'piccolo.piccolo.bleeding_vomit', 'symptoms.symptoms.jaundice', 'symptoms.symptoms.facialSwelling', 'symptoms.symptoms.diarrhea', 'piccolo.piccolo.bleeding_other', 'symptoms.symptoms.weakness', 'elisa.timepoint', 'symptoms.symptoms.ringing_in_ears', 'piccolo.piccolo.abdominalTenderness', 'rtpcr.virus', 'piccolo.piccolo.dyspnea', 'piccolo.piccolo.hearing_loss', 'piccolo.piccolo.vomit', 'symptoms.symptoms.tremors', 'piccolo.piccolo.bleeding_none', 'piccolo.piccolo.ringing_in_ears', 'piccolo.piccolo.muscle_pain', 'piccolo.piccolo.dry_eyes', 'symptoms.symptoms.back_pain', 'piccolo.piccolo.crepitations'], 
        "elasticsearch_private_index_body": {
            "settings": CVISB_DEFAULT_SETTINGS,
            "mappings": {
                "patient": {
                    'dynamic': 'true',
                    'dynamic_date_formats': ['yyyy-MM-dd'],
                    'dynamic_templates': [
                        {
                            'infectionDateRange': {
                                'path_match': 'infectionDate',
                                'mapping': {
                                    'dynamic': 'false',
                                    'format': 'yyyy-MM-dd',
                                    'type': 'date_range'
                                }
                            }
                        },
                        #{
                        #    'infectionYearRange': {
                        #        'path_match': 'infectionYear',
                        #        'mapping': {
                        #            'dynamic': 'false',
                        #            'format': 'yyyy-MM-dd',
                        #            'type': 'date_range'
                        #        }
                        #    }
                        #},
                        {
                            'elisaNested': {
                                'path_match': 'elisa',
                                'mapping': {
                                    'dynamic': 'true',
                                    'type': 'nested'
                                }
                            }
                        }
                    ]
                }
            }
        },
        "elasticsearch_public_index_body": {
            "settings": CVISB_DEFAULT_SETTINGS,
            "mappings": {
                "patient": {
                    'dynamic': 'true',
                    'dynamic_date_formats': ['yyyy-MM-dd'],
                    'dynamic_templates': [
                        {
                            'infectionDateRange': {
                                'path_match': 'infectionDate',
                                'mapping': {
                                    'dynamic': 'false',
                                    'format': 'yyyy-MM-dd',
                                    'type': 'date_range'
                                }
                            }
                        },
                        #{
                        #    'infectionYearRange': {
                        #        'path_match': 'infectionYear',
                        #        'mapping': {
                        #            'dynamic': 'false',
                        #            'format': 'yyyy-MM-dd',
                        #            'type': 'date_range'
                        #        }
                        #    }
                        #},
                        {
                            'elisaNested': {
                                'path_match': 'elisa',
                                'mapping': {
                                    'dynamic': 'true',
                                    'type': 'nested'
                                }
                            }
                        }
                    ]
                }
            }
        }
    },
    "datacatalog": {
        "cache_key": "DataCatalog",
        "private_index": 'datacatalog_metadata_current',
        "public_index": 'datacatalog_metadata_public_current',
        "public_fields": ['funder.address.addressCountry.alternateName', 'spatialCoverage.name', 'funder.email', 'temporalCoverage.gte', 'publisher.address.addressCountry.name', 'funder.description', 'datePublished', '@id', 'temporalCoverage.lt', 'publisher.address.addressLocality', 'publisher.contactPoint.contactType', 'temporalCoverage.lte', 'spatialCoverage.identifier', 'funder.address.addressCountry.name', 'dateModified', 'url', 'publisher.url', 'publisher.award', 'publisher.address.addressCountry.url', 'publisher.address.postalCode', 'publisher.address.addressCountry.alternateName', 'funder.contactPoint.email', 'alternateName', 'temporalCoverage.gt', 'publisher.contactPoint.url', 'funder.address.postalCode', 'publisher.address.streetAddress', 'publisher.parentOrganization', 'funder.address.addressLocality', 'publisher.logo', 'funder.contactPoint.url', 'publisher.alternateName', 'funder.contactPoint.contactType', 'publisher.contactPoint.email', 'dataset', 'description', 'funder.name', 'funder.logo', 'schemaVersion', 'publisher.address.addressRegion', 'funder.address.addressCountry.identifier', 'publisher.email', 'name', 'spatialCoverage.alternateName', 'keywords', 'funder.parentOrganization', 'publisher.address.addressCountry.identifier', 'spatialCoverage.url', 'funder.url', 'funder.award', 'funder.address.addressCountry.url', 'publisher.name', 'identifier', 'funder.address.addressRegion', 'funder.alternateName', 'sameAs', 'publisher.description', 'funder.address.streetAddress', 'releaseVersion'], 
        "elasticsearch_private_index_body": {
            "settings": CVISB_DEFAULT_SETTINGS,
            "mappings": {
                'datacatalog': {
                    'dynamic': 'true',
                    'dynamic_date_formats': ['yyyy-MM-dd'],
                    'dynamic_templates': [
                        {
                            'temporalCoverageDateRange': {
                                'path_match': 'temporalCoverage',
                                'mapping': {
                                    'dynamic': 'false',
                                    'format': 'yyyy-MM-dd',
                                    'type': 'date_range'
                                }
                            }
                        }
                    ]
                }
            }
        },
        "elasticsearch_public_index_body": {
            "settings": CVISB_DEFAULT_SETTINGS,
            "mappings": {
                'datacatalog': {
                    'dynamic': 'true',
                    'dynamic_date_formats': ['yyyy-MM-dd'],
                    'dynamic_templates': [
                        {
                            'temporalCoverageDateRange': {
                                'path_match': 'temporalCoverage',
                                'mapping': {
                                    'dynamic': 'false',
                                    'format': 'yyyy-MM-dd',
                                    'type': 'date_range'
                                }
                            }
                        }
                    ]
                }
            }
        }
    }
}
