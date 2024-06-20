import { Prediction } from "types/predictions";

export const prediction = (): Prediction => {
    return {
        id: 1,
        createdDate: 'a',
        sourceIp:  'a',
        destinationIp:  'a',
        protocol:  'a',
        attackType:  'a',
        attack: true,
    }
}

export const predictions = [prediction(), prediction(), prediction()];