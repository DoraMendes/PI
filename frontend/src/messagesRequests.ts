import axios from "axios"
import { subscribeMessage } from "services/messages"

export const subscribe = async ({ keys, ...rest }: PushSubscriptionJSON) => {
    try {
        const { data } = await axios.post(subscribeMessage(), {...rest, keyAuth: keys.auth, keyPrivate: keys.p256dh });
        return data; 
    } catch {
        return null;
    }
}