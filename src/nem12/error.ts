export class NemError extends Error {
  chunk: Array<string | number>;

  constructor(message: string, chunk: Array<string | number>) {
    super(message);
    this.chunk = chunk;
  }
}
