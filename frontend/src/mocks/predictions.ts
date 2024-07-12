import { AttackTypes, Prediction, } from "types/predictions";
import { generateRandomIP, getRandomAttack, getRandomISODate, getRandomProtocol } from "utils/utils";

export const prediction = (newP?: Partial<Prediction>): Prediction => {
    return {
        id: 1,
        createdDate: getRandomISODate(),
        sourceIp: generateRandomIP(),
        destinationIp: generateRandomIP(),
        protocol: getRandomProtocol(),
        attackType:  getRandomAttack(),
        attack: Math.random() > 0.5,
        ...newP,
    }
}

export const predictions = [prediction(), prediction(), prediction(),];

export const predictionsRandomMock = Array.from({length: 1000}).map((_, index) => prediction({
    id: index + 1,
}));

