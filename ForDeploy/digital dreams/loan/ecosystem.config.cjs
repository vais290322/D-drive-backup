module.exports = {
  apps: [
    {
      name: 'digital_dreeemLoan',
      // Run the Vite CLI using Node directly to avoid permission issues
      // with the shell-executable in node_modules/.bin
      script: 'node',
      args: './node_modules/vite/bin/vite.js --host 0.0.0.0 --port 9856',
      env: {
        // Public host to use for HMR and network display (change to your domain)
        VITE_HMR_HOST: 'collage.vaisacademy.com',
        // Optional: override host used by Vite when printing/serving (if supported)
        VITE_HOST: 'collage.vaisacademy.com',
        // Allowed hosts for Vite to accept requests
        VITE_ALLOWED_HOSTS: 'collage.vaisacademy.com,localhost,127.0.0.1',
        PORT: 9856,
      },
      // keep in fork mode with a single instance for dev
      exec_mode: 'fork',
      instances: 1,
    },
  ],
};
