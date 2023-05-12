window.onload = init;

function init(){
    // HTML element
    const mapElement = document.getElementById('mapid')

    // Basemaps
    const openStreetMapStandard = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

    const stadiaMaps = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    })

    // Leaflet Map Object
    const mymap = L.map(mapElement, {
        center: [-8.455748978281614, 104.065442496],
        zoom: 5,
        minZoom: 4,
        zoomSnap: 0.25,
        zoomDelta: 0.25,
        layers: [stadiaMaps]
    })

    mymap.on('zoom', function(e){
        console.log(e.target._zoom)
    })

    // Basemap Object
    const baseLayers = {
        '<b>stadiaMaps</b>' : stadiaMaps,
        'openStreetMapStandard' : openStreetMapStandard
    }

    // Overlays
    const javaBaseMapImage = './Data/Java.png';
    const javaBaseMapBounds = [[-8.455748978281614, 104.065442496],[-5.674229705192159, 106.901065401]]
    const imageJavaOverlay = L.imageOverlay(javaBaseMapImage, javaBaseMapBounds).addTo(mymap)

    // Overlay Object
    const overlayerLayers = {
        'Java image': imageJavaOverlay
    }

    // Layer control
    const layerControls = L.control.layers(baseLayers, overlayerLayers, {
        collapsed: false,
        position: 'topright'
    }).addTo(mymap)

    mymap.on('click', function(e){
        console.log(e.latlng)
    })

    // Java marker
    const javaMarker = L.marker([-6.181483033062791, 106.82447481285564], {
        opacity: 1
    }).addTo(mymap)

    const javaMarkerPoppup = javaMarker.bindPopup('Jakarta city from popup')
    const javaMarkerTooltip = javaMarker.bindTooltip('Jakarta city from tooltip').openTooltip()
}