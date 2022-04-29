import { connectDb, Model } from '@sky-time/shared';
import { NODE_ENV } from './constants';

const databaseGlobal = global as typeof global & {
  model: typeof Model;
  dbConnected: boolean;
};

if (!databaseGlobal.dbConnected) {
  connectDb().then(() => {
    databaseGlobal.dbConnected = true;
  });
}

export { Model };

if (NODE_ENV !== 'production') {
  databaseGlobal.model = Model;
}
