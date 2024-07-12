import axios from 'axios';
import { prediction, predictionsRandomMock } from 'mocks/predictions';
import { predictionURL, predictionsURL, filteredPredictionsURL } from 'services/predictions';

export const getPrediction = async (id: number) => {
    try {
        const { data } = await axios.get(predictionURL(id));
        return data;
    } catch (error) {
        return null;
    }
}

export const getPredictions = async () => {
    try {
        const { data } = await axios.get(predictionsURL());
        return data;
    } catch (error) {
        return null;
    }
}

export const getFilteredPredictions = async (params?: Record<string, (string | number | boolean) | (string | number | boolean)[]>) => {
    try {
        const { data } = await axios.get(filteredPredictionsURL(params));
        return data;
    } catch (error) {
        return null;
    }
}
