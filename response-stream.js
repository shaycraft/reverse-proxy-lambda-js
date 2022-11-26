export class ResponseStreamType {
    static PLAINTEXT = 'PLAINTEXT';
    static BINARY = 'BINARY';
}

export class ResponseStream {
    /***
     * @type { any[] }
     */
    buffer;

    /**
     * @type {string}
     */
    streamType;

    /***
     *
     * @param streamType {string}
     * @constructor
     */
    constructor(streamType) {
        this.streamType = streamType;
        this.buffer = [];
        if (streamType === ResponseStreamType.BINARY) {
            console.debug('issa binary');
        } else {
            console.debug('issa text');
        }
    }

    /***
     *
     * @param val {any}
     */
    push(val) {
        this.buffer.push(val);
    }

    dump() {
        if (this.streamType === ResponseStreamType.BINARY) {
            return Buffer.concat(this.buffer.map(item => Buffer.from(item))).toString('base64')
        } else {
            return this.buffer.join('');
        }
    }
}
