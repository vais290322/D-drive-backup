import { Auth } from "../Models/auth.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

// Signup controller
export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // console.log("all details : " , req.body);
    // Check if user already exists
    const existingUser = await Auth.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email or username",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user (role will default to 'user' as defined in the model)
    const user = await Auth.create({
      username,
      email,
      password: hashedPassword,
    });

    // Remove password from response
    user.password = undefined;

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error in signup",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Check if email or password is empty
    if ([email, password].some((field) => field?.trim() === "")) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }

    // ✅ Check if the user exists
    const user = await Auth.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ Check password
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // ✅ Create JWT Token
    const tokenData = {
      _id: user._id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // ✅ Cookie options
    const tokenOptions = {
      sameSite: "None",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // ✅ Fix for localhost issue
    };

    // ✅ Remove password from user response
    user.password = undefined;

    // ✅ Set cookie and send response
    res.cookie("token", token, tokenOptions).status(200).json({
      success: true,
      message: "Login successful",
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Please check your email and password",
      error: true,
      success: false,
    });
  }
};

export const logout = async (req, res) => {
  try {
    // res.clearCookie("token");
    res.clearCookie("token", {
      sameSite: "None",
      secure: true,
      httpOnly: true,
    });
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error in logout",
      error: error.message,
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
      const { email } = req.body;
      if(email===""){
          return res.status(400).json({
              message:"please enter email",
              success:false,
              error:true
          })
      }

      // console.log(`Received forgot password request for email: ${email}`);

      const user = await Auth.findOne({ email });
      // console.log(user.name);
      if (!user) {
          return res.status(404).json({
              message:"Email not found",
              success:false,
              error:true
          })
      }

      const payload = { _id: user._id };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "10m" });

      const resetLink=`${process.env.FRONTEND_URL}/reset-password/${token}`

      const userName=user.username

      const transporter = nodemailer.createTransport({
          service: "gmail",
          host: "smtp.ethereal.email",
          port: 587,
          secure: false, 
          auth: {
              user: process.env.EMAIL_USERNAME,
              pass: process.env.EMAIL_PASSWORD
          }
      });

      const mailOptions = {
          from:{
              name:"MNS",
              address:process.env.EMAIL_USERNAME
          },
          to: email,
          subject: "Forgot Password",
          html: `
          <p>Hello ${userName},</p>
          <p>You have requested to reset your password. Please click on the link below to reset your password:</p>
          ${resetLink}
          <p>If you did not request a password reset, please ignore this email.</p>
          <p>Thank you,<br>MNS</p>
  `
      };

       transporter.sendMail(mailOptions);

      res.status(200).json(
          {
            status:200,
            data: mailOptions,
            message:"Reset password link sent on your email please check"
          }
      );
  } catch (error) {
      // console.error(`Error in forgotPassword function: `,error);
      res.status(500).json({
        error:error,
        message:"server error"
      })
  }
};

export const resetPassword = async (req, res) => {
  try {
      const { password } = req.body;
      const { token } = req.params;

      // Verify the token
      let payload;
      try {
          payload = jwt.verify(token, process.env.JWT_SECRET);
      } catch (err) {
          return res.status(404).json({
              success: false,
              message: "Invalid or expired token",
          });
      }

      // Find the user by ID
      const user = await Auth.findById(payload._id);
      if (!user) {
          return res.status(404).json({
              success: false,
              message: "User not found",
          });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // Save updated user
      await user.save();

      res.status(200).json({
          success: true,
          message: "Password updated successfully!",
      });
  } catch (error) {
      res.status(500).json({
          success: false,
          message: "Password not updated",
          error: error.message,
      });
  }
};


export const changeRole = async (req, res) => {
  try {
    const { userId, newRole } = req.body;

    // Check if user exists
    const user = await Auth.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Validate role
    const validRoles = ["admin", "user", "crm", "hrm", "billing", "operation"];
    if (!validRoles.includes(newRole)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    // Update role
    user.role = newRole;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Role updated successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error changing role",
      error: error.message,
    });
  }
};

// Get current user controller
export const getCurrentUser = async (req, res) => {
  try {
    const user = await Auth.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching user",
      error: error.message,
    });
  }
};
export const getAllUser = async (req, res) => {
  try {
    const users = await Auth.find().select("-password"); // ✅ Fixed query

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found",
      });
    }

    return res.status(200).json({
      success: true,
      users, // ✅ Fixed variable name
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
};


