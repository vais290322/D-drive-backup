# Mit Electro World - Local API (MongoDB)

This folder contains a small Express + Mongoose server to run a proper MongoDB backend locally.

Quick start (local MongoDB):

1. Ensure you have MongoDB running locally on `mongodb://localhost:27017`.
2. Copy `.env.example` to `.env` and adjust values if needed.
3. Install dependencies:

```powershell
Set-Location -LiteralPath .\server
npm install
```

4. Start the server (development):

```powershell
npm run dev
```

The server will listen on `http://localhost:4000` by default.

Endpoints:
- `POST /auth/register` { email, password, full_name }
- `POST /auth/login` { email, password } -> returns `{ token, user }`

Next steps:
- Implement additional models (Customers, Loans) and routes.
- Add middleware to protect API endpoints using JWT.
- Update the frontend to use `VITE_API_BASE_URL` and call these endpoints.
