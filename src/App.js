import React, { useState } from 'react';
import './App.css';
import './css/bootstrap.min.css';
import sectionFilters from './data/sectionFilters.json'

function App() {

  const [matchList, setMatchList] = useState('');
  
  const searchFilters = event => {
    const searchText = event.target.value;
    let matches = sectionFilters.filter(searchFilter => {
      const regex = new RegExp(`^${searchText}`, 'gi');
      return searchFilter.keyword.match(regex);
    })

    if (searchText.length === 0 || matches.length === 0) {
      matches = []
      setMatchList('')
    }
    
    outputHTMLSuggestions(matches, searchText)
  }

  const outputHTMLSuggestions = (matches, searchText) => {
    if (searchText.length > 2) {
      lookupDealerDirectory(searchText)
    }

    if (matches.length > 0) {
      let html = '';
      
      matches.forEach(match => {
        // suggest section
        if (match.type === 'section') {
          html += suggestedSectionComponent(match)
        }

        // suggest list of filtered searches
        if (match.type === 'filter') {
          match.sections.forEach(section => {
            if (section.models) {
              section.models.forEach(model => {
                html += filteredSearchComponent(match, section, model)    
              })
            }
            html += filteredSearchComponent(match, section)
          })  
        }

        //suggest franchise search
        if (match.franchise) {
          html += franchiseComponent(match)
        }

        //suggest New Car ad
        if (match.newCars) {
          match.newCars.forEach(newCar => {
            html += newCarAdComponent(match, newCar)
          })
          
        }
      });

      console.log(html);

      setMatchList(html);
    }
  }

  const lookupDealerDirectory = async searchText => {
    let response = await fetch("https://www.donedeal.ie/search/api/v4/dealers/", {
      "headers": {
        "accept": "application/json, text/plain, */*",
        "Access-Control-Allow-Origin": "https://master.d2iifvfickjnso.amplifyapp.com/",
        "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
        "content-type": "application/json;charset=UTF-8",
        "platform": "web",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "cookie": "JSESSIONID=4E790F8D6E4D3ADCAF4B5D0716F57366; xtidc=191119104539573729; ddSearchViewPreferenceV2=list; _hjDonePolls=478269%2C483332; NPS_4fb20f86_surveyed=true; __stripe_mid=ee7ddfdf-8546-4dd6-b31d-3004f86e33fb377a12; ab.storage.deviceId.dde8ab7a-7fcb-4fdd-b013-6854facbea7e=%7B%22g%22%3A%22198f3013-9c88-4a3e-8b18-d01c8b978f38%22%2C%22c%22%3A1602164969547%2C%22l%22%3A1602164969547%7D; _ga=GA1.2.1176357775.1602164974; donedealCC=\"{\\\"version\\\":1,\\\"createDate\\\":1602164976909,\\\"lastUpdated\\\":1602164976909,\\\"expires\\\":1617889776909,\\\"strictlyNecessary\\\":true,\\\"analytics\\\":true,\\\"functional\\\":true,\\\"advertising\\\":true}\"; _hjid=9272aab2-7767-4967-82ef-9e5651947edf; __zlcmid=10djVIPngF7oxSy; __utma=220414087.1176357775.1602164974.1602782682.1602782682.1; __utmz=220414087.1602782682.1.1.utmcsr=braze-quality-test.donedeal.ninja|utmccn=(referral)|utmcmd=referral|utmcct=/; _hjMinimizedPolls=619145; _fbp=fb.1.1605696196929.1079815824; _gcl_au=1.1.1738394294.1605988494; _gaexp=GAX1.2.qP8WMzxCQSiTgXHtlCD4vA.18690.1; cto_bundle=RseYYF9SQzRBZ25sVG1UR29La0l1JTJCdk5YMU54S2RielNiTSUyRnprZ1gwSk9kaHlzJTJGTldBQkRoZSUyRkQ3bTNDJTJGSmV4NHN1ZGp3R3M1N29IN2kwVklBOXoxTXRaanQlMkZmNVR0VUJTZXRTTDBOTEdmYlltRjNaMWQ1TzNTOEs2U0tJMktFazc3c1E1QlliQlhpcXNmaDZvVlcxSW1YWlElM0QlM0Q; _hjTLDTest=1; ddSiteFocus=motor; uuid=A06C5471-5057-4E0E-8A76-D0A5678AC336; xtvrn=$557889$501695$; xtan=1-1015816; xtant=1; ab.storage.userId.dde8ab7a-7fcb-4fdd-b013-6854facbea7e=%7B%22g%22%3A%222099809%22%2C%22c%22%3A1608198610027%2C%22l%22%3A1608198610027%7D; NPS_4fb20f86_last_seen=1608551797227; _gid=GA1.2.1972965063.1608551799; _hjIncludedInSessionSample=1; _hjAbsoluteSessionInProgress=0; ab.storage.sessionId.dde8ab7a-7fcb-4fdd-b013-6854facbea7e=%7B%22g%22%3A%22056f71c1-2579-62ec-54af-ece9ef1f173d%22%2C%22e%22%3A1608561664406%2C%22c%22%3A1608559858401%2C%22l%22%3A1608559864406%7D; DDSEISIUN=A78FEBEE11FCA204500B6C3B823BDF3A; DDSearchStartTime=1608566733577; DDLastViewedAd=26825831; __gads=ID=d5d79ae3444309d6-22b518fa8fa6003c:T=1608566778:RT=1608566778:S=ALNI_MZSh_PcTMmVxE49_bXl5S78NSt1jg; utag_main=v_id:01750879706c0017a1ff6c934eeb03078005807000ac2$_sn:95$_ss:0$_st:1608568621395$_pn:52%3Bexp-session$ses_id:1608559858580%3Bexp-session"
      },
      "referrer": "https://www.donedeal.ie/find-a-dealer?terms=bolands",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": "{\"terms\":\"boland\"}",
      "method": "POST",
      "mode": "cors"
    });
    console.log(response);
  }
  const newCarAdComponent = (match, newCar) => {
    return (`
      <div className="card card-body mb-1">
          <a href="https://www.donedeal.ie/new-car-for-sale/${match.keyword}/${newCar.displayName}">
            <h4>View a brand new ${match.keyword} ${newCar.displayName}</h4>
          </a>
        </div>
      `
    );
  }

  const franchiseComponent = (match) => {
    return (`
      <div className="card card-body mb-1">
          <a href="https://www.donedeal.ie/find-a-dealer?franchises=${match.keyword}">
            <h4>View all ${match.keyword} dealer franchises</h4>
          </a>
        </div>
      `
    );
  }

  const suggestedSectionComponent = (match) => {
    return (`
    <div className="card card-body mb-1">
        <a href="https://www.donedeal.ie/${match.sections[0].name}">
          <h4>View all ${match.keyword}</h4>
        </a>
      </div>
    `
  );
  }

  const filteredSearchComponent = (match, section, model) => {
    let filter = `${match.keyword}`;
    let queryString = `?${match.filter}=${match.keyword}`;
    if (model) {
      filter = `${match.keyword} ${model.displayName}'s`
      queryString = `?${match.filter}=${match.keyword}&model=${model.displayName}`
    }
    return (`
      <div className="card card-body mb-1">
          <a href="https://www.donedeal.ie/${section.name}${queryString}">
            <h4>Filter all ${filter} ${section.displayName} <span classname="text-primary"></span></h4>
          </a>
        </div>
      `
    );
  }

  return (
    <div className="container mt-5">
        <div className="row">
          <div className="col-md-6 m-auto">
            <h3 className="text-center mb-3">
              DoneDeal Autocomplete Search
            </h3>
            <div className="form-group">
              <input type="text" 
                className="form-control form-control-lg" 
                placeholder="Enter text..." 
                onChange={searchFilters}/>
            </div>
          </div>
        </div>
        <div dangerouslySetInnerHTML={{__html: matchList}} />
        
        <div>
          <ul>
            <li>Suggest filtered search in section. Tip! try typing Electric or Hybrid</li>
            <li>Suggest filtered make/model search in a section. Tip! try typing Ford, BMW or Audi</li>
            <li>Suggest filtered search in Dealer Directory</li>
            <li>Suggest top level sections. Tip! try typing Cars, Campers or Tractors</li>
            <li>Suggest New Car ad details. Tip! try typing Mercedez-Benz</li>
          </ul>
        </div>
      </div>
  );
}




export default App;

