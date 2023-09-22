export const config = {
  port: process.env.PORT || 5000,
  domain: '',
  mailgunApiKey: '',
  jwtSecret: process.env.JWT_SECRET,
  mongodbUrl: process.env.MONGO_URI || 'mongodb://localhost:27017/flowell',
};
