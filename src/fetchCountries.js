const BASE_URL = 'https://restcountries.com/v3.1/name';
const params = '?fields=name,capital,population,flags,languages';

export default function fetchCountries(name) {
    return fetch(`${BASE_URL}/${name}${params}`).then(response => {
        if (!response.ok) {
            throw new Error("Oops, there is no country with that name");
        }
        return response.json();
    });
};