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
    
    outputHTMLSuggestions(matches)
  }

  const outputHTMLSuggestions = matches => {
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
    let filter = `${match.keyword}'s`;
    let queryString = `?${match.filter}=${match.keyword}`;
    if (model) {
      filter = `${match.keyword} ${model.displayName}'s`
      queryString = `?${match.filter}=${match.keyword}&model=${model.displayName}`
    }
    return (`
      <div className="card card-body mb-1">
          <a href="https://www.donedeal.ie/${section.name}${queryString}">
            <h4>Filter all ${filter} in ${section.displayName} <span classname="text-primary"></span></h4>
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
            <li>Suggest filtered search in section. Tip! try typing Ford, BMW or Audi</li>
            <li>Suggest filtered search in Dealer Directory</li>
            <li>Suggest top level sections. Tip! try typing Cars, Campers or Tractors</li>
            <li>Suggest New Car ad details. Tip! try typing Mercedez-Benz</li>
            <li>Suggest popular searches</li>
          </ul>
        </div>
      </div>
  );
}




export default App;

