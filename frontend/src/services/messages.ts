import { API_URL } from "settings"

export const subscribeMessage = () => {
    return `${API_URL}/messages/subscribe`;
}