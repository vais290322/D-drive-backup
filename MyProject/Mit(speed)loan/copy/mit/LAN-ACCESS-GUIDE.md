# LAN Access Configuration

## Your Network Information
- **Your Computer's IP**: `192.168.1.7`
- **Frontend URL (LAN)**: `http://192.168.1.7:5173`
- **Backend URL (LAN)**: `http://192.168.1.7:4000`

## How to Enable LAN Access

### Step 1: Configure Windows Firewall
You need to allow incoming connections on ports 5173 and 4000:

1. Open **Windows Defender Firewall with Advanced Security**
2. Click **Inbound Rules** → **New Rule**
3. Select **Port** → Click Next
4. Select **TCP** and enter port `5173` → Click Next
5. Select **Allow the connection** → Click Next
6. Check all profiles (Domain, Private, Public) → Click Next
7. Name it "Vite Dev Server" → Click Finish
8. **Repeat steps 2-7 for port `4000`** (name it "Node Backend Server")

### Step 2: Update Frontend Environment (Optional)
If you want the frontend to use the LAN IP by default:

1. Open `mit-frontend/.env`
2. Change:
   ```
   VITE_API_BASE_URL=http://localhost:4000/api
   ```
   To:
   ```
   VITE_API_BASE_URL=http://192.168.1.7:4000/api
   ```
3. Restart the frontend server (`npm run dev`)

### Step 3: Access from Other Devices

1. Make sure both frontend and backend servers are running
2. Ensure other devices are on the **same WiFi network**
3. On the other device, open a browser and go to:
   ```
   http://192.168.1.7:5173
   ```

## Quick Commands

### Get Your Current IP Address
```bash
node get-ip.js
```

### Start Both Servers
```bash
# Terminal 1 - Backend
cd mit-backend
npm start

# Terminal 2 - Frontend  
cd mit-frontend
npm run dev
```

## Troubleshooting

### Can't Access from Other Device?
1. ✅ Check both devices are on the same WiFi
2. ✅ Verify firewall rules are added
3. ✅ Confirm both servers are running
4. ✅ Try pinging your computer: `ping 192.168.1.7`
5. ✅ Temporarily disable Windows Firewall to test

### IP Address Changed?
Your IP might change if you reconnect to WiFi. Run `node get-ip.js` to get the new IP and update the `.env` file if needed.
