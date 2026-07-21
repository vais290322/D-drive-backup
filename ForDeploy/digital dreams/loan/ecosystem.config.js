module.exports = {
  apps: [
    {
      name: 'digital-loan-dev',
      script: 'npm',
      args: 'run dev -- --host 0.0.0.0 --port 9856',
      env: {
        VITE_HMR_HOST: 'YOUR.SERVER.IP.OR.DOMAIN',
        PORT: 9856
      },
      // If you want pm2 to keep the process foreground (useful for dev),
      // set exec_mode: 'fork' and instances: 1
      exec_mode: 'fork',
      instances: 1
    }
  ]
};