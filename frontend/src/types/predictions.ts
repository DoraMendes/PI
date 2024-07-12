export const AttackTypes = ['UNKNOWN' ,'APACHE_KILLER' ,'RUDY' ,'SLOW_READ' ,'SLOW_LORIS' ,'ARP_SPOOFING' ,'CAM_OVERFLOW' ,'MQTT_MALARIA' ,'NETWORK_SCAN',] as const;
export const Protocols = ['ICMP', 'TCP', 'UDP'];

export interface Prediction {
    id: number;
    createdDate: string;
    sourceIp: string | null,
    destinationIp: string | null,
    protocol: string,
    attackType: (typeof AttackTypes)[number]
    attack: boolean;
}

export interface FiltersHistory {
    selectedAttack: Prediction['attack'][],
    selectedProtocol: Prediction['protocol'][],
    selectedSourceIP: Prediction['sourceIp'],
    selectedDestinationIP: Prediction['destinationIp'],
    selectedAttackType: Prediction['attackType'][],
    selectedDateRange: {start: string, end: string};
}