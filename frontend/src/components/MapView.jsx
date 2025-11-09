import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "../App.css";
import * as turf from "@turf/turf";
import { motion } from "framer-motion";
import { createRoot } from "react-dom/client";

const campusBounds = [
  [-72.52811100006191, 42.38660446181402],
  [-72.51188899993988, 42.393395354513274],
];

const CATEGORY_ICON = {
  study: "pin-study",
  activity: "pin-activity",
  food: "pin-food",
  emergency: "pin-emergency",
  notice: "pin-announcement",
};

const API_BASE = "http://localhost:8000/api/events";

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
    if (turf.booleanPointInPolygon(p, poly)) return p;
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
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const markersRef = useRef([]);
  const userMarkerRef = useRef(null);

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1Ijoic2FtbWllMjAwMiIsImEiOiJjbWhteTQ5anowZ3ZmMnBxNHVnc2lzejZyIn0.Q8HjRgUdvGzm8yzRmyaLSg";

    const defaultCenter = [-72.52, 42.39];
    const defaultZoom = 16;

    // ✅ 创建地图
    const initMap = (center) => {
      if (!mapContainerRef.current) {
        console.error("Map container not ready yet");
        return;
      }

      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/sammie2002/cmhogkb5a001b01r0fwbo7qkr",
        center,           // 用户定位中心
        zoom: defaultZoom,
      });
      mapRef.current = map;

      map.on("load", async () => {
        console.log("✅ Map fully loaded at", center);

        // ✅ 加载完后再设置边界，防止定位被 clamp 掉
        map.setMaxBounds(campusBounds);

        // 🔴 添加用户定位红点
        userMarkerRef.current = new mapboxgl.Marker({ color: "red" })
          .setLngLat(center)
          .setPopup(new mapboxgl.Popup().setText("📍 You are here"))
          .addTo(map);

        // ======== 以下是原有事件和图标逻辑 =========
        let featureUnderCursor = null;
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

        const buildingEvents = {};
        await Promise.all(
          buildingsData.features.map(async (ft) => {
            const bId = ft?.properties?.id;
            if (!bId) return;
            try {
              const res = await fetch(`${API_BASE}/${bId}`);
              if (!res.ok) return;
              const events = await res.json();
              if (events && events.length) buildingEvents[bId] = events;
            } catch (e) {
              console.error("Failed to fetch events for building:", bId, e);
            }
          })
        );
        
      const emojiPinFeatures = [];

      buildingsData.features.forEach((feature) => {
        const bId = feature?.properties?.id;
        const bName = feature?.properties?.name;
        if (!bId) return;

        const events = buildingEvents[bId];
        if (!events || !events.length) return;

        events.forEach((evt, index) => {
          const iconId = CATEGORY_ICON[evt.type] || "pin-study";

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
              eventId: evt._id || evt.id,
            },
          });
        });
      });


      const markers = [];


       emojiPinFeatures.forEach((f) => {
        // 外层：给 Mapbox 用来定位，不能加 transform 动画
        const el = document.createElement("div");
        const pin = document.createElement("div");
        pin.className = "floating-pin floating-pin--float";
        pin.style.backgroundImage = `url(/pins/${f.properties.iconId}.png)`;
        pin.style.backgroundSize = "contain";
        pin.style.backgroundRepeat = "no-repeat";
        pin.style.width = "66px";
        pin.style.height = "66px";

        el.appendChild(pin);

        const marker = new mapboxgl.Marker({ element: outer, anchor: "bottom" })
            .setLngLat(f.geometry.coordinates)
            .addTo(map);

        const payload = {
            buildingId: f.properties.buildingId,
            name: f.properties.buildingName,
            eventId: f.properties.eventId,
            // 把整栋楼的 events 也顺便塞过去，省得 MapPage 再查
            events: buildingEvents[f.properties.buildingId] || [],
        };

        el.addEventListener("mouseenter", () => {
            window.dispatchEvent(
            new CustomEvent("umass:pin-hover", { detail: payload })
            );
        });

        el.addEventListener("mouseleave", () => {
            window.dispatchEvent(
            new CustomEvent("umass:pin-leave", { detail: payload })
            );
        });

        markers.push(marker);
        });
        markersRef.current = markers;

        const MIN_ZOOM = 17;
        const updateMarkerVisibility = () => {
          const show = map.getZoom() >= MIN_ZOOM;
          markersRef.current.forEach((m) => {
            const el = m.getElement();
            el.style.display = show ? "block" : "none";
          });
        };
        updateMarkerVisibility();
        map.on("zoom", updateMarkerVisibility);

        const TARGET_ZOOM = 18;
        const SIDE_PADDING_RATIO = 0.35;

        map.on("click", "campus-buildings-hit", (e) => {
          if (!e.features?.length) return;
          const f = e.features[0];
          let centerLngLat;
          if (f.geometry && f.geometry.type === "Polygon") {
            const centerF = turf.centerOfMass(f);
            centerLngLat = centerF.geometry.coordinates;
          } else {
            centerLngLat = [e.lngLat.lng, e.lngLat.lat];
          }

          map.easeTo({
            center: centerLngLat,
            zoom: TARGET_ZOOM,
            duration: 800,
            padding: {
              left: window.innerWidth * SIDE_PADDING_RATIO,
              right: 40,
              top: 40,
              bottom: 40,
            },
          });

          const buildingId = f.properties.id;
          const name = f.properties.name;
          const events = buildingEvents[buildingId] || [];
          window.dispatchEvent(
            new CustomEvent("umass:building-pin", {
              detail: { id: buildingId, name, properties: f.properties, events },
            })
          );
        });

     // NEW: click a building to pin the sidebar
        map.on("click", "campus-buildings-hit", (e) => {
        const f = e.features?.[0];
        if (!f) return;
        const buildingId = f.properties.id;
        const name = f.properties.name;

          if (hoveredId === buildingId) return;
          hoveredId = buildingId;

          const events = buildingEvents[buildingId] || [];
          window.dispatchEvent(
            new CustomEvent("umass:building-hover", {
              detail: { id: buildingId, name, properties: f.properties, events },
            })
          );
        });

        map.on("mouseleave", "campus-buildings-hit", () => {
          hoveredId = null;
          window.dispatchEvent(new Event("umass:building-leave"));
        });
      }); // end map.on("load")
    };

    // ✅ Step 2: get geolocation first
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { longitude, latitude } = pos.coords;
          console.log("✅ Got user location:", longitude, latitude);
          const userPos = [longitude, latitude];
          initMap(userPos); // 地图初始中心 = 用户位置
        },
        (err) => {
          console.warn("⚠️ Geolocation failed:", err);
          initMap(defaultCenter); // 失败则回退默认位置
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      console.warn("❌ Geolocation not supported");
      initMap(defaultCenter);
    }

    // Cleanup
    return () => {
      try {
        markersRef.current.forEach((m) => m.remove());
        markersRef.current = [];
        if (userMarkerRef.current) {
          userMarkerRef.current.remove();
          userMarkerRef.current = null;
        }
        mapRef.current && mapRef.current.remove();
      } catch (e) {
        // ignore cleanup errors
      }
    };
  }, []);

  return <div className="map-container" ref={mapContainerRef} />;
}

export default MapView;
