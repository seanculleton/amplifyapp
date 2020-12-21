import React, { useState } from 'react';
import './App.css';
import './css/bootstrap.min.css';
import states from './data/states.json'
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
    
    outputHTMLSuggestions(matches)
  }

  const outputHTMLSuggestions = matches => {
    if (matches.length > 0) {
      let html = '';
      matches.forEach(match => {
        match.sections.forEach(section => {
          html += suggestionCompontent(match, section)
        })
      });

      console.log(html);

      setMatchList(html);
    }
  }

  const suggestionCompontent = (match, section) => {
    return (`
      <div className="card card-body mb-1">
          <a href="https://www.donedeal.ie/${section.name}?${match.filter}=${match.keyword}">
            <h4>Filter ${match.filter}: ${match.keyword} in ${section.displayName} <span classname="text-primary"></span></h4>
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
            <li>Suggest filtered search in section</li>
            <li>Suggest New Car ad details</li>
            <li>Suggest filtered search in Dealer Directory</li>
            <li>Suggest popular searches</li>
            <li>Suggest top level sections</li>
          </ul>
        </div>
      </div>
  );



  const searchStates = async (event)=>{
    const searchText = event.target.value;
    //get matches
    let matches = states.filter(state => {
      const regex = new RegExp(`^${searchText}`, 'gi');
      return state.name.match(regex) || state.abbr.match(regex)
    })

    if (searchText.length === 0) {
      matches = []
      setMatchList('')
    }

    outputHTML(matches)
  }

  const outputHTML = matches => {
    if (matches.length > 0) {
      const html = matches.map(match => `<div className="card card-body mb-1">
          <h4>${match.name} (${match.abbr}) <span classname="text-primary">${match.capital}</span></h4>
        </div>`).join();
      console.log(html);

      setMatchList(html);
    }
  }
}




export default App;

