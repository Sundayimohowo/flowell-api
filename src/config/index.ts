export const config = {
  PORT: process.env.PORT || 5000,
  mongodbUrl: process.env.MONGODB_URI || 'mongo://localhost:27017/flowell',
};
