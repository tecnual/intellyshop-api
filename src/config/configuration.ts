export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  versionPrefix: process.env.WS_VERSION_PREFIX,
  corsOrigin: process.env.WS_CORS_ORIGIN,
  database: {
    host: process.env.WS_DB_HOST,
    port: parseInt(process.env.WS_DB_PORT, 10),
    schema: process.env.WS_DB_SCHEMA,
    dbName: process.env.WS_DB_NAME,
    options: process.env.WS_DB_OPTIONS,
    user: process.env.WS_DB_USER,
    password: process.env.WS_DB_PASSWORD
  },
  mailer: {
    host: process.env.WS_MAIL_HOST,
    user: process.env.WS_MAIL_USER,
    pass: process.env.WS_MAIL_PASS
  }
});
