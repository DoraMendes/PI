import { API_URL } from "settings";
import queryString from "query-string";

// List
export const predictionURL = (id: number) => {
    return `${API_URL}/predictions/${id}`;
} 

export const predictionsURL = () => {
    return `${API_URL}/predictions/filtered`;
} 

export const filteredPredictionsURL = (params: Record<string, unknown> = {}) => {
    const query = queryString.stringify(params); // TODO: funcao
    return `${API_URL}/predictions/filtered/?${query}`;
} 
