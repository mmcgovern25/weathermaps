'use client';

import React, { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

const GlobeMap = () => {
  const mapContainer = useRef(null);
  const [mapboxLoaded, setMapboxLoaded] = useState(false);

  useEffect(() => {
    if (mapboxLoaded && mapContainer.current) {
      const mapboxgl = window.mapboxgl;
      mapboxgl.accessToken = 'pk.eyJ1IjoibWF0dG1jZ292ZXJuMjUiLCJhIjoiY2xtOWpkZWZoMGxvZzNwcGM1Yzlmd2k3diJ9.9EkXzkecaVXwJHGJqIShpQ';
      
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        projection: 'globe',
        zoom: 1.5,
        center: [30, 15]
      });

      map.addControl(new mapboxgl.NavigationControl());
      map.scrollZoom.disable();

      map.on('load', () => {
        console.log('Map loaded');
        map.setFog({});

        fetch('data/country-boundaries.geojson')
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            console.log('GeoJSON data loaded', data);
            map.addSource('country-boundaries', {
              type: 'geojson',
              data: data
            });

            map.addLayer({
              'id': 'country-boundaries-fill',
              'type': 'fill',
              'source': 'country-boundaries',
              'paint': {
                'fill-color': '#FFA500',
                'fill-opacity': 0.6,
              }
            });

            map.addLayer({
              'id': 'country-boundaries-outline',
              'type': 'line',
              'source': 'country-boundaries',
              'paint': {
                'line-color': '#FFA500',
                'line-width': 1,
              }
            });

            console.log('Layers added');
          })
          .catch(error => {
            console.error('Error loading or parsing GeoJSON:', error);
          });
      });

      const secondsPerRevolution = 240;
      const maxSpinZoom = 5;
      const slowSpinZoom = 3;
      let userInteracting = false;
      const spinEnabled = true;

      function spinGlobe() {
        const zoom = map.getZoom();
        if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
          let distancePerSecond = 360 / secondsPerRevolution;
          if (zoom > slowSpinZoom) {
            const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
            distancePerSecond *= zoomDif;
          }
          const center = map.getCenter();
          center.lng -= distancePerSecond;
          map.easeTo({ center, duration: 1000, easing: (n) => n });
        }
      }

      map.on('mousedown', () => {
        userInteracting = true;
      });

      map.on('dragstart', () => {
        userInteracting = true;
      });

      map.on('moveend', () => {
        spinGlobe();
      });

      spinGlobe();

      return () => map.remove();
    }
  }, [mapboxLoaded]);

  const handleMapboxLoad = () => {
    setMapboxLoaded(true);
  };

  return (
    <>
      <Script 
        src="https://api.mapbox.com/mapbox-gl-js/v3.7.0/mapbox-gl.js" 
        onLoad={handleMapboxLoad}
      />
      <link href="https://api.mapbox.com/mapbox-gl-js/v3.7.0/mapbox-gl.css" rel="stylesheet" />
      <div ref={mapContainer} style={{ position: 'absolute', top: 0, bottom: 0, width: '100%' }} />
    </>
  );
};

export default GlobeMap;