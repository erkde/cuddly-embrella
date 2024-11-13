import csv from 'csv-parser';
import fs from 'fs';
import { pipeline } from 'stream';

import { NemTransform } from '../nem12/transform';
import { NemWritable } from '../prisma/writable';

(async function (inputFile: string) {
  const readableStream = fs.createReadStream(inputFile);

  const csvTransform = csv({ headers: false });
  const nemTransform = new NemTransform({ objectMode: true });
  const writableStream = new NemWritable({ objectMode: true });

  pipeline(
    readableStream,    
    csvTransform,
    nemTransform,
    writableStream,
    (error) => {
      if (error) {
        console.error('Pipeline failed with:', error);
      }      
    }
  );
})(process.argv[2]);
