import { afterEach, beforeEach, describe, expect, it, test, vi } from 'vitest'

import { NemTransform } from './transform';

const mockData = {
  detailData: { nmi: 'NEM1201009', interval: 30 },
  intervalData: [{ timestamp: '20050301 00:30:00', consumption: 0 }],
};

vi.mock('./data', () => ({
  detailData: vi.fn(() => mockData.detailData),
  intervalData: vi.fn(() => mockData.intervalData)
}));

describe(NemTransform, () => {
  let callback, transform;

  beforeEach(() => {
    callback = vi.fn();
    transform = new NemTransform({ objectMode: true });
  });

  afterEach(() => {
    vi.restoreAllMocks()
  });
  
  describe('handling 200 records', () => {
    it('should save the detail data', () => {
      transform._transform({ '0': '200' }, null, callback);

      expect(transform.detail).toEqual(mockData.detailData);
    });

    it('should invoke the callback', () => {
      transform._transform({ '0': '200' }, null, callback)

      expect(callback).toHaveBeenCalled();
    });
  });

  describe('handling 300 records', () => {
    describe('without a proceeding 200 record', () => {
      it('should invoke the callback with an error', () => {
        transform._transform({ '0': '300' }, null, callback)

        expect(callback).toHaveBeenCalledWith(
          expect.objectContaining({
            message: 'Unexpected 300 record without proceeding 200', 
            chunk: { 0: '300' }
          })
        );
      });
    });

    describe('with a proceeding 200 record', () => {
      beforeEach(() => {
        transform._transform({ '0': '200' }, null, callback);
      });

      it('should push the reading', () => {
        const pushSpy = vi.spyOn(transform, 'push');
        transform._transform({ '0': '300' }, null, callback)
        expect(pushSpy).toHaveBeenCalledWith(
          mockData.intervalData.map(data => ({ nmi: mockData.detailData.nmi, ...data }))
        );
      });

      it('should invoke the callback', () => {
        transform._transform({ '0': '300' }, null, callback)
        expect(callback).toHaveBeenLastCalledWith();
      });  
    });
  });
});
