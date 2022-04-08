const url = 'https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=59.91389&lon=10.75449&altitude=11';
// const url = 'https://goweather.herokuapp.com/weather/oslo';

export async function getWeather() {
    // hämtar data från extern källa
    const response = await fetch(url);
    // konverter response til json med funksjonen json()
    const result = await response.json(); 
    const mainEl = document.getElementById('app');

    //Hente ut nåvärende time fra to karakterer og kombinerer dem
    const currentDate = new Date();
    const hoursNow = `${currentDate.getHours()}:00`;
    const currentIndex = result.properties.timeseries.filter(serie => {
        return serie.time.includes(hoursNow);
    });

    const currentTemperature = currentIndex[0].data.instant.details.air_temperature;
    //logger resultatet av all koden
    console.log(currentTemperature);

    const temperaturElement = document.createElement('p');
    temperaturElement.textContent = `${currentTemperature} Temperatur i dag`;
    // temperaturElement.textContent = currentTemperature 'Været i dag';
    mainEl.append(temperaturElement);



};
