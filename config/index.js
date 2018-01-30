process.env.NODE_ENV = 'production';
// process.env.NODE_ENV = 'development';

const config = {
  env: process.env.NODE_ENV,
  port: process.env.PORT || 9000,
  jwtSecret: "Pqw*qemn'3qfpvzsldR#EtrerngpQMPOp53eorilxpUTvyejt^BNbxfe?rq}mcovu",
  jwtExpiresIn: 3600 // 86400
};

if (process.env.NODE_ENV === 'production') {
  // console.log('Production Environment');
   config.mongoUri = 'mongodb://localhost/imdb_films';
} else {
  console.log('Development Environment');
  config.mongoUri = 'mongodb://localhost/imdb_films';
}
module.exports = config;
