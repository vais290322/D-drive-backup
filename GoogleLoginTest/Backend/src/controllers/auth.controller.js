import { OAuth2Client } from "google-auth-library";
import axios from "axios";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/auth.model.js";
import validator from "validator";
import parsePhoneNumber  from 'libphonenumber-js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper: generate JWT and set httpOnly cookie
const generateTokenAndSetCookie = (res, user) => {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};

// ─── Register ─────────────────────────────────────────────────────────────────
const register = asyncHandler(async (req, res) => {

  const { username, email, password, mobileNumber } = req.body;

  if (!username || !email || !password) {
    throw new ApiError(400, "Username, email, and password are required");
  }

  if (!validator.isEmail(email)) {
    throw new ApiError(400, "Please enter a valid email😡");
  }

  if (!validator.isStrongPassword(password, {
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })) {
    throw new ApiError(400, "Password is not strong");
  }
  if (mobileNumber) {
    const phoneInput = String(mobileNumber);
    const phoneNumber = parsePhoneNumber(phoneInput, 'IN');
    if (!phoneNumber || !phoneNumber.isValid()) {
      throw new ApiError(400, "Please enter a valid Indian phone number");
    }
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  const user = await User.create({
    username,
    email,
    password,
    mobileNumber,
    authProvider: "local",
  });

  generateTokenAndSetCookie(res, user);

  return res
    .status(201)
    .json(new ApiResponse(201, user, "User registered successfully"));


});

// ─── Login ────────────────────────────────────────────────────────────────────
const login = asyncHandler(async (req, res) => {

  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required😡");
  }

  if (!validator.isEmail(email)) {
    throw new ApiError(400, "Please enter a valid email😡");
  }

  const normalizedEmail = email.toLowerCase().trim();

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (user.authProvider === "google") {
    throw new ApiError(
      400,
      "This account uses Google login. Please sign in with Google.😅"
    );
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid email or password 🤦‍♂️🤦‍♀️");
  }

  generateTokenAndSetCookie(res, user);

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Logged in successfully"));

});

// ─── Google Login ─────────────────────────────────────────────────────────────
const googleLogin = asyncHandler(async (req, res) => {

  const { credential } = req.body;

  if (!credential) {
    throw new ApiError(400, "Google credential token is required");
  }

  // Verify the Google ID token server-side
  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch (err) {
    throw new ApiError(401, "Invalid Google token");
  }

  const { sub: googleId, email, name, picture } = payload;
  console.log("google payload : ", payload)

  // Upsert user: find by googleId or email, then update/create
  let user = await User.findOne({ $or: [{ googleId }, { email }] });

  if (user) {
    // Update Google-specific fields if missing
    if (!user.googleId) user.googleId = googleId;
    if (!user.avatar) user.avatar = picture;
    if (user.authProvider === "local") user.authProvider = "google";
    await user.save();
  } else {
    // Create new Google user
    user = await User.create({
      username: name,
      email,
      googleId,
      avatar: picture,
      authProvider: "google",
    });
  }

  generateTokenAndSetCookie(res, user);

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Logged in with Google successfully"));

});

// ─── GitHub Login ─────────────────────────────────────────────────────────────
const githubLogin = asyncHandler(async (req, res) => {
  const { code } = req.body;

  if (!code) {
    throw new ApiError(400, "GitHub code is required");
  }

  // 1. Exchange code for access token
  let tokenResponse;
  try {
    tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
  } catch (error) {
    throw new ApiError(401, "Failed to get GitHub access token");
  }

  const githubToken = tokenResponse.data.access_token;
  if (!githubToken) {
    throw new ApiError(401, "Invalid GitHub code");
  }

  // 2. Get user profile
  let userResponse;
  let emailResponse;
  try {
    userResponse = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${githubToken}`,
      },
    });

    emailResponse = await axios.get("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${githubToken}`,
      },
    });
  } catch (error) {
    throw new ApiError(401, "Failed to fetch GitHub user");
  }

  const profile = userResponse.data;
  const emails = emailResponse.data;

  const primaryEmail = emails.find((e) => e.primary)?.email || emails[0]?.email;
  if (!primaryEmail) {
    throw new ApiError(400, "GitHub account must have an email");
  }

  const githubId = String(profile.id);
  const name = profile.name || profile.login;
  const picture = profile.avatar_url;

  let user = await User.findOne({ $or: [{ githubId }, { email: primaryEmail }] });

  if (user) {
    if (!user.githubId) user.githubId = githubId;
    if (!user.avatar) user.avatar = picture;
    if (user.authProvider === "local") user.authProvider = "github";
    await user.save();
  } else {
    user = await User.create({
      username: name,
      email: primaryEmail,
      githubId,
      avatar: picture,
      authProvider: "github",
    });
  }

  generateTokenAndSetCookie(res, user);

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Logged in with GitHub successfully"));
});

// ─── Logout ───────────────────────────────────────────────────────────────────
const logout = asyncHandler(async (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Logged out successfully"));
});

// ─── Get Current User ─────────────────────────────────────────────────────────
const getMe = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully"));
});



export { register, login, googleLogin, githubLogin, logout, getMe };
