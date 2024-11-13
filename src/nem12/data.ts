import dayjs from 'dayjs';

export const detailData = (chunk: Array<string | number>) => {
  return {
    nmi: String(chunk[1]),
    interval: Number(chunk[8])
  };
};

export const intervalData = (chunk: Array<string | number>, interval: number) => {
  const result: Array<{ timestamp: string, consumption: number }> = [];

  const date = dayjs(chunk[1]).startOf('day');
  const measurements = 24 * 60 / interval;

  for (let i = 0; i < measurements; i++) {
    const consumption = Number(chunk[i + 2]);
    const timestamp = date.add((i + 1) * interval, 'minutes').format('YYYYMMDD HH:mm:ss');

    result.push({ timestamp, consumption });
  }

  return result;
}
