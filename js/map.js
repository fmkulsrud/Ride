const mapbox_key = 'pk.eyJ1IjoibGFkeWZtayIsImEiOiJjbDFjNWMzeW0wNGVkM2pucmJ0eDd5NGc4In0.mPd0uMnmY4HbDl1hDLbsgg'

export async function getMap(){
    mapboxgl.accessToken = mapbox_key;
    
    const bikeStations = await getStations();

    const bikeStationsStatus = await getStatus();


    // Vi trenger en funksjon som henter ut status av hver eneste stasjon. 
    // Vi må retunere for å ta i bruk funksjon.
    const checkAvailabiliy = (id) => {
        const currentStation = bikeStationsStatus.filter(
            status => status.station_id === id
        );
        return currentStation[0].num_bikes_available;
    }

    const checkDocks = (id) => {
        const currentStation = bikeStationsStatus.filter(
            status => status.station_id === id
        );
        return currentStation[0].num_docks_available;
    }

  const featuresBikes = bikeStations.map(station =>{
            return {
                type: 'Feature',
                properties: {
                    station: station.name,
                    address: station.address,
                    availability: checkAvailabiliy(station.station_id),
                    docks: checkDocks(station.station_id)
                    },
                geometry: {
                    type: 'Point',
                    coordinates: [station.lon, station.lat ]
                    }
            }
        } );

    const geoStations = {
        type: 'FeatureCollection',
        features: featuresBikes   
    }
    
    const map = new mapboxgl.Map(
        {
            container: 'map', // container ID
            style: 'mapbox://styles/mapbox/streets-v11', // style URL
            center: [10.75, 59.91], // starting position [lng, lat]
            zoom: 15, // starting zoom, høyere tall betyr mer zoomet inn. Men man kan også zoome inn ut meg finger eller mus. 
            pitch: 60,
            bearing: 40,
            antialias: true
        }
    );
    
    geoStations.features.forEach(station => {
        const markerEl = document.createElement('div');
        let moveTop = false;
        markerEl.classList.add('marker');
        markerEl.addEventListener('click', (event) => {
            const allMarkers = document.querySelectorAll('.marker');
            allMarkers.forEach((item) => {
                item.classList.remove('marker-active');
            })
            console.log(event.y);
            if(event.y > 440) {
                moveTop = true;
            }
            popupMessage(
                station.properties.station, 
                station.properties.address,
                station.properties.availability,
                station.properties.docks,
                moveTop
                )
            markerEl.classList.add('marker-active');
        });

        new mapboxgl.Marker(markerEl)
        .setLngLat(station.geometry.coordinates)
        .addTo(map);
    });



   
}


async function getStations() {
    const corsUrl = `https://api.allorigins.win/get?url=${encodeURIComponent('https://gbfs.urbansharing.com/oslobysykkel.no/station_information.json')}`;
    const response = await fetch(corsUrl);
    const result = await response.json();
    const stations = JSON.parse(result.contents);
    return stations.data.stations;
}

async function getStatus() {
    const corsUrl = `https://api.allorigins.win/get?url=${encodeURIComponent('https://gbfs.urbansharing.com/oslobysykkel.no/station_status.json')}`;
    const response = await fetch(corsUrl);
    const result = await response.json();
    const stationStatus = JSON.parse(result.contents);
    return stationStatus.data.stations
}
getStatus();

function popupMessage(station, address, availability, docks, moveTop) {
    const allMarkers = document.querySelectorAll('.marker')
    const popUpBox = document.querySelector('.pop-up-box');
    popUpBox.style.bottom = '0';
    popUpBox.classList.remove('hidden');

    if(moveTop) {
        popUpBox.style.bottom = '240px';
    }

    const checkPEl = document.querySelectorAll('.pop-up-box p');
    if(checkPEl.length > 0){
        checkPEl.forEach(p => {
            p.remove();
        })
    const checkDivEl = document.querySelectorAll('.pop-up-box div');
    if(checkDivEl.length > 0){
        checkDivEl.forEach( div =>{
           div.remove();
        })
    }
    }

    const stationBox = document.createElement('p');
    stationBox.classList.add('h3-700-20px');
    stationBox.classList.add('station-header');
    stationBox.classList.add('popupMenu');
    stationBox.textContent = `${station}`;
    popUpBox.append(stationBox);

    const addressBox = document.createElement('p');
    addressBox.classList.add('p');
    addressBox.classList.add('popupMenu');
    addressBox.classList.add('address-box');
    addressBox.textContent = `Ved ${address}`;
    popUpBox.append(addressBox);


    // Vi må lage en flex box for å ha både icon og tekst ved siden av hverandre. 
    //Dette må vi lage når vi skal lage boks som innkluderer tilgjengelighet. 
    const availabilityContainer = document.createElement('div');
    availabilityContainer.classList.add('availability-container');
    const bikeIcon = document.createElement('img');
    bikeIcon.classList.add('bike-station-icon');
    bikeIcon.setAttribute('src', '../assets/Icons/bikeStation.svg');
    availabilityContainer.append(bikeIcon);
    const availabilityP =document.createElement('p');
    availabilityP.classList.add('popupMenu');
    availabilityP.classList.add('content-stations');
    availabilityP.textContent = `${availability} Tilgjengelig`;
    availabilityContainer.append(availabilityP);
    popUpBox.append(availabilityContainer);


    //Bruker denne koden får å vise antall docks ledige sammen med sitt ikon. 
    //Dette blir laget inne i en flex box. 
    //Når vi bruker SetAttribute så forventer kode at vi skriver inn to ting.
    const docksContainer = document.createElement('div');
    docksContainer.classList.add('docks-container');
    const docksIcon = document.createElement('img');
    docksIcon.classList.add('docks-station-icon');
    docksIcon.setAttribute('src', '../assets/Icons/stations.svg');
    docksContainer.append(docksIcon);
    const availabilityP2 = document.createElement('p');
    availabilityP2.classList.add('popupMenu');
    availabilityP2.classList.add('content-stations');
    availabilityP2.textContent = `${docks} Ledige stasjoner`;
    docksContainer.append(availabilityP2);
    popUpBox.append(docksContainer);


/*     const reserveBikeBtn = document.createElement('p');
    reserveBikeBtn.classList.add('p');
    reserveBikeBtn.classList.add('popupMenu');
    reserveBikeBtn.classList.add('book-bike-btn');
    reserveBikeBtn.textContent = `Reserver sykkel`;
    popUpBox.append(reserveBikeBtn); */


    const closePopUp = document.querySelector('#close-pop');
    closePopUp.addEventListener('click', () => {
        stationBox.remove();
        addressBox.remove();
        availabilityP.remove();
        availabilityP2.remove();
        bikeIcon.remove();
        docksIcon.remove();
        /* reserveBikeBtn.remove(); */
        popUpBox.classList.add('hidden');
        allMarkers.forEach((item) => {
            item.classList.remove('marker-active')
        })
    })
}
