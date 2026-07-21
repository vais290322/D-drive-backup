# WhatsApp SaaS - Ubuntu Deployment Guide

Follow these steps to deploy your WhatsApp Controller application to a fresh Ubuntu Server.

## Prerequisites
- A server running Ubuntu 20.04 or 22.04.
- Make sure you have SSH access to your server.
- Allowed inbound TCP traffic on port `3000` (or whichever port you choose to run on) in your firewall/security groups.

---

## Step 1: System Update & Dependencies

Connect to your server via SSH and run the following command to update your system's package list:

```bash
sudo apt update && sudo apt upgrade -y
```

Now, install Node.js (version 18 is recommended) and the required system libraries for Puppeteer (Chromium):

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Chromium and required headless browser libraries
sudo apt install -y chromium-browser libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2
```

## Step 2: Transfer Your Code

Upload the `whatsappapi` project folder to your Ubuntu server. You can use SFTP, `scp`, or Git to clone your repository onto the server.

Once the code is on the server, navigate into the project directory:

```bash
cd whatsappapi
```

## Step 3: Install Node Modules

Run the installation command to fetch all the necessary backend dependencies:

```bash
npm install
```

## Step 4: Configure Environment Variables

Create your `.env` file from the example template:

```bash
cp .env.example .env
nano .env
```
Ensure your configuration is correct (e.g., `PORT=80` if you want it to run directly on the standard web port, or `PORT=3000`).

## Step 5: Start the Application with PM2

To ensure the Node.js server stays online 24/7 (even when you close your SSH terminal or the server restarts), use the `pm2` process manager.

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start the application
pm2 start server.js --name "whatsapp-saas"

# Save the PM2 process list so it automatically restarts on server reboots
pm2 save
pm2 startup
```

## Step 6: Access the App

You can now open a web browser on any device and visit your server's IP address:

`http://<YOUR_UBUNTU_SERVER_IP>:3000`

*(If you set `PORT=80` in your `.env` file, and ran PM2 with `sudo`, you can just visit `http://<YOUR_UBUNTU_SERVER_IP>` without the port).*

Log in, connect your WhatsApp, and you're good to go!
