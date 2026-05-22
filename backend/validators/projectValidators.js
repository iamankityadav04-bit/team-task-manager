export const projectRules = {
  title: { required: true, min: 3 },
  description: { required: true },
  status: { enum: ['PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED'] },
  members: { objectIdArray: true }
};
