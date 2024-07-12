'use client';

import React, { useLayoutEffect, useRef } from "react";
import mapboxgl, { GeoJSONSource } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { interval } from "utils/timer";
import { WebsocketClient } from "socket";
import { Prediction } from "types/predictions";
import { getLocationIpInfo } from "actions/ipinfo";

const geoUrl =
  "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

const abort = new AbortController();

const MapChart = () => {

  const ipCounter = useRef<Map<string, number>>(new Map());
  const ipToLatLng = useRef<Map<string, [number, number] | null>>(new Map());
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const a = async (sourceIp: string) => {
      const previous = ipCounter.current.get(sourceIp);
      ipCounter.current.set(sourceIp, (previous || 0) + 1);

      if (!ipToLatLng.current.has(sourceIp)) {
          const res = await getLocationIpInfo(sourceIp);
          ipToLatLng.current.set(sourceIp, res?.loc ? res.loc.split(',').map((a) => +a).reverse() as [number, number] : null)
      }
  }

  React.useEffect(() => {
      WebsocketClient.addListener((p: string) => {
          try {
              const { attack, sourceIp }: Prediction = JSON.parse(p);

              if (attack) a(sourceIp)
          } catch (error) {
            
          }
      })

      interval(1000, abort.signal, () => {
        const newData = {
            type: "FeatureCollection",
            features: [] as any[],
        }
        
        for (const [ip, counter] of ipCounter.current.entries()) {
            const loc = ipToLatLng.current.get(ip);
            if (!loc) continue;
            newData.features.push({ geometry: { type: "Point", coordinates: loc }, type: "Feature", properties: { "point_count": counter } })
        }
        (mapRef.current?.getSource("attacks_locations") as GeoJSONSource)?.setData(newData as any);
      });

      // return () => abort.abort();
  }, []);

  useLayoutEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZG9yYWZtZW5kZXMiLCJhIjoiY2x4bnR0ZmJnMDIxODJrcHMwcTJnN3dzMyJ9.LIeqeekJTuFqCmaK3vKELQ';

    const map = new mapboxgl.Map({
      container: 'map',
      // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-77.04, 38.907,],
      zoom: 1.5,
      projection: {name: "globe"},
    });

    map.on('load', () => {
      map.addSource('attacks_locations', {
        'type': 'geojson',
        'data': { type: "FeatureCollection",features: [] },
        clusterMaxZoom: 14,
        clusterRadius: 50
      });

      map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'attacks_locations',
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#51bbd6',
            100,
            '#f1f075',
            750,
            '#f28cb1'
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            20,
            100,
            30,
            750,
            40
          ]
        }
      });

      map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'attacks_locations',
        layout: {
          'text-field': ['get', 'point_count'],
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12
        }
      });

      mapRef.current = map;
    });


  }, [])



  return (
    <div id="map" style={{ width: '100%', height: '500px', }}></div>
  );
};

export default React.memo(MapChart, () => true);
