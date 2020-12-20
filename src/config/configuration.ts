export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  versionPrefix: process.env.WS_VERSION_PREFIX || 'v0',
  corsOrigin: process.env.WS_CORS_ORIGIN || 'https://192.168.1.10:4200',
  database: {
    host: process.env.WS_DB_HOST || 'localhost',
    port: parseInt(process.env.WS_DB_PORT, 10) || 27017,
    schema: process.env.WS_DB_SCHEMA || 'mongodb',
    dbName: process.env.WS_DB_NAME || 'shoptonic',
    options: process.env.WS_DB_OPTIONS || 'retryWrites=true&w=majority',
    user: process.env.WS_DB_USER || 'tecnual',
    password: process.env.WS_DB_PASSWORD || '100'
  }
});
