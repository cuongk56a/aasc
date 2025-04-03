const dotenv = require('dotenv');
const path = require('path');

dotenv.config({path: path.join(__dirname, '../../.env')});

const appConfigs = {
  PORT: process.env.PORT,
  CLIENT_ID: process.env.BITRIX_CLIENT_ID,
  CLIENT_SECRET: process.env.BITRIX_CLIENT_SECRET,
  BITRIX_DOMAIN: process.env.BITRIX_DOMAIN,
  REDIRECT_URI: process.env.BITRIX_REDIRECT_URI,
  WEBHOOK_URL: process.env.BITRIX_WEBHOOK_URL
}

module.exports = { appConfigs };