'use client';

import { Spinner } from '@chakra-ui/react'
import React, { useLayoutEffect, useRef, useState } from "react";
import mapboxgl, { GeoJSONSource } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Prediction, } from 'types/predictions';
import { getLocationIpInfo } from "actions/ipinfo";


const MapChart = ({ predictions }: { predictions: Prediction[] }) => {

  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const a = async () => {
      const newData = {
          type: "FeatureCollection",
          features: [] as any[],
      }

      const ips = new Set<string>(predictions.map(({ sourceIp }) => sourceIp));
      const ipCounterMap = new Map<string, number>();
      const locations = Promise.all([...ips].map(getLocationIpInfo));
      
      predictions.forEach(({ sourceIp }) => {
          ipCounterMap.set(sourceIp, (ipCounterMap.get(sourceIp) || 0) + 1)
      });

      (await locations).forEach((location) => {
        if (!location?.loc) return;

        newData.features.push({ 
          geometry: { 
            type: "Point",
            coordinates: location.loc.split(',').map(Number).reverse() 
          }, 
          type: "Feature", 
          properties: { "point_count": ipCounterMap.get(location.ip) } })
      });

      setIsLoading(false);
      (mapRef.current?.getSource("attacks_locations") as GeoJSONSource)?.setData(newData as any)
  }

  React.useEffect(() => {
    setIsLoading(true);
    a()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [predictions]);

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
    <div style={{ position: "relative" }}>
      {isLoading && <Spinner style={{ position: "absolute", left: "50%", top: "50%" }} zIndex={1000000} />}
      <div id="map" style={{ width: '100%', height: '500px', opacity: isLoading ? .5 : 1 }}></div>
    </div>
  );
};

export default React.memo(MapChart, ({predictions}, {predictions: nextPredictions}) => predictions.length === nextPredictions.length);
