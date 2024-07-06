import { API_URL } from "settings";

// Statistics 
export const dailyAttacksCountURL = () => {
    return `${API_URL}/predictions/dailyattackcounts`;
};

export const attacksLastMonthCountURL = () => {
    return `${API_URL}/predictions/attackslastmonth`;
};

export const attacksVSNonAttacksCountURL = () => {
    return `${API_URL}/predictions/attackvsnonattack`;
};

export const geoURL = (id: number) => {
    return `${API_URL}/predictions/geoip/${id}`;
};

export const attackTypePercentagesURL = () => {
    return `${API_URL}/predictions/attacktypepercentages`;
};
