import {Subject} from "@reactivex/rxjs/dist/package";

interface DataPacket {
    't': string // target
    'c': string  // command
    'v': DataValue // value

}

interface DataValue {
    [key: string]: any
}
export class SocketDriver {

    private webSocket: WebSocket;
    private incomingDataSubject: Subject<DataPacket>;

    // Data not sent due to error
    private unsentData: string[] = [];

    private static formatDataPacket(command: string, dataValue: any): string {
        const dataPacket: DataPacket = {'c': command, 'v': dataValue};
        return JSON.stringify(dataPacket);
    }

    constructor(url: string, protocols: string | string[] | undefined ) {
        if (protocols === undefined) {
            this.webSocket = new WebSocket(url);
        } else {
            this.webSocket = new WebSocket(url, protocols);
        }
        this.incomingDataSubject = new Subject<DataPacket>();
        this.listeners();
    }

    public getWebSocket() {
        return this.webSocket;
    }

    private listeners() {
        this.webSocket.onmessage = (event) => {
            console.log({'onMessage': event});
            this.incomingDataSubject.next(event.data);
        };

        this.webSocket.onopen = (event) => {
            console.log({'onopen': event});
        };

        this.webSocket.onclose = (event) => {
            console.log({'onclose': event});
        };
        this.webSocket.onerror = (event) => {
            console.log({'onError': event});
        };
    }

    private sendMessage(command: string, dataValue: any) {
        try {
            this.webSocket.send(SocketDriver.formatDataPacket(command, dataValue))
        } catch (e) {
            this.unsentData.push(SocketDriver.formatDataPacket(command, dataValue))
        }
    }



}