export interface AttacksLastMonth {
    date: Date;
    count: number;
}

export interface AttackVSNonAttack {
    attacks: number;
    nonAttacks: number;
}

export interface GeoIpLocation {
    country: string;
    city: string;
    latitude: string;
    longitude: string;
}

export interface AttackTypePercentages {
    type: number;
    count: number;
    percentage: number;
}
