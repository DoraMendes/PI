export const AttackTypes = ['UNKNOWN' ,'APACHE_KILLER' ,'RUDY' ,'SLOW_READ' ,'SLOW_LORIS' ,'ARP_SPOOFING' ,'CAM_OVERFLOW' ,'MQTT_MALARIA' ,'NETWORK_SCAN',] as const;

export interface Prediction {
    id: number;
    createdDate: string;
    sourceIp: string,
    destinationIp: string,
    protocol: string,
    attackType: (typeof AttackTypes)[number]
    attack: boolean;
}

