import { prismaClient } from '../prisma/client';

(async function () {
  await prismaClient.meterReading.deleteMany({});
})();
