const Register = require("../models/register.models.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const OTP = require("../models/otpto.models.js");
const dotenv = require("dotenv");
const { default: axios } = require("axios");
dotenv.config({ quiet: true });

// REGISTER
exports.registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      // address,
      // city,
      // state,
      // postalCode,
      phone,
      // street,
      dateOfBirth,
      anniversaryDate,
      // district,
      // landmark,
      gender,
    } = req.body;
    if (
      !name ||
      !email ||
      !password ||
      !phone 
    )
      return res.status(400).json({ message: "All fields are required" });

    const existingUser = await Register.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const existingAdmin = await Register.findOne({ phone});
    if (existingAdmin)
      return res.status(400).json({ message: "Phone already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new Register({
      name,
      email,
      password: hashedPassword,
      // address,
      // city,
      // state,
      // postalCode,
      // street,
      // district,
      // landmark,
      phone: phone ? String(phone) : "",
      dateOfBirth,
      anniversaryDate,
      gender,
      isAdmin: false,
    });
    await user.save();

    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.registerAdmin = async (req, res) => {
  try {
    const {
      name,
      email=`${new Date().getTime()}email@gamil.com`,
      password,
      address,
      city,
      state,
      postalCode,
      phone,
      street,
      dateOfBirth,
      anniversaryDate,
      district,
      landmark,
      gender,
    } = req.body;

    // const existingUser = await Register.findOne({ email });
    // if (existingUser )
    //   return res.status(400).json({ message: "Email already registered" });

    
    const existingAdmin = await Register.findOne({ phone});
    if (existingAdmin)
      return res.status(400).json({ message: "Phone already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new Register({
      name,
      email,
      password: hashedPassword,
      address,
      city,
      state,
      postalCode: postalCode ? String(postalCode) : "",
      phone: phone ? String(phone) : "",
      street,
      dateOfBirth,
      anniversaryDate,
      district,
      landmark,
      gender,
      isAdmin: true,
    });
    await user.save();

    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};





exports.getAdminCustomer = async (req, res) => {
  try {
    // Get query params for pagination and search
    let { page = 1, limit = 5, search = "" } = req.query;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    // Build search query for users only
    const query = {
      role: "user",
      isAdmin: true,
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ],
    };

    const total = await Register.countDocuments(query);
    const customer = await Register.find(query)
      .sort({ createdAt: -1 })
      .select("-password -role")
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      message: "Customer fetched successfully",
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit: limit,
      },
      data: customer,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCustomer = async (req, res) => {
  try {
    // Get query params for pagination and search
    let { page = 1, limit = 5, search = "" } = req.query;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    // Build search query for users only
    const query = {
      role: "user",
      isAdmin: false,
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ],
    };

    const total = await Register.countDocuments(query);
    const customer = await Register.find(query)
      .sort({ createdAt: -1 })
      .select("-password -role")
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      message: "Customer fetched successfully",
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit: limit,
      },
      data: customer,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getallCustomer = async (req, res) => {
  try {
    // Get query params for pagination and search
    let {search = "" } = req.query;
    // page = parseInt(page, 10);
    // limit = parseInt(limit, 10);

    // Build search query for users only
    const query = {
      role: "user",
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ],
    };

    // const total = await Register.countDocuments(query);
    const customer = await Register.find(query)
      .sort({ createdAt: -1 })
      .select("-password -role")
      // .skip((page - 1) * limit)
      // .limit(limit);

    res.status(200).json({
      message: "Customer fetched successfully",
      // pagination: {
      //   totalItems: total,
      //   totalPages: Math.ceil(total / limit),
      //   currentPage: page,
      //   limit: limit,
      // },
      data: customer,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAdminCustomer = async (req, res) => {
  try {
    // Get query params for pagination and search
    let { page = 1, limit = 5, search = "" } = req.query;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    // Build search query for users only
    const query = {
      role: "user",
      isAdmin: true,
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ],
    };

    const total = await Register.countDocuments(query);
    const customer = await Register.find(query)
      .sort({ createdAt: -1 })
      .select("-password -role")
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      message: "Customer fetched successfully",
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit: limit,
      },
      data: customer,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const id = req.user.id;
    const customer = await Register.find({ _id: id })
      .sort({ createdAt: -1 })
      .select("-password");
    res
      .status(200)
      .json({ message: "User fetched successfully ", data: customer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




exports.updateUser = async (req, res) => {
  try {
    const id = req.user.id;
    const { name, email, address, city, state, postalCode, phone, street , dateOfBirth, anniversaryDate, landmark, gender ,district } =
      req.body;

    // Validate that at least one field is being updated
    if (
      !name &&
      !email &&
      !address &&
      !city &&
      !state &&
      !postalCode &&
      !phone &&
      !street &&
      !district
    ) {
      return res.status(400).json({ message: "No fields provided for update" });
    }

    // Update user
    const user = await Register.findOneAndUpdate(
      { _id: id },
      { name, email, address, city, state, postalCode, phone, street , dateOfBirth, anniversaryDate, landmark, gender ,district },
      { new: true, runValidators: true } // ensures we get the updated doc and validation runs
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User profile updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.updateAdmin = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email, address, city, state, postalCode, phone, street , dateOfBirth, anniversaryDate, landmark, gender ,district } =
      req.body;


    // Update user
    const user = await Register.findOneAndUpdate(
      { _id: id },
      { name, email, address, city, state, postalCode, phone, street , dateOfBirth, anniversaryDate, landmark, gender ,district },
      { new: true, runValidators: true } // ensures we get the updated doc and validation runs
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User profile updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};





exports.loginUser = async (req, res) => {
  try {
    console.log("email, password", req.body);
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const user = await Register.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Register.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${user._id}}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Support" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <p>Hello ${user.name},</p>
        <p>You requested to reset your password.</p>
        <NavLink to="${resetUrl}" target="_blank">Reset Password</NavLink>
        <p>This link expires in 15 minutes.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.resetPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    // ✅ Validate input
    if (!newPassword || newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    // ✅ Check if user exists
    const user = await Register.findById(id);
    if (!user) {
      return res.status(400).json({ message: "User not found or invalid ID" });
    }

    // ✅ Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // ✅ Update the user’s password
    await Register.findByIdAndUpdate(
      user._id,
      { password: hashedPassword },
      { new: true }
    );

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};


exports.otp = async (req, res) => {
  const { phone } = req.body;
  console.log(phone);
  if (!phone) return res.status(400).json({ message: "Phone number required" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = Date.now() + 5 * 60 * 1000; // 5 mins expiry

  try {
    let user = await Register.findOne({ phone: phone });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Update or create OTP for this phone
    const ValidateData = await OTP({
      phone: phone,
      otp: otp,
      otpExpires: otpExpires,
    });
    await ValidateData.save();

    const valuedata = {
      route: "dlt",
      message:"201813" ,
      sender_id:"GTNSRY",
      variables_values: otp,
      flash: 0,
      numbers: phone.toString(), // Ensure this is a string
    };

    const response = await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      valuedata,
      {
        headers: {
          authorization: process.env.FAST2SMS_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Fast2SMS Response:", response.data);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Green Tree Nursery" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Your OTP Verification Code",
      html: `
            <div style="font-family:Arial,sans-serif;padding:20px;">
              <h2 style="color:#2E8B57;">OTP Verification</h2>
              <p>Dear ${user.name || "User"},</p>
              <p>Your One-Time Password (OTP) for verification is:</p>
              <h3 style="color:#2E8B57;letter-spacing:2px;">${otp}</h3>
              <p>This OTP will expire in <strong>5 minutes</strong>.</p>
              <br/>
              <p style="font-size:12px;color:gray;">If you did not request this, please ignore this email.</p>
            </div>
          `,
    };

    await transporter.sendMail(mailOptions);
    res.status(201).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    // Provide more details from Fast2SMS response if available
    if (err.response && err.response.data) {
      return res
        .status(500)
        .json({ message: "Error sending OTP", details: err.response.data });
    }
    res.status(500).json({ message: "Error sending OTP" });
  }
};

exports.otpverify = async (req, res) => {
  const { otp } = req.body;
  console.log(otp);
  if (!otp) return res.status(400).json({ message: "OTP required" });
  try {
    // Find OTP record for the phone number
    const otpRecord = await OTP.findOne({ otp });
    console.log(otpRecord);

    if (!otpRecord)
      return res
        .status(400)
        .json({ message: "OTP not found for this phone number" });
    if (otpRecord.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });
    if (Date.now() > otpRecord.otpExpires)
      return res.status(400).json({ message: "OTP expired" });

    // Clear OTP after verification
    // await OTP.deleteOne({ _id: otpRecord._id });

    const user = await Register.findOne({ phone: otpRecord.phone });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    await OTP.deleteOne({ _id: otpRecord._id });

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Verification failed" });
  }
};








exports.sendBirthdaySMS = async (phone, name) => {
  try {
    const message = `🎉 Happy Birthday, ${name}! 🎂 Have a wonderful year ahead! – From Team Green Tree Nursery 🌿`;

    // const response = await axios.post(
    //   "https://www.fast2sms.com/dev/bulkV2",
    //   {
    //     route: "v3",
    //     sender_id: "GTNSRY",
    //     message: message,
    //     // variables_values: message,
    //     flash: 0,
    //     numbers: phone,
    //   },
    //   {
    //     headers: {
    //       authorization: process.env.FAST2SMS_API_KEY,
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );


    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    for (const phone of numbers) {
      const user = await Register.findOne({ phone: phone });
      if (user && user.email) {
        await transporter.sendMail({
          from: `"Green Tree Nursery" <${process.env.EMAIL_USER}>`,
          to: user.email,
          subject: "Birthday Wish from Green Tree Nursery",
          html: `<p>${message}</p>`,
        });
        console.log(`✅ Email sent to ${user.email}`);
      }
    }

    console.log(`✅ SMS sent to ${name} (${phone})`);
    return response.data;
  } catch (error) {
    console.error("❌ SMS Error:", error.response?.data || error.message);
  }
};
exports.sendAnniversarySMS = async (phone, name) => {
  try {
    const message = `💐 Happy Marriage Anniversary, ${name}! 🎊 Wishing you many more years of love and happiness – From Team Green Tree 🌿`;

    // const response = await axios.post(
    //   "https://www.fast2sms.com/dev/bulkV2",
    //   {
    //     route: "v3",
    //     sender_id: "TXTIND",
    //     message,
    //     language: "english",
    //     flash: 0,
    //     numbers: phone,
    //   },
    //   {
    //     headers: {
    //       authorization: process.env.FAST2SMS_API_KEY,
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    for (const phone of numbers) {
      const user = await Register.findOne({ phone: phone });
      if (user && user.email) {
        await transporter.sendMail({
          from: `"Green Tree Nursery" <${process.env.EMAIL_USER}>`,
          to: user.email,
          subject: "Anniversary wish from Green Tree Nursery",
          html: `<p>${message}</p>`,
        });
        console.log(`✅ Email sent to ${user.email}`);
      }
    }


    console.log(`✅ Anniversary SMS sent to ${name} (${phone})`);
    return response.data;
  } catch (error) {
    console.error("❌ SMS Error:", error.response?.data || error.message);
  }
};

exports.checkEvents = async (req, res) => {
  try {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;

    const customers = await Register.find();

    const birthdayList = customers.filter((c) => {
      const dob = new Date(c.dateOfBirth);
      return dob.getDate() === day && dob.getMonth() + 1 === month;
    });

    const anniversaryList = customers.filter((c) => {
      if (!c.anniversaryDate) return false;
      const anniv = new Date(c.anniversaryDate);
      return anniv.getDate() === day && anniv.getMonth() + 1 === month;
    });

    // Send birthday SMS
    for (const c of birthdayList) {
      await sendBirthdaySMS(c.phone, c.name);
    }

    // Send anniversary SMS
    for (const c of anniversaryList) {
      await sendAnniversarySMS(c.phone, c.name);
    }

    res.json({
      message: "Event check completed",
      birthdaysSent: birthdayList.length,
      anniversariesSent: anniversaryList.length,
      birthdayNames: birthdayList.map((x) => x.name),
      anniversaryNames: anniversaryList.map((x) => x.name),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.sendBulkSMS = async (numbers, message) => {
  try {
    if (!numbers || numbers.length === 0) {
      throw new Error("No mobile numbers provided");
    }

    // If you want to send SMS, uncomment and use this block:
    // const formattedNumbers = numbers.join(","); // Convert array to comma-separated string
    // const response = await axios.post(
    //   "https://www.fast2sms.com/dev/bulkV2",
    //   {
    //     route: "v3",
    //     sender_id: "TXTIND",
    //     message: message,
    //     language: "english",
    //     flash: 0,
    //     numbers: formattedNumbers,
    //   },
    //   {
    //     headers: {
    //       authorization: process.env.FAST2SMS_API_KEY,
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );

    // Send Email to each recipient (if email found)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    for (const phone of numbers) {
      const user = await Register.findOne({ phone: phone });
      if (user && user.email) {
        await transporter.sendMail({
          from: `"Green Tree Nursery" <${process.env.EMAIL_USER}>`,
          to: user.email,
          subject: "Notification from Green Tree Nursery",
          html: `<p>${message}</p>`,
        });
        console.log(`✅ Email sent to ${user.email}`);
      }
    }

    // Remove or update this line:
    // console.log("✅ SMS sent successfully!", response);
    console.log("✅ Bulk email sent successfully!");
    return { success: true, message: "Bulk email sent successfully!" };
  } catch (error) {
    console.error("❌ Bulk SMS/Email Error:", error.response?.data || error.message);
    throw error;
  }
};

exports.send = async (req, res) => {
  try {
    const { numbers, message } = req.body;

    if (!numbers || !Array.isArray(numbers) || numbers.length === 0) {
      return res.status(400).json({ message: "Numbers array required" });
    }
    if (!message) {
      return res.status(400).json({ message: "Message content required" });
    }

    const result = await exports.sendBulkSMS(numbers, message);
    res.status(200).json({
      message: "sent successfully",
      response: result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error sending bulk SMS/email",
      error: error.response?.data || error.message,
    });
  }
}
