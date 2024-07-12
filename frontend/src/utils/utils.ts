import { DateTime } from "luxon";
import mapboxgl from "mapbox-gl";
import { AttackTypes, Protocols } from "types/predictions";

export const getAttackType = (attackNumber: number) => {
    const attackNumberToName: Record<number, string> = {
        0:' Normal',
        1: 'Apache Killer',
        2: 'RUDY',
        3: 'Slow Read',
        4: 'Slow Loris',
        5: 'ARP Spoofing',
        6: 'CAM Overflow',
        7: 'MQTT Malaria',
        8:' Network Scanning',
    };

    return attackNumberToName[attackNumber];
}

export const randomDate = (start: Date, end: Date)  => {
    const date = new Date(+start + Math.random() * (end.getTime() - start.getTime()));
    return date;
}


export const generateRandomPoints = (center: any, radius: any, count: any) => {
    const points = [];
    for (let i=0; i<count; i++) {
      points.push(generateRandomPoint(center, radius));
    }
    return points;
  }

export const generateRandomPoint = (center: any, radius: any) => {
    const x0 = center.lng;
    const y0 = center.lat;
    // Convert Radius from meters to degrees.
    const rd = radius/111300;
  
    const u = Math.random();
    const v = Math.random();
  
    const w = rd * Math.sqrt(u);
    const t = 2 * Math.PI * v;
    const x = w * Math.cos(t);
    const y = w * Math.sin(t);
  
    const xp = x/Math.cos(y0);
  
    // Resulting point.
    return {'lat': y+y0, 'lng': xp+x0};
  }

  export const generateFeature = (coord: {lat: string, lng: string}, city: string) => {
    return {
        'type': 'Feature',
        'properties': {
            'description': city,
        },
        'geometry': {
            'type': 'Point',
            'coordinates': [coord.lat, coord.lng]
        }
    }
}

export const gtAttackType = (attackNumber: number) => {
    const res:Record<number, string> = {
        0: 'Normal',
        1: 'Apache Killer',
        2: 'RUDY',
        3: 'Slow Read',
        4: 'Slow Loris',
        5: 'ARP Spoofing',
        6: 'CAM Overflow',
        7: 'MQTT Malaria',
        8:' Network Scanning'
    }

    return res[attackNumber];
}

export const getRandomAttack = () => {
    const max = AttackTypes.length - 1;
    const min = 0;
    const randomPosition = Math.floor(Math.random() * (max - min + 1) + min);
    return AttackTypes[randomPosition];
}

export const getRandomProtocol = () => {
    const max = Protocols.length -1;
    const min = 0;
    const randomPosition = Math.floor(Math.random() * (max - min + 1) + min);
    return Protocols[randomPosition];
}

export const getRandomISODate = () => {
    return DateTime.fromJSDate(randomDate(new Date(2024, 1, 1), new Date(2024, 6, 31))).toFormat('dd/LL/yyyy hh:mm')
}

export const getAttackName= (attackName: typeof AttackTypes[number]) => {
    const res: Record<typeof AttackTypes[number], string> = {
        'APACHE_KILLER': 'Apache Killer',
        'RUDY': 'RUDY',
        'SLOW_READ': 'Slow Read',
        'SLOW_LORIS': 'Slow Loris',
        'ARP_SPOOFING': 'ARP Spoofing',
        'CAM_OVERFLOW': 'CAM Overflow',
        'MQTT_MALARIA': 'MQTT Malaria',
        'NETWORK_SCAN':' Network Scanning',
        'UNKNOWN': 'Unknown'
    }

    return res[attackName];
}

export const generateRandomIP = () => {
    return (Math.floor(Math.random() * 255) + 1)+"."+(Math.floor(Math.random() * 255))+"."+(Math.floor(Math.random() * 255))+"."+(Math.floor(Math.random() * 255));
}

export const getTranslation = (field: string) => {
     const res: Record<string, string> = {
        'true': 'Malicious',
        'false': 'Normal',
        'APACHE_KILLER': 'Apache Killer',
        'RUDY': 'RUDY',
        'SLOW_READ': 'Slow Read',
        'SLOW_LORIS': 'Slow Loris',
        'ARP_SPOOFING': 'ARP Spoofing',
        'CAM_OVERFLOW': 'CAM Overflow',
        'MQTT_MALARIA': 'MQTT Malaria',
        'NETWORK_SCAN':' Network Scanning',
        'UNKNOWN': 'Unknown'
    }
    
    return res[field] || '';
}