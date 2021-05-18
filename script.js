//Basemaps
  var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Data Source: <a href="https://geodatenonline.bayern.de/geodatenonline/seiten/bestellen">Bayerische Vermessungsverwaltung</a> , Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  });

  var BasemapAT_terrain = L.tileLayer('https://maps{s}.wien.gv.at/basemap/bmapgelaende/{type}/google3857/{z}/{y}/{x}.{format}', {
	maxZoom: 19,
	attribution: 'Data Source: <a href="https://geodatenonline.bayern.de/geodatenonline/seiten/bestellen">Bayerische Vermessungsverwaltung</a> , Datenquelle: <a href="https://www.basemap.at">basemap.at</a>',
	subdomains: ["", "1", "2", "3", "4"],
	type: 'grau',
	format: 'jpeg',
	bounds: [[46.35877, 8.782379], [49.037872, 17.189532]],
  opacity: 0.8,
});
var Stamen_TerrainBackground = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain-background/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Data Source: <a href="https://geodatenonline.bayern.de/geodatenonline/seiten/bestellen">Bayerische Vermessungsverwaltung</a> ,  Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 19,
	ext: 'png'
});
var Stamen_TonerLabels = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Data Source: <a href="https://geodatenonline.bayern.de/geodatenonline/seiten/bestellen">Bayerische Vermessungsverwaltung</a> ,Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 20,
	ext: 'png'
});
var WaymarkedTrails_cycling = L.tileLayer('https://tile.waymarkedtrails.org/cycling/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: 'Data Source: <a href="https://geodatenonline.bayern.de/geodatenonline/seiten/bestellen">Bayerische Vermessungsverwaltung</a> , Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Map style: &copy; <a href="https://waymarkedtrails.org">waymarkedtrails.org</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

//create array for all paths
var routesarray = [];
//add geojson data to map
  var border = L.geoJson(border,{color: "#11004d", weight: 3, fill: true, fillpacity:0.5});
  var border2 = L.geoJson(Germany_border,{color: "#e3e3e3", weight: 3, fill: true, fillpacity:0.5});





  var paths = L.geoJson(paths,{
    color: "#17081a",
    weight: 20,
    fill: false,
    opacity:0,

    onEachFeature: function onEachFeature(feature, layer) {
      //create popup
        layer.bindPopup("<span class='elevationtext'>Hiking trial: <br></span>" + feature.properties.Name);
      //assign name
        layer.name = feature.properties.Name;
      //add to array
        routesarray.push(layer);
    },
  });

  
//group baselayers
var baseLayers = {
  "Esri World Imagery": Esri_WorldImagery,
  "AT Terrain": BasemapAT_terrain,
  "Terrain":Stamen_TerrainBackground,
};



//define map boundaries
  var corner1 = L.latLng(47.216402,9.316407),
  corner2 = L.latLng(49.645820,11.381837),
  bounds = L.latLngBounds(corner1, corner2);

//create map
  var map = L.map('map', {
    zoom: 10,
    maxBounds: bounds,
    maxBoundsViscosity: 1.0,
    center: [47.576079,10.378510],
    minZoom: 8,
    zoomControl: false,
    //layers that will be active at first load
    layers: [Stamen_TerrainBackground,paths,border,]
  });
  new L.Control.Zoom({ position: 'topright' }).addTo(map);

//maptitle in map as control-box
  var maptitle = L.control({position: 'topleft'});

  maptitle.onAdd = function (map) {
      this._div = L.DomUtil.create('div', 'maptitle');
      this.update();
      return this._div;
  };

  maptitle.update = function () {
      this._div.innerHTML = '<h1>Long-distance Hiking Trails<br> Swabonia (Germany)</h1>';
  };
  maptitle.addTo(map);


  //adds decription-box to the map
  var info = L.control({position: 'topleft'});

  info.onAdd = function (map) {
      this._div = L.DomUtil.create('div', 'info');
      this.update();
      return this._div;
  };

  // method to update the control based on feature properties passed
  info.update = function (props) {
      this._div.innerHTML =   (props ? '<b>' + props.name + '</b></br>'  + props.description
          : 'This map represents the hiking trails in Swabonia region of Germany.</br> Click on an elevation point to display a hiking trail');
  };
  info.addTo(map);



//create pane above other layers
map.createPane("pane700").style.zIndex = 650;

var castles2 = L.geoJson(Castles, {
    pointToLayer: function(feature, latlng) {
      return L.marker(latlng, {
        pane: 'pane700', // pane option is for individual layers.
        icon: L.icon({
          iconUrl: "./DATA/icons/castle.png",
          iconSize: [40, 40]
        }),
      });
    },
    onEachFeature: function(feature, marker) {
      marker.bindPopup(feature.properties.PopupInfo);
    }    
}).addTo(map);

var huts = L.geoJson(Huts, {
  pointToLayer: function(feature, latlng) {
    return L.marker(latlng, {
      pane: 'pane700', // pane option is for individual layers.
      icon: L.icon({
        iconUrl: "./DATA/icons/cabin.png",
        iconSize: [15, 15]
      }),
    });
  },
    
})



  var dataLayers = {
    "Labels": Stamen_TonerLabels,
    "Cycling Trails": WaymarkedTrails_cycling,
    "Swabonia Border":border,
    "Germany Border":border2,
    "Castles": castles2,
    "Huts":huts,
  };


//add layer group to layer controls
  L.control.layers(baseLayers,dataLayers).addTo(map);

//create pane above other layers
map.createPane("pane600").style.zIndex = 600;

//create points from geojson file
  var myRenderer = L.canvas({ padding: 0.5, pane: "pane600" });

var hikingpoints = L.geoJson(hikepoints, {
    pointToLayer: function (feature, latlng) {
      var x = L.circleMarker(latlng, {
    	   renderer: myRenderer,
         radius: 1,
       });

    //read name and elevation value
    x.name = feature.properties.Name;
    x.elevation = Math.round(feature.properties.Elevation).toString();

//set color by elevation value
var y = x.elevation;
  switch (true) {
      case (y < 300):
      x.setStyle({color: "#ffffcc"});
         break;
      case (y < 500):
      x.setStyle({color: "#ffeda0"});
          break;
      case (y < 750):
      x.setStyle({color: "#fed976"});
          break;
      case (y < 1000):
      x.setStyle({color: "#feb24c"});
          break;
          case (y < 1250):
      x.setStyle({color: "#fd8d3c"});
          break;
          case (y < 1500):
      x.setStyle({color: "#fc4e2a"});
          break;
          case (y < 1750):
      x.setStyle({color: "#e31a1c"});
          break;
          case (y < 2000):
      x.setStyle({color: "#bd0026"});
          break;
          case (y < 2250):
      x.setStyle({color: "#800026"});
          break;

      default:
      x.setStyle({color: "#4d0017"});
          break;
  }

 




  //define popup
    x.addTo(map).bindPopup("<span class='elevationtext'>Elevation: <br></span>" + x.elevation +" m");

//define popup behaviour
    x.on('mouseover', function (e) {
      this.openPopup();
    });
    x.on('mouseout', function (e) {
      this.closePopup();
    });

//define onclick function
    x.on('click', function (e) {
      //search for point name in routesarray
      var found = routesarray.find(element => element.name == x.name);
      console.log("found: " + found.name);
      //open popup of route
      found.openPopup();
      //update description box
      info.update = function () {
          this._div.innerHTML = "<span class='elevationtext'>Hiking trial: <br></span><span class='trialname'> " +  found.name + "</span>" ;
      };
      info.update();
      //zoom to path
      map.fitBounds(found.getBounds());
      //make all paths invisible
      for (var i = 0; i < routesarray.length; i++) {
          routesarray[i].setStyle({opacity: 0});
      }
      //make one path visible
      found.setStyle({opacity: 0.5});
    });
        return x;
    },
});
 //legend
 var legend = L.control({position: 'bottomleft'});
  
 legend.onAdd = function (map) {

 var div = L.DomUtil.create('div', 'info legend');
 labels = ['m'],
 elevations = [0,300,500,750,1000,1500,1750,2000,2250];

 for (var i = 0; i < elevations.length; i++) {

  if( i==elevations.length){
    div.innerHTML+= '<i class ="circle" style="border-radius: 40%; border-style: solid; width:'+ 'px; height:' + 'px; border-color:' + getColor(elevations[i] ) + ';"></i> ' +
    (elevations[i] ? '>' + elevations[i] + '&nbsp;&nbsp' + labels[0] + '<br>' : '+' + '&nbsp;&nbsp' + labels[0]);
    break;

  }
  else{
         div.innerHTML += 

         '<i class ="circle" style="border-radius: 40%; border-style: solid; width:'+ 'px; height:' + 'px; border-color:' + getColor(elevations[i] + 1) + ';"></i> ' +
       (elevations[i + 1] ? '<' + elevations[i + 1] + '&nbsp;&nbsp' + labels[0] + '<br>' : '>2250' + '&nbsp;&nbsp' + labels[0]);
  }
     }

 return div;
 };

   //legend color function
   function getColor(d) {
     return d <= 300 ? '#ffffcc' :
            d <= 500  ? '#ffeda0' :
            d <= 750 ? '#fed976' :
            d <= 1000  ? '#feb24c' :
            d <= 1500   ? '#fd8d3c' :
            d <= 1750 ? '#e31a1c' :
            d <= 2000   ? '#bd0026' :
            d <= 2250   ? '#800026' :
            '#4d0017';
 }
 legend.addTo(map);

 //mminimap
 var mini='https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}';
 var miniAttrib='Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012';
 var osm2 = new L.TileLayer(mini, {minZoom: 0, maxZoom: 13 , attribution:miniAttrib});
 var miniMap = new L.Control.MiniMap(osm2, { toggleDisplay: true, zoomLevelOffset: -6, aimingRectOptions:true }).addTo(map);

 //credits
 var credctrl = L.controlCredits({
  image: "./DATA/icons/info.png",
  link: "https://minha94.github.io/LeafletHikeMap/",
  text: "Web Cartography Project<br/>Minha Noor Sultan </br> Nelson Schäfer"
}).addTo(map);







