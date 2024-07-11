import { AttackTypes } from "types/predictions";
import { AttackTypePercentages, AttackVSNonAttack, GeoIpLocation } from "types/statistics";
import { generateRandomPoints, randomDate } from "utils/utils";

export const dailyAttackCountsMock = (): number => {
    return 50;
}

export const attackLastMonthMock = (): any => {
    return {
        date: randomDate(new Date(2024, 4, 1), new Date(2024, 4, 31)),
        count: Math.floor(Math.random()*1000)
    }
};

export const attacksLastMonthMock : any[] = [attackLastMonthMock(), attackLastMonthMock(), attackLastMonthMock(), attackLastMonthMock(), attackLastMonthMock()];

export const attackVSNonAttackMock = (): AttackVSNonAttack => {
    return {
        attacks: 10,
        nonAttacks: 20,
    }
}

export const geoIpLocationMock = (coord: {lat: number, lng: number}): GeoIpLocation => {
    return {
        country: "Country (Unknown if null)",
        city: `city-${Math.random()}`,
        latitude: coord.lat.toString(),
        longitude: coord.lng.toString(),
    }
}

export const geoIpLocationsMock: GeoIpLocation[] = Array.from({length: 100}).map((a, idx) => geoIpLocationMock(generateRandomPoints({'lat':24.23, 'lng':23.12}, 1000, 100)[idx]))


export const attackTypePercentagesMock = (i: number): any => {
    return AttackTypes.reduce((acc, a) => ({...acc, [a]: 0}), {})
}

export const attacksTypePercentagesMock: AttackTypePercentages[] = Array.from({length: 8}).map((a, idx) => attackTypePercentagesMock(idx))