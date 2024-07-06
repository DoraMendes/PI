import axios from 'axios';
import { predictionURL, predictionsURL, filteredPredictionsURL } from 'services/predictions';

// TODO: esta existe?
export const getPrediction = async (id: number) => {
    try {
        const { data } = await axios.get(predictionURL(id));
        return data;
    } catch (error) {
        return null;
    }
}

// TODO: ver se é preciso esta e a debaixo
export const getPredictions = async () => {
    try {
        const { data } = await axios.get(predictionsURL());
        return data;
    } catch (error) {
        return null;
    }
}

// TODO: ver se é preciso esta e a de cima
export const getFilteredPredictions = async () => {
    try {
        const { data } = await axios.get(filteredPredictionsURL());
        return data;
    } catch (error) {
        return null;
    }
}
