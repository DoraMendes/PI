export interface Prediction {
    id: number;
    createdDate: string;
    sourceIp: string,
    destinationIp: string,
    protocol: string,
    attackType: string,
    attack: boolean;
}

