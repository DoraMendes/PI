import { AttackTypePercentages, AttackVSNonAttack, AttacksLastMonth, GeoIpLocation } from "types/statistics";
import { randomDate } from "utils/utils";

export const dailyAttackCountsMock = (): number => {
    return 50;
}

export const attackLastMonthMock = (override?: any): AttacksLastMonth => {
    return {
        date: randomDate(new Date(2024, 4, 1), new Date(2024, 4, 31)),
        count: Math.floor(Math.random()*1000)
    }
};

export const attacksLastMonthMock : AttacksLastMonth[] = [attackLastMonthMock(), attackLastMonthMock(), attackLastMonthMock(), attackLastMonthMock(), attackLastMonthMock()];

export const attackVSNonAttackMock = (): AttackVSNonAttack => {
    return {
        attacks: 10,
        nonAttacks: 20,
    }
}

export const geoIpLocationMock = (): GeoIpLocation => {
    return {
        country: "Country (Unknown if null)",
        city: "City (Unknown if null)",
        latitude: '11',
        longitude: '22',
    }
}

export const attackTypePercentagesMock = (i: number): AttackTypePercentages => {
    return {
        type: i+1,
        count: Math.floor(Math.random()*1000),
        percentage: Math.floor(Math.random()*1000),
    }
}

export const attacksTypePercentagesMock: AttackTypePercentages[] = Array.from({length: 12}).map((a, idx) => attackTypePercentagesMock(idx))