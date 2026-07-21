# Google Login Integration

Add full Google OAuth 2.0 login support to the existing Express + MongoDB backend and React/Vite frontend. This includes both regular email/password auth and Google One-Tap/OAuth login. The backend verifies the Google ID token server-side using `google-auth-library`, stores the user in MongoDB, and issues a JWT cookie. The frontend uses `@react-oauth/google` for the OAuth popup/redirect flow.

## Proposed Changes

### Backend

---

#### [MODIFY] [.env](file:///c:/D%20drive/GoogleLoginTest/Backend/.env)
- Add `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- Fix `CORS_ORIGIN` to point to `http://localhost:5173` (frontend port)
- Fix typo: existing key is `CROS_ORIGIN` in [app.js](file:///c:/D%20drive/GoogleLoginTest/Backend/app.js) — align both

#### [MODIFY] [app.js](file:///c:/D%20drive/GoogleLoginTest/Backend/app.js)
- Fix `Credential: true` → `credentials: true` in CORS config
- Fix env var name: `CROS_ORIGIN` → `CORS_ORIGIN`
- Import and register the auth router at `/api/v1/auth`

#### [MODIFY] [auth.model.js](file:///c:/D%20drive/GoogleLoginTest/Backend/src/models/auth.model.js)
- Define `User` Mongoose schema with fields: `username`, `email`, `password` (optional for Google users), `mobileNumber`, `googleId`, `avatar`, `authProvider` (`local` | `google`)
- Add `pre-save` bcrypt password hashing
- Add `comparePassword` method

#### [MODIFY] [auth.controller.js](file:///c:/D%20drive/GoogleLoginTest/Backend/src/controllers/auth.controller.js)
- `register`: create user with email+password, return JWT
- `login`: verify credentials, return JWT in httpOnly cookie
- `googleLogin`: accept Google `credential` token, verify with `google-auth-library`, upsert user, return JWT
- `logout`: clear cookie
- `getMe`: return current user profile (protected)

#### [MODIFY] [auth.middleware.js](file:///c:/D%20drive/GoogleLoginTest/Backend/src/middlewares/auth.middleware.js)
- Verify JWT from cookie or `Authorization` header
- Attach `req.user` if valid

#### [MODIFY] [auth.route.js](file:///c:/D%20drive/GoogleLoginTest/Backend/src/routes/auth.route.js)
- `POST /register`
- `POST /login`
- `POST /google-login`
- `POST /logout`
- `GET /me` (protected)

---

### Frontend

---

#### [NEW] [.env](file:///c:/D%20drive/GoogleLoginTest/Frontend/.env)
- `VITE_BACKEND_URL=http://localhost:5000`
- `VITE_GOOGLE_CLIENT_ID=736650183623-d9f4koo4jqnpllvh66vsiik5u36mu4d9.apps.googleusercontent.com`

#### [NEW] [AuthContext.jsx](file:///c:/D%20drive/GoogleLoginTest/Frontend/src/context/AuthContext.jsx)
- `AuthProvider` context with `user`, `login`, `logout`, `googleLogin` helpers
- Stores JWT/user in state; exposes `isAuthenticated`

#### [MODIFY] [main.jsx](file:///c:/D%20drive/GoogleLoginTest/Frontend/src/main.jsx)
- Wrap app with `GoogleOAuthProvider` (using `VITE_GOOGLE_CLIENT_ID`)
- Wrap app with `AuthProvider`

#### [MODIFY] [LoginPage.jsx](file:///c:/D%20drive/GoogleLoginTest/Frontend/src/pages/auth/LoginPage.jsx)
- Connect login form [handleSubmit](file:///c:/D%20drive/GoogleLoginTest/Frontend/src/pages/auth/SignupPage.jsx#106-134) to `POST /api/v1/auth/login`
- Replace placeholder Google button with `GoogleLogin` component from `@react-oauth/google`
- On success redirect to `/home`

#### [MODIFY] [SignupPage.jsx](file:///c:/D%20drive/GoogleLoginTest/Frontend/src/pages/auth/SignupPage.jsx)
- Connect signup form [handleSubmit](file:///c:/D%20drive/GoogleLoginTest/Frontend/src/pages/auth/SignupPage.jsx#106-134) to `POST /api/v1/auth/register`
- Replace placeholder Google button with `GoogleLogin` component
- On success redirect to `/home`

#### [NEW] [HomePage.jsx](file:///c:/D%20drive/GoogleLoginTest/Frontend/src/pages/HomePage.jsx)
- Welcome page shown after login with user info and logout button
- Accessible at `/home` (matches the Google OAuth redirect URI)

#### [MODIFY] [Route.jsx](file:///c:/D%20drive/GoogleLoginTest/Frontend/src/route/Route.jsx)
- Add `/home` route pointing to `HomePage`

---

## Verification Plan

### Automated Tests
No existing test suite was found in either project. No tests will be fabricated.

### Manual Verification

**Step 1 – Backend**
1. Open terminal in `c:\D drive\GoogleLoginTest\Backend`
2. Run `npm run dev`
3. Confirm: `server is running at port : 5000` and `MongoDb connected !` appear in the console

**Step 2 – Frontend**
1. Open terminal in `c:\D drive\GoogleLoginTest\Frontend`
2. Run `npm run dev`
3. Open browser at `http://localhost:5173/login`

**Step 3 – Email/Password Registration**
1. Navigate to `http://localhost:5173/signup`
2. Fill in all fields and submit → should redirect to `/home`

**Step 4 – Email/Password Login**
1. Navigate to `http://localhost:5173/login`
2. Enter the credentials from Step 3 and submit → should redirect to `/home`

**Step 5 – Google Login**
1. On the login page, click the Google login button
2. Complete Google account selection in the popup
3. Should be redirected to `http://localhost:5173/home` and see user info
