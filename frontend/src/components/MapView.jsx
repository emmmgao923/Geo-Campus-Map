import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import '../App.css'

const campusBounds = [
  [-72.52811100006191, 42.38660446181402], 
  [-72.51188899993988, 42.393395354513274]
];

function MapView() {
  const mapRef = useRef();
  const mapContainerRef = useRef();

  useEffect(() => {

    mapboxgl.accessToken = "pk.eyJ1Ijoic2FtbWllMjAwMiIsImEiOiJjbWhteTQ5anowZ3ZmMnBxNHVnc2lzejZyIn0.Q8HjRgUdvGzm8yzRmyaLSg"; 
    const map= new mapboxgl.Map({
      center: [-72.52, 42.39],
      maxBounds: campusBounds,
      style: "mapbox://styles/sammie2002/cmhogkb5a001b01r0fwbo7qkr",  
      container: mapContainerRef.current,
      zoom: 16,
    });

    mapRef.current = map;

    map.on("load", () => {
      console.log("Map loaded");
      let feature = null;
      let hoveredId = null;

        const allLayerIds = map.getStyle().layers.map(l => l.id);
        console.log("All layers:", allLayerIds);


      const b = map.getBounds().toArray();
      console.log("current bounds:", b);

      map.addSource("UmassBuildings", {
        type: "geojson",
        data: "/UmassBuildings.geojson",
        generateId: true,
      });

      map.addLayer({
        id: "campus-buildings-hit",
        type: "fill",
        source: "UmassBuildings",
        paint: {
            "fill-color": "#000000",
            "fill-opacity": 0.0,
        },
      });

        map.on("mousemove", "campus-buildings-hit", (e) => {
            if (!e.features?.length) return;
            const f = e.features[0];
            const buildingId = f.properties.id;
            const name = f.properties.name;
            
            if (hoveredId === buildingId) return; //优化处理，不然只要鼠标在建筑物范围内移动他就会疯狂触发。。。

            hoveredId = buildingId;

            console.log("name:", name);
            console.log("building_id:", buildingId);
        });


      map.addInteraction("move-handler", {
         type: "mousemove",
         target: {
           featuresetId: "buildings",
           importId: "basemap",
         },
         handler: (e) => {
           if (!e.feature) return;

           if (feature) {
            console.log("ok");
             map.setFeatureState(feature, { highlight: false });
           }

           feature = e.feature;
           console.log("ok");
           map.setFeatureState(feature, { highlight: true });
         },
       });

       map.addInteraction("map-handler", {
         type: "mousemove",
         handler: () => {
           if (feature) {
           map.setFeatureState(feature, { highlight: false });
           console.log("ok");
             feature = null;
           }
           return false;
         },
       });
    });

    return () => mapRef.current.remove();
  }, []);

  return <div className="map-container" ref={mapContainerRef} />;
}


export default MapView;