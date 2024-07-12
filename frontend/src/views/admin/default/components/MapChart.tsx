'use client';

import React, { useLayoutEffect, useState, } from "react";
import { MapContainer, Marker, Pane, Popup, Rectangle, TileLayer, } from 'react-leaflet';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getGeo, } from "statisticsRequests";
import { generateFeature, generateRandomPoints, } from '../../../../utils/utils';
import { geoIpLocationsMock, } from "mocks/statistics";

const geoUrl =
  "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

const MapChart = () => {

  const [locations, setLocations,] = useState<any[]>([]);

  React.useEffect(() => {
    // getGeo(1).then((a) => setLocations(a));
  }, []);

  useLayoutEffect(() => {
    // TO MAKE THE MAP APPEAR YOU MUST 
    // ADD YOUR ACCESS TOKEN FROM
    // https://account.mapbox.com
    mapboxgl.accessToken = 'pk.eyJ1IjoiZG9yYWZtZW5kZXMiLCJhIjoiY2x4bnR0ZmJnMDIxODJrcHMwcTJnN3dzMyJ9.LIeqeekJTuFqCmaK3vKELQ';
    // const map = new mapboxgl.Map({
    // container: 'map',
    // // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    // style: 'mapbox://styles/mapbox/satellite-streets-v11',
    // zoom: 1.5,
    // center: [30, 50],
    // projection: 'globe'
    // });
    //   const map = new mapboxgl.Map({
    //     container: 'map',
    //     // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    //     style: 'mapbox://styles/mapbox/streets-v12',
    //     center: [12.550343, 55.665957],
    //     projection: 'globe',
    //     zoom: 1.5
    // });


    //   map.on('load', () => {
    //   // Set the default atmosphere style
    //   map.setFog({});
    //   });

    //   // Create a default Marker and add it to the map.
    //   const marker1 = new mapboxgl.Marker()
    //       .setLngLat([12.554729, 55.70651])
    //       .addTo(map);

    //   // Create a default Marker, colored black, rotated 45 degrees.
    //   const marker2 = new mapboxgl.Marker({ color: 'black', rotation: 45 })
    //       .setLngLat([12.65147, 55.608166])
    //       .addTo(map);

    const map = new mapboxgl.Map({
      container: 'map',
      // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-77.04, 38.907,],
      zoom: 1.5,
      projection: {name: "globe"},
    });

    map.on('load', () => {
      map.addSource('places', {
        'type': 'geojson',
        'data': {
          'type': 'FeatureCollection',
          // 'features': geoIpLocationsMock.map((l) => {
          //   {
          //       'type': 'Feature',
          //       'properties': {
          //           'description':
          //               '<strong>Make it Mount Pleasant</strong><p>Make it Mount Pleasant is a handmade and vintage market and afternoon of live entertainment and kids activities. 12:00-6:00 p.m.</p>'
          //       },
          //       'geometry': {
          //           'type': 'Point',
          //           'coordinates': [-77.038659, 38.931567]
          //       }
          //     }
          // })
          'features': Array.from({ length: geoIpLocationsMock.length, }).map((l, idx) => generateFeature({ lat: geoIpLocationsMock.map((g) => g.latitude)[idx], lng: geoIpLocationsMock.map((g) => g.longitude)[idx], }, geoIpLocationsMock.map((g) => g.city)[idx])) as any,
          // 'features': [
          //     {
          //         'type': 'Feature',
          //         'properties': {
          //             'description':
          //                 '<strong>Make it Mount Pleasant</strong><p>Make it Mount Pleasant is a handmade and vintage market and afternoon of live entertainment and kids activities. 12:00-6:00 p.m.</p>'
          //         },
          //         'geometry': {
          //             'type': 'Point',
          //             'coordinates': [-77.038659, 38.931567]
          //         }
          //     },
          //     {
          //         'type': 'Feature',
          //         'properties': {
          //             'description':
          //                 '<strong>Mad Men Season Five Finale Watch Party</strong><p>Head to Lounge 201 (201 Massachusetts Avenue NE) Sunday for a Mad Men Season Five Finale Watch Party, complete with 60s costume contest, Mad Men trivia, and retro food and drink. 8:00-11:00 p.m. $10 general admission, $20 admission and two hour open bar.</p>'
          //         },
          //         'geometry': {
          //             'type': 'Point',
          //             'coordinates': [-77.003168, 38.894651]
          //         }
          //     },
          //     {
          //         'type': 'Feature',
          //         'properties': {
          //             'description':
          //                 '<strong>Big Backyard Beach Bash and Wine Fest</strong><p>EatBar (2761 Washington Boulevard Arlington VA) is throwing a Big Backyard Beach Bash and Wine Fest on Saturday, serving up conch fritters, fish tacos and crab sliders, and Red Apron hot dogs. 12:00-3:00 p.m. $25.</p>'
          //         },
          //         'geometry': {
          //             'type': 'Point',
          //             'coordinates': [-77.090372, 38.881189]
          //         }
          //     },
          //     {
          //         'type': 'Feature',
          //         'properties': {
          //             'description':
          //                 '<strong>Ballston Arts & Crafts Market</strong><p>The Ballston Arts & Crafts Market sets up shop next to the Ballston metro this Saturday for the first of five dates this summer. Nearly 35 artists and crafters will be on hand selling their wares. 10:00-4:00 p.m.</p>'
          //         },
          //         'geometry': {
          //             'type': 'Point',
          //             'coordinates': [-77.111561, 38.882342]
          //         }
          //     },
          //     {
          //         'type': 'Feature',
          //         'properties': {
          //             'description':
          //                 "<strong>Seersucker Bike Ride and Social</strong><p>Feeling dandy? Get fancy, grab your bike, and take part in this year's Seersucker Social bike ride from Dandies and Quaintrelles. After the ride enjoy a lawn party at Hillwood with jazz, cocktails, paper hat-making, and more. 11:00-7:00 p.m.</p>"
          //         },
          //         'geometry': {
          //             'type': 'Point',
          //             'coordinates': [-77.052477, 38.943951]
          //         }
          //     },
          //     {
          //         'type': 'Feature',
          //         'properties': {
          //             'description':
          //                 '<strong>Capital Pride Parade</strong><p>The annual Capital Pride Parade makes its way through Dupont this Saturday. 4:30 p.m. Free.</p>'
          //         },
          //         'geometry': {
          //             'type': 'Point',
          //             'coordinates': [-77.043444, 38.909664]
          //         }
          //     },
          //     {
          //         'type': 'Feature',
          //         'properties': {
          //             'description':
          //                 '<strong>Muhsinah</strong><p>Jazz-influenced hip hop artist Muhsinah plays the Black Cat (1811 14th Street NW) tonight with Exit Clov and Gods’illa. 9:00 p.m. $12.</p>'
          //         },
          //         'geometry': {
          //             'type': 'Point',
          //             'coordinates': [-77.031706, 38.914581]
          //         }
          //     },
          //     {
          //         'type': 'Feature',
          //         'properties': {
          //             'description':
          //                 "<strong>A Little Night Music</strong><p>The Arlington Players' production of Stephen Sondheim's <em>A Little Night Music</em> comes to the Kogod Cradle at The Mead Center for American Theater (1101 6th Street SW) this weekend and next. 8:00 p.m.</p>"
          //         },
          //         'geometry': {
          //             'type': 'Point',
          //             'coordinates': [-77.020945, 38.878241]
          //         }
          //     },
          //     {
          //         'type': 'Feature',
          //         'properties': {
          //             'description':
          //                 '<strong>Truckeroo</strong><p>Truckeroo brings dozens of food trucks, live music, and games to half and M Street SE (across from Navy Yard Metro Station) today from 11:00 a.m. to 11:00 p.m.</p>'
          //         },
          //         'geometry': {
          //             'type': 'Point',
          //             'coordinates': [-77.007481, 38.876516]
          //         }
          //     }
          // ]
        },
      });
      // Add a layer showing the places.
      map.addLayer({
        'id': 'places',
        'type': 'circle',
        'source': 'places',
        'paint': {
          'circle-color': '#4264fb',
          'circle-radius': 6,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
        },
      });

      // Create a popup, but don't add it to the map yet.
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      });

      map.on('mouseenter', 'places', (e) => {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';

        // Copy coordinates array.
        const coordinates = (e.features[0].geometry as any).coordinates.slice();
        const description = e.features[0].properties.description;

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        // Populate the popup and set its coordinates
        // based on the feature found.
        popup.setLngLat(coordinates).setHTML(description).addTo(map);
      });

      map.on('mouseleave', 'places', () => {
        map.getCanvas().style.cursor = '';
        popup.remove();
      });
    });


  }, [])



  return (
    <div id="map" style={{ width: '100%', height: '500px', }}></div>
  );
};

export default MapChart;
