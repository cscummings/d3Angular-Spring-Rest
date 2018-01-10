import { DataService } from './data.service';
import { IData } from './data.interface';
import { BData} from './data.interface';

describe('DataService', () => {
    let service: DataService;

    beforeEach(() => {
        service = new DataService();
    });

    it('works', () => {
        expect(1).toEqual(2);
    });


    it('add service data', () => {
        const testData  = <IData> {
          CASES: 24,
          QUEUE_NM: 'Some queue name'
        };

        expect(service.addData(testData)).toBeNull() ;
  });

  it('add service Bdata', () => {
    const testBData = <BData>       {
      date: '1/6/2018' ,
      RecordInBatch: 12
    };

  expect(service.addBData(testBData)).toBeNull() ;
});

});

