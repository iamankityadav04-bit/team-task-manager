export const registerRules = {
  name: { required: true, min: 2 },
  email: { required: true, email: true },
  password: { required: true, min: 6 },
  role: { enum: ['ADMIN', 'MEMBER'] }
};

export const loginRules = {
  email: { required: true, email: true },
  password: { required: true, min: 6 }
};
