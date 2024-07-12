import { Prediction } from "./predictions";

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

export type AttackTypePercentages = { [P in Prediction['attackType']]: number };
