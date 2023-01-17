
import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import fetchCountries from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const refs = {
    searchInput: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
};

refs.searchInput.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
    const inputValue = e.target.value;
    const countryName = inputValue.trim();
    
    refs.countryInfo.hidden = true;
    clear();

        if (countryName) {   
            fetchCountries(countryName).then(data => {
                if (data.length > 10) {
                    Notify.info("Too many matches found. Please enter a more specific name.");
                    return;
                }

                createCountryList(data);

                if (data.length === 1) {
                    refs.countryList.innerHTML = '';
                    createCountryCard(data);
                    refs.countryInfo.hidden = false;
                }
            }).catch(error => Notify.failure(`${error}`));
    };
};

function createCountryList(data) {
    const markup = data.map(({ name: { official }, flags: { svg } }) =>
    `<li class="country-list__item"><img src="${svg}" class="country-list__flag" alt="${official} flag">${official}</li>`).join('');

    refs.countryList.insertAdjacentHTML('beforeend', markup)
};

function createCountryCard(data) {
    const markup = data.map(({ name: { official }, population, capital, languages, flags: { svg } }) => {
        const countryLanguages = Object.values(languages);
        return `<h1 class="country-info__name">
     <img src="${svg}" class="country-info__flag" alt="${official} flag"> ${official}</h1>
      <h2 class="country-info__capital">Capital: ${capital}</h2>
      <h3 class="country-info__population">Population: ${population}</h3>
      <h4 class="country-info__languages">Languages: ${countryLanguages}</h4>`
    }).join('');
    
    refs.countryInfo.insertAdjacentHTML('beforeend', markup);
};

function clear() {
    refs.countryInfo.innerHTML = '';
    refs.countryList.innerHTML = '';
};

