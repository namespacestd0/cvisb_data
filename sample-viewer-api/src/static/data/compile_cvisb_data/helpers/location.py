import pandas as pd
# df = pd.read_csv("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/patient_rosters/acuteLassa_metadata_v2_2019-06-12.csv")
# sl = pd.read_csv("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/geo/SLE/sle_adm4_UNOCHA.csv")
# df.Chiefdom.apply(lambda x: str(x).title()).value_counts()
#
# df['admin4Name'] = df.Village.apply(lambda x: str(x).title)
# sl.head()
#
# merged = pd.merge(df, sl, on="admin4Name", how="left", )



# --- district/village --> geo objects, check that they're appropriate ---
def cleanDistrict(district):
# SLE Adm 2 districts from https://data.humdata.org/dataset/sierra-leone-all-ad-min-level-boundaries
    adm2 = ['Bo',
     'Bombali',
     'Bonthe',
     'Kailahun',
     'Kambia',
     'Kenema',
     'Koinadugu',
     'Kono',
     'Moyamba',
     'Port Loko',
     'Pujehun',
     'Tonkolili',
     'Western Area Rural',
     'Western Area Urban']

    if (district == district):
        # standardize case
        district = district.title().strip()
        if district in adm2:
            district_clean = district

        if district in ["Bombabi"]:
            district_clean = 'Bombali'
        if district in ["Bonth", "Bouthe"]:
            district_clean = 'Bonthe'

        if district in ["Kailahum", "Kailahunb", "Kailahim", "Kailuahun"]:
            district_clean = 'Kailahun'

        if district in ["Kernema", "Ken", "Kenem", "Kenenma"]:
            district_clean = 'Kenema'
        if district in ["Koinadu"]:
            district_clean = 'Koinadugu'
        #     return("Bo")
        #     # return('Kambia')
        #  return('Kono')
         # return('Moyamba')
         # return('Port Loko')
         # return('Pujehun')
        if district in ["Tokolili", "Tonkilili"]:
             district_clean = 'Tonkolili'
        # if district in ["Western Rural"]:
        #     return('Western Area Rural')
        # if district in ["Western", "Western Area", "Westen Area"]:
        #     return('Western Area Urban')
        else:
            district_clean = district
        if district_clean in adm2:
            return( {'administrativeType': 'district', 'administrativeUnit': 2,'name': district_clean})
    else:
        return(pd.np.nan)

        # Clean up Western Area; assuming the Urban part of the district, since everyone is within Freetown.
        # if (district.lower() == "western area"):
        #     return([{
        #     'administrativeType': 'district',
        #     'administrativeUnit': 2,
        #     'name': "Western Area Urban"
        #     }]
        #     )
        # return([{

# df['district'] = df.District.apply(cleanDistrict)
#
# df.groupby("district").Chiefdom.value_counts()
# df.groupby("district").Village.value_counts()
# df.groupby("Chiefdom").district.value_counts()
#
#
# df.Village.value_counts(dropna=False)
#
# df.Chiefdom.value_counts()
#
# df.loc[df.district=="Kenema", ["District", "Chiefdom", "Village", "district"]]
#
# df.district.value_counts()
#
# df[df.District == "Grand Bassa"]

def getCountry(countryID):
    if((countryID == "SL") | (countryID == "SLE") | (countryID == "Sierra Leone")):
        return({
        "@type": "Country",
        "name": "Sierra Leone",
        "identifier": "SL",
        "url": "https://www.iso.org/obp/ui/#iso:code:3166:SL"
        })
    elif((countryID == "NG") | (countryID == "NGA") | (countryID == "Nigeria")):
        return({
        "@type": "Country",
        "name": "Nigeria",
        "identifier": "NG",
        "url": "https://www.iso.org/obp/ui/#iso:code:3166:NG"
        })
    elif((countryID == "GN") | (countryID == "GIN") | (countryID == "Guinea")):
        return({
        "@type": "Country",
        "name": "Guinea",
        "identifier": "GN",
        "url": "https://www.iso.org/obp/ui/#iso:code:3166:GN"
        })
    elif((countryID == "CI") | (countryID == "CIV") | (countryID == "Cote d'Ivoire") | (countryID == "Ivory Coast")):
        return({
        "@type": "Country",
        "name": "Cote d'Ivoire",
        "identifier": "CI",
        "url": "https://www.iso.org/obp/ui/#iso:code:3166:CI"
        })
    elif((countryID == "ML") | (countryID == "MLI") | (countryID == "Mali")):
        return({
        "@type": "Country",
        "name": "Mali",
        "identifier": "ML",
        "url": "https://www.iso.org/obp/ui/#iso:code:3166:ML"
        })
    elif((countryID == "TG") | (countryID == "TGO") | (countryID == "Togo")):
        return({
        "@type": "Country",
        "name": "Togo",
        "identifier": "TG",
        "url": "https://www.iso.org/obp/ui/#iso:code:3166:TG"
        })
    elif((countryID == "LR") | (countryID == "LBR") | (countryID == "Liberia")):
        return({
        "@type": "Country",
        "name": "Liberia",
        "identifier": "LR",
        "url": "https://www.iso.org/obp/ui/#iso:code:3166:LR"
        })
    else:
        return(pd.np.nan)

def getCountryName(countryID):
    """
    Pull out the country name from a country id.
    If there's no "name" property in the object, returns null
    """
    try:
        countryObj = getCountry(countryID)
        return(countryObj['name'])
    except:
        pass

def pullCountryName(countryObj):
    """
    Pull out the country name from a country id.
    If there's no "name" property in the object, returns null
    """
    try:
        return(countryObj['name'])
    except:
        pass