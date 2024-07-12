import axios from 'axios';
import { attackTypePercentagesMock, attackVSNonAttackMock, attacksLastMonthMock, attacksTypePercentagesMock, dailyAttackCountsMock, geoIpLocationMock, } from 'mocks/statistics';
import { attackTypePercentagesURL, attacksLastMonthCountURL, attacksVSNonAttacksCountURL, dailyAttacksCountURL, geoURL, } from 'services/statistics';
import { Prediction } from 'types/predictions';
import { GeoIpLocation, } from 'types/statistics';

export const getDailyAttacksCount = async (): Promise<number | null> => {
    try {
        // const { data } = await axios.get(dailyAttacksCountURL());
        // return data;
        return dailyAttackCountsMock();
    } catch (error) {
        return null;
    }
}

// TODO: mudar a estrutura do output e tipar
export const getAttacksLast5MinutesCount = async (): Promise<{ [x in Prediction['attackType']]: number[] }> => {
    try {
        // const { data } = await axios.get(attacksLastMonthCountURL());
        // return data;
        return {} as any;
    } catch (error) {
        return null;
    }
}

// TODO: mudar a estrutura do output e tipar
export const getAttacksVSNonAttacksCount = async () => {
    try {
        // const { data } = await axios.get(attacksVSNonAttacksCountURL());
        // return data;
        return attackVSNonAttackMock();
    } catch (error) {
        return null;
    }
}

// TODO: ver parametro
export const getGeo = async (id: number): Promise<GeoIpLocation> => {
    try {
        // const { data } = await axios.get(geoURL(id));
        // return data;
        return geoIpLocationMock({lat: 1, lng: 3,});
    } catch (error) {
        return null;
    }
}

// TODO: mudar a estrutura do output e tipar
export const getAttackTypePercentages = async () => {
    try {
        // const { data } = await axios.get(attackTypePercentagesURL());
        // return data;
        return attacksTypePercentagesMock;
    } catch (error) {
        return null;
    }
}

