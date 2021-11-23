module.exports = {
  development: {
    dialect: 'postgres',
    use_env_variable: 'DATABASE_URL',
    logging: false,
  },
  test: {
    dialect: 'sqlite',
  },
};
