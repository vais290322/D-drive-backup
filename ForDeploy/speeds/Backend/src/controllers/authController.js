import AuthUser from "../models/authUser.js";
import Payhistory from "../models/payhistory.js";
import { signToken } from "../utils/jwt.js";
import { v4 as uuidv4 } from "uuid";
import {
  sendResetPasswordHtmlEmail,
  sendPasswordResetConfirmationEmail,
} from "../service/emailService.js";

export async function registerUser(req, res) {
  try {
    const { fullName, email, phoneNumber, password, role ,buyerId=null } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    const existing = await AuthUser.findOne({ email });
    if (existing)
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    const user = await AuthUser.create({
      fullName,
      email,
      phoneNumber,
      password,
      role,
      referralCode: uuidv4().split("-")[0],
      buyerId
    });
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
}
export async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { fullName, phoneNumber } = req.body;

    // Validate user exists
    const user = await AuthUser.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Update allowed fields
    if (fullName) user.fullName = fullName;
    if (phoneNumber) user.phoneNumber = phoneNumber;

    await user.save();

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
}

export async function getAllUsers(req, res) {
  const users = await AuthUser.find({ role: "USER" });
  res.status(200).json({
    success: true,
    message: "Users fetched successfully",
    data: users,
  });
}
export async function getAllstaffs(req, res) {
  const users = await AuthUser.find({ role: "STAFF" });
  res.status(200).json({
    success: true,
    message: "staff fetched successfully",
    data: users,
  });
}

export async function updateRole(req, res) {
  const { id } = req.params;
  const { role } = req.query;
  if (!role)
    return res
      .status(400)
      .json({ success: false, message: "Role is required" });
  const user = await AuthUser.findByIdAndUpdate(id, { role }, { new: true });
  if (!user)
    return res.status(404).json({ success: false, message: "User not found" });
  const { password: _, ...safe } = user;
  res.status(200).json({
    success: true,
    message: "User role updated successfully",
    data: safe,
  });
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await AuthUser.findOne({ email });
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    const ok = await user.comparePassword(password);
    if (!ok)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });

    const token = signToken(
      { id: user.id, email: user.email, role: user.role },
      "1d"
    );

    res.cookie("_auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: { email: user.email, token, role: user.role, id: user.id },
    });
  } catch (e) {
    res
      .status(500)
      .json({ success: false, message: "Something went wrong during login" });
  }
}

export async function forgotPassword(req, res) {
  const { email } = req.body || {};
  if (!email)
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  const user = await AuthUser.findOne({ email });
  if (!user)
    return res.status(200).json({
      success: true,
      message:
        "If your email is registered, password reset instructions will be sent.",
    });

  const resetToken = globalThis.crypto?.randomUUID?.()
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
  const expiry = new Date(Date.now() + 60 * 60 * 1000);
  user.resetToken = resetToken;
  user.resetTokenExpiry = expiry;
  await user.save();

  const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
  await sendResetPasswordHtmlEmail(user.email, "ADMIN", resetLink);

  res.status(200).json({
    success: true,
    message:
      "If your email is registered, password reset instructions will be sent.",
  });
}

export async function resetPassword(req, res) {
  const { token } = req.query;
  const { newPassword, confirmPassword } = req.body || {};
  if (!newPassword || !confirmPassword)
    return res.status(400).json({
      success: false,
      message: "New password and confirm password are required.",
    });
  if (newPassword.length < 6)
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters long.",
    });
  if (newPassword !== confirmPassword)
    return res.status(400).json({
      success: false,
      message: "New password and confirm password do not match.",
    });

  const user = await AuthUser.findOne({ resetToken: token });
  if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
    return res
      .status(400)
      .json({ success: false, message: "Reset token has expired." });
  }

  user.password = newPassword;
  user.resetToken = null;
  user.resetTokenExpiry = null;
  await user.save();

  await sendPasswordResetConfirmationEmail(user.email, user.fullName);

  res
    .status(200)
    .json({ success: true, message: "Password changed successfully." });
}

export async function logout(req, res) {
  res.cookie("_auth_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    path: "/",
    maxAge: 0,
  });
  res.status(200).json({ success: true, message: "Logged out successfully!" });
}

export async function me(req, res) {
  const { id } = req.params;
  const user = await AuthUser.findOne({ _id: id }).select(
    "-password -paymentId"
  );
  res.status(200).json({
    success: true,
    message: "User data retrieved successfully.",
    data: user,
  });
}

export async function updateWallet(req, res) {
  const { id } = req.params;
  const { amount } = req.body;
  if (typeof amount !== "number")
    return res
      .status(400)
      .json({ success: false, message: "Amount must be a number" });
  const user = await AuthUser.findById(id);
  if (!user)
    return res.status(404).json({ success: false, message: "User not found" });
  user.walletBalance += amount;
  await user.save();
  res.status(200).json({
    success: true,
    message: "Wallet updated successfully",
    data: { walletBalance: user.walletBalance },
  });
}

export async function userverify(req, res) {
  try {
    const { id } = req.params;
    const { isVerified } = req.body;
    // Validate user exists
    const user = await AuthUser.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    // Update allowed fields
    user.isVerified = isVerified;

    await user.save();
    res.status(200).json({
      success: true,
      message: "User Verified successfully",
      data: user,
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
}

export async function alldeliveryboy(req, res) {
  try {
    // Validate user exists
    const user = await AuthUser.find({ role: "DELIVERY" });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({
      success: true,
      message: "User Verified successfully",
      data: user,
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
}

export async function deleteUser(req, res) {
  const { id } = req.params;
  const user = await AuthUser.findByIdAndDelete(id);
  if (!user)
    return res.status(404).json({ success: false, message: "User not found" });
  res.status(200).json({ success: true, message: "User deleted successfully" });
}
