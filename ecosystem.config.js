module.exports = {
  apps : [{
    name: 'web-server',
    script: 'yarn start-webserver',
    exp_backoff_restart_delay: 250,
    out_file: 'logs/webserver.log',
    error_file: 'logs/webserver-errors.log',
    time: true,
    env: {
      NODE_ENV: 'development',
      TICK_RATE: 30000,
      SERVER_PORT: 3000,
    },
    env_production: {
      NODE_ENV: 'production',
      DB_USER: '',
      DB_PASSWORD: '',
      DB_HOST: 'localhost',
      DB_DATABASE: '',
      DB_PORT: 5432,
      SERVER_PORT: 3000,
    }
  }, 
  {
    name: 'service-runner',
    script: 'yarn start-service-runner',
    exp_backoff_restart_delay: 5000,
    out_file: 'logs/service-runner.log',
    error_file: 'logs/service-runner-errors.log',
    time: true,
    env: {
      NODE_ENV: 'development',
      RETRO_API_ONLINE: 'https://play.retro-mmo.com/players.json',
      RETRO_API_PLAYERS: 'https://play.retro-mmo.com/users/',
      RETRO_API_LEADERBOARDS: 'https://play.retro-mmo.com/leaderboards.json',
      TICK_RATE: 30000,
      SERVER_PORT: 3000,
    },
    env_production: {
      NODE_ENV: 'production',
      DB_USER: '',
      DB_PASSWORD: '',
      DB_HOST: 'localhost',
      DB_DATABASE: '',
      DB_PORT: 5432,
      SERVER_PORT: 3000,
    }
  }],
};
