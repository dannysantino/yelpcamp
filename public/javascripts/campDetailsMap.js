mapboxgl.accessToken = mapBoxToken;
const map = new mapboxgl.Map({
    container: 'detail-map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: foundCamp.geometry.coordinates, // starting position [lng, lat]
    zoom: 11 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
    .setLngLat(foundCamp.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h5>${foundCamp.title}</h5><p>${foundCamp.location}`
            )
    )
    .addTo(map);