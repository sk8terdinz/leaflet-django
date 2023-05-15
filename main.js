window.onload = init;

function init(){
    // HTML element
    const mapElement = document.getElementById('mapid')

    // Basemaps
    const openStreetMapStandard = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        //noWrap: true,
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
        easeLinearity: 0.5,
        worldCopyJump: true,
        layers: [stadiaMaps]
    })


    // Basemap Object
    const baseLayers = {
        '<b>stadiaMaps</b>' : stadiaMaps,
        'openStreetMapStandard' : openStreetMapStandard
    }

    // Overlays
    const javaBaseMapImage = './Data/Java.png';
    const javaBaseMapBounds = [[-8.455748978281614, 104.065442496],[-5.674229705192159, 106.901065401]]
    const imageJavaOverlay = L.imageOverlay(javaBaseMapImage, javaBaseMapBounds)

    // Overlay Object
    const overlayerLayers = {
        'Java image': imageJavaOverlay
    }

    // Layer control
    const layerControls = L.control.layers(baseLayers, overlayerLayers, {
        collapsed: false,
        position: 'topright'
    }).addTo(mymap)

    // Java marker
    const javaMarker = L.marker([-6.181483033062791, 106.82447481285564], {
        opacity: 1
    }).addTo(mymap)

    const javaMarkerPoppup = javaMarker.bindPopup('Jakarta city from popup')
    const javaMarkerTooltip = javaMarker.bindTooltip('Jakarta city from tooltip').openTooltip()

    // Geolocation API
    /*mymap.locate({setView:true, maxZoom: 18})


    function onLocationFound(e){
        var radius = e.accuracy.toFixed(2)

        var locationMarker = L.marker(e.latlng).addTo(mymap).bindPopup('You are within ' + radius + ' metres from this point').openPopup()

        var locationCircle = L.circle(e.latlng, radius).addTo(mymap)
    }

    mymap.on('locationfound', onLocationFound)


    function onLocationError(e){
        window.alert(e.message)
    }

    mymap.on('locationerror', onLocationError)
    */

    // Distane calculation demo
    /*const myCustomIcon = L.icon({
        iconUrl: './Data/icon_point.png',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -20]
    })*/
    /*
    const myDivIcon = L.divIcon({
        className: 'my-div-icon',
        iconSize: 30
    })

    var counter = 0
    var coordinates = []

    mymap.on('click', function(e){
        counter += 1
        let latlng = e.latlng
        coordinates.push(latlng)

        let popup = L.popup({
            autoClose: false,
            closeOnClick: false
        }).setContent(String(counter))
    // Marker plotting
        L.marker(latlng, {icon: myDivIcon}).addTo(mymap).bindPopup(popup).openPopup()

        if (counter >= 2){
            let distance = mymap.distance(coordinates[0], coordinates[1])
            console.log(distance)
            coordinates.shift()
        }
    })*/


    // Draw Polyline
    /* var drawPolyline = L.polyline([], {
        color: 'red',
        smoothFactor: 0.1
    }).addTo(mymap)

    mymap.on('click', function(e){
        let latlng = e.latlng;
        drawPolyline.addLatLng(latlng)
    })

    var masterPolyline = L.polyline([], {color: 'blue'}).addTo(mymap)
    var masterLineCoordinates = []
    mymap.on('dblclick', function(e){
        let clickedAllCoordinates = drawPolyline.getLatLngs()
        let clickedAllCoordinatesExceptTheLastOne = clickedAllCoordinates.slice(0, clickedAllCoordinates.length - 1)

        masterLineCoordinates.push(clickedAllCoordinatesExceptTheLastOne)
        masterPolyline.setLatLngs(masterLineCoordinates)

        drawPolyline.setLatLngs([])

        console.log(masterPolyline.toGeoJSON())
    }) */

    // Initialize dynamic polyline to the map
    var drawPolyline = L.polyline([], {
        color: 'red',
        smoothFactor: 0.1
    }).addTo(mymap)

    var polygon = L.polygon([], {color: 'red'}).addTo(mymap);

    // Draw Polygon function
    function drawPolygon(){
        mymap.on('click', function(e){
            let latlng = e.latlng;
            polygon.addLatLng(latlng)
        })
    }

    var masterPolygon = L.polygon([], {color: 'blue'}).addTo(mymap)
    var masterPolygonCoordinates = []
    mymap.on('dblclick', function(e){
        let clickedAllCoordinates = polygon.getLatLngs()
        let clickedAllCoordinatesExceptTheLastOne = clickedAllCoordinates[0].slice(0, clickedAllCoordinates[0].length - 1)

        masterPolygonCoordinates.push(clickedAllCoordinatesExceptTheLastOne)
        masterPolygon.setLatLngs(masterPolygonCoordinates)
        // Remove all lat and lng values in the polygon object

        polygon.setLatLngs([])

        // console.log(masterPolygon.toGeoJSON())
        // event to off the click action after double click to stop drawing
        mymap.off('click')

        // Change the plugin color back to original
        let drawPolygonButtonElement = document.querySelector('.draw-polygon')
        if (drawPolygonButtonElement){
            L.DomUtil.removeClass(drawPolygonButtonElement, 'draw-active')
        }
    })

    // Custom Control Draw Geometry Plugin
    L.Control.CustomDrawGeometryTools = L.Control.extend({
        onAdd: function(mymap){
            var div = L.DomUtil.create('button', 'draw-polygon')
            div.innerHTML = 'Draw a polygon'

            L.DomEvent.on(div, 'click', function(e){
                // Ignore the first click on plugin
                L.DomEvent.stopPropagation(e)

                let toggleDrawPolygonButton = div.classList.toggle('draw-active')
                if (toggleDrawPolygonButton){
                    drawPolygon()
                }
            })

            return div
        }
    })

    // Factory function

    L.control.customdrawgeometrytools = function(opts){
        return new L.Control.CustomDrawGeometryTools(opts)
    }

    L.control.customdrawgeometrytools({position: 'topleft'}).addTo(mymap)

    /* var myCustomTool = new L.Control.CustomDrawGeometryTools({
        position: 'topleft'
    }).addTo(mymap) */


    // Draw Rectangle
    // define rectangle geographical bounds
    /* var corner1 = L.latLng(40.712, -74.227),
    corner2 = L.latLng(40.774, -74.125),
    bounds = L.latLngBounds(corner1, corner2);

    // create an orange rectangle
    L.rectangle(bounds, {color: "#ff7800", weight: 1}).addTo(mymap);

    // zoom the map to the rectangle bounds
    mymap.fitBounds(bounds); */

    //Circle examples

    /* L.circle([50.5, 30.5], {radius: 200000, color: 'red'}).addTo(mymap);
    mymap.panTo([50.5, 30.5])

    L.circleMarker([40, 42], {radius: 10}).addTo(mymap) */

    // SVG examples

    /* var svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgElement.setAttribute('xmlns', "http://www.w3.org/2000/svg");
    svgElement.setAttribute('viewBox', "0 0 200 200");
    svgElement.innerHTML = '<rect width="200" height="200"/><rect x="75" y="23" width="50" height="50" style="fill:red"/><rect x="75" y="123" width="50" height="50" style="fill:#0013ff"/>';
    var svgElementBounds = [ [-8.455748978281614, 104.065442496],[-5.674229705192159, 106.901065401] ];
    L.svgOverlay(svgElement, svgElementBounds).addTo(mymap); */


    var svgURL = './Data/map-marker-23x31-active.svg';
    var svgBounds = [ [-8.455748978281614, 104.065442496],[-5.674229705192159, 106.901065401] ];
    L.imageOverlay(svgURL, svgBounds).addTo(mymap)
}