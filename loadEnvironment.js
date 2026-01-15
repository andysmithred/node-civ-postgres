const  { configDotenv } = require('dotenv');

configDotenv();

console.log(`Environment variable PORT is set to: ${process.env.PORT}`);
