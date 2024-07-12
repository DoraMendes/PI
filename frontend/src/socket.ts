import { WS_URL, } from "settings";

export class WebsocketClient {
    private static ws: WebSocket;

    private static listeners: Array<(data: any) => void> = [];

    static init = ()=> {
        WebsocketClient.ws = new WebSocket(WS_URL);
        WebsocketClient.ws.onmessage = WebsocketClient.notifyListeners
    }


    static notifyListeners = (ev: MessageEvent<any>) => {
        WebsocketClient.listeners.forEach((fn) => fn(ev.data))
    }

    static addListener = (fn: (_data: any) => void) => {
        WebsocketClient.listeners.push(fn)
    }
}