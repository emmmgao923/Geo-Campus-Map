import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import '../App.css'
import * as turf from "@turf/turf";

const campusBounds = [
  [-72.52811100006191, 42.38660446181402],
  [-72.51188899993988, 42.393395354513274],
];

const buildingEvents = {
  bldg_005_1: [
    { category: "study" },
    { category: "study" },
  ],
  bldg_007: [
    { category: "study" },
    { category: "study" },
    { category: "emergency"},
  ],
  bldg_001:[
    { category: "study" },
    { category: "announcement"},
    { category: "activity"},
  ]
};


const CATEGORY_ICON = {
  study: "pin-study",
  activity: "pin-activity",
  food:  "pin-food",
  emergency: "pin-emergency",
  announcement: "pin-announcement",
};



function randomPointInPolygon(geometry, maxTries = 40) {
  let poly;

  if (geometry.type === "Polygon") {
    poly = geometry;
  } else if (geometry.type === "MultiPolygon") {
    poly = { type: "Polygon", coordinates: geometry.coordinates[0] };
  } else {
    return null;
  }

  const bbox = turf.bbox(poly);

  for (let i = 0; i < maxTries; i++) {
    const p = turf.point([
      bbox[0] + Math.random() * (bbox[2] - bbox[0]),
      bbox[1] + Math.random() * (bbox[3] - bbox[1]),
    ]);
    if (turf.booleanPointInPolygon(p, poly)) {
      return p;
    }
  }

  return null;
}

function loadIcon(map, name, url) {
  return new Promise((resolve, reject) => {
    if (map.hasImage(name)) return resolve();
    map.loadImage(url, (err, image) => {
      if (err || !image) return reject(err || new Error("No image"));
      map.addImage(name, image);
      resolve();
    });
  });
}



function MapView() {
  const mapRef = useRef();
  const mapContainerRef = useRef();
  const markersRef = useRef([]);

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1Ijoic2FtbWllMjAwMiIsImEiOiJjbWhteTQ5anowZ3ZmMnBxNHVnc2lzejZyIn0.Q8HjRgUdvGzm8yzRmyaLSg";
    const map = new mapboxgl.Map({
      center: [-72.52, 42.39],
      maxBounds: campusBounds,
      style: "mapbox://styles/sammie2002/cmhogkb5a001b01r0fwbo7qkr",
      container: mapContainerRef.current,
      zoom: 17,
    });

    mapRef.current = map;

    map.on("load", async () => {
      console.log("Map loaded");
      let feature = null;
      let hoveredId = null;

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

      try {
        await Promise.all([
          loadIcon(map, "pin-study", "/pins/pin-study.png"),
          loadIcon(map, "pin-announcement", "/pins/pin-announcement.png"),
          loadIcon(map, "pin-activity", "/pins/pin-activity.png"),
          loadIcon(map, "pin-emergency", "/pins/pin-emergency.png"),
        ]);
      } catch (e) {
        console.error("Failed to load pin icons", e);
        return;
      }


      let buildingsData;
      try {
        const res = await fetch("/UmassBuildings.geojson");
        buildingsData = await res.json();
      } catch (err) {
        console.error("Failed to fetch UmassBuildings.geojson", err);
        return;
      }

      if (!buildingsData || !buildingsData.features) {
        console.error("Invalid UmassBuildings data");
        return;
      }

      const emojiPinFeatures = [];

      buildingsData.features.forEach((feature) => {
        const bId = feature?.properties?.id;
        const bName = feature?.properties?.name;
        if (!bId) return;

        const events = buildingEvents[bId];
        if (!events || !events.length) return;

        events.forEach((evt, index) => {
          const iconId = CATEGORY_ICON[evt.category] || "pin-study";

          const p = randomPointInPolygon(feature.geometry);
          if (!p) return;

          emojiPinFeatures.push({
            type: "Feature",
            geometry: p.geometry,
            properties: {
              iconId,
              buildingId: bId,
              buildingName: bName,
              category: evt.category,
              idx: index,
            },
          });
        });
      });


      const markers = [];


       emojiPinFeatures.forEach((f) => {
        // 外层：给 Mapbox 用来定位，不能加 transform 动画
        const el = document.createElement("div");

        // 内层：真正显示 pin + 动画
        const pin = document.createElement("div");
        pin.className = "floating-pin floating-pin--float";
        pin.style.backgroundImage = `url(/pins/${f.properties.iconId}.png)`;
        pin.style.backgroundSize = "contain";
        pin.style.backgroundRepeat = "no-repeat";
        pin.style.width = "66px";
        pin.style.height = "66px";

        el.appendChild(pin);

        const marker = new mapboxgl.Marker({
            element: el,
            anchor: "bottom",
        })
            .setLngLat(f.geometry.coordinates)
            .addTo(map);

        markers.push(marker);
        });


      markersRef.current = markers; 


      const MIN_ZOOM = 17;

        function updateMarkerVisibility() {
        const show = map.getZoom() >= MIN_ZOOM;
        markersRef.current.forEach((m) => {
            const el = m.getElement();
            el.style.display = show ? "block" : "none";
        });
        }

        // 初始化时先调一次（以防初始 zoom 就已经 ≥ 17）
        updateMarkerVisibility();

        map.on("zoom", updateMarkerVisibility);
      
      map.on("mousemove", "campus-buildings-hit", (e) => {
        if (!e.features?.length) return;
        const f = e.features[0];
        const buildingId = f.properties.id;
        const name = f.properties.name;

        if (hoveredId === buildingId) return;
        hoveredId = buildingId;

        window.dispatchEvent(
          new CustomEvent("umass:building-hover", {
            detail: {
              id: buildingId,
              name: name,
              properties: f.properties,
            },
          })
        );
      });

      map.on("mouseleave", "campus-buildings-hit", () => {
        window.dispatchEvent(new Event("umass:building-leave"));
      });

      // NEW: click a building to pin the sidebar
map.on("click", "campus-buildings-hit", (e) => {
  const f = e.features?.[0];
  if (!f) return;
  const buildingId = f.properties.id;
  const name = f.properties.name;

  window.dispatchEvent(
    new CustomEvent("umass:building-pin", {
      detail: {
        id: buildingId,
        name: name,
        properties: f.properties,
      },
    })
  );
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
            map.setFeatureState(feature, { highlight: false });
          }
          feature = e.feature;
          map.setFeatureState(feature, { highlight: true });
        },
      });

      map.addInteraction("map-handler", {
        type: "mousemove",
        handler: () => {
          if (feature) {
            map.setFeatureState(feature, { highlight: false });
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