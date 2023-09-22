export const config = {
  port: process.env.PORT || 5000,
  domain: '',
  mailgunApiKey: '',
  imgBB_Base_Url: process.env.imgBB_BASE_URL,
  imgBB_API_Key: process.env.imgBB_API_Key,
  jwtSecret: process.env.JWT_SECRET,
  mongodbUrl: process.env.MONGO_URI || 'mongodb://localhost:27017/flowell',
};
