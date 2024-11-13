import { Transform } from 'stream';

import { detailData, intervalData } from './data';
import { NemError } from './error';

export class NemTransform extends Transform {
  detail: ReturnType<typeof detailData>;

  _transform: Transform['_transform'] = (chunk, _encoding, callback) => {
    if (chunk[0] == '200') {
      this.detail = detailData(chunk);
    }

    if (chunk[0] == '300') {
      if (!this.detail) {
        callback(new NemError('Unexpected 300 record without proceeding 200', chunk));
        return;
      }

      const readings = intervalData(chunk, this.detail.interval);
      this.push(readings.map(reading => ({ nmi: this.detail.nmi, ...reading })));
    }

    callback();
  }
}
