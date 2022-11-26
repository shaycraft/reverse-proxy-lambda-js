import {ResponseStream, ResponseStreamType} from './response-stream.js';
import * as fs from 'fs';

function main() {
    const path = './assets/der.jpg';
    const obj = new ResponseStream(ResponseStreamType.BINARY);

    new Uint8Array([0x42, 0x33]);

    /**
     *
     * @type {Buffer}
     */
    const data = fs.readFileSync(path);
    const expectedBase64 = data.toString('base64');

    const buff1 = data.slice(0, Math.floor(data.length / 2));
    const buff2 = data.slice(data.length - buff1.length);


    obj.push(buff1.toString());
    obj.push(buff2.toString());

    const res = obj.dump();
    console.debug(expectedBase64);
    // console.debug(res);
}

main();
