import { Writable } from 'stream';

import { prismaClient } from './client';

export class NemWritable extends Writable {
  _write: Writable['_write'] = async (chunk, _encoding, callback) => {
    try {
      await prismaClient.meterReading.createMany({ data: chunk });  
    } catch (err) {
      callback(err)
      return;
    }

    callback();
  }
}
