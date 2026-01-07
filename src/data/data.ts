// ============================================
// ShowME App - Data Exports
// ============================================

export * from './theaters';
export * from './actors';
export * from './shows';
export * from './user';

import theaters from './theaters';
import actors from './actors';
import shows from './shows';
import userData from './user';

export const dummyData = {
  theaters,
  actors,
  shows,
  ...userData,
};

export default dummyData;
