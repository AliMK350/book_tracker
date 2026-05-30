const dotenv = require('dotenv');
const appJson = require('./app.json');

dotenv.config();

module.exports = {
  ...appJson,
  expo: {
    ...appJson.expo,
    extra: {
      EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
      EXPO_PUBLIC_GOOGLE_BOOKS_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_BOOKS_API_KEY || '',
    },
  },
};
