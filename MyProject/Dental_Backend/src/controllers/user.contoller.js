import {ApiError} from "../utils/apiError.js";
import {ApiResponse} from "../utils/apiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {User} from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";




const register = asyncHandler(async (req, res) => {
  try {
    const { email, password} = req.body;

    // Validate required fields
    if ( !email || !password) {
      throw new ApiError(400, "Please provide all fields");
    }

    // Check if the user already exists
    const userExist = await User.findOne({email});
    if (userExist) {
      throw new ApiError(409, "User already exists");
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Create the user object
    const userObj = {
      email,
      password: hash,
    };

    // Save the user to the database
    const userCreated = await User.create(userObj);
    // console.log(userCreated._id)
    const createdUser = await User.findById(userCreated._id).select(
      "-password"
    );
    if (!userCreated) {
      throw new ApiError(500, "Something went wrong, user not created");
    }

    // Send success response
    res
      .status(201)
      .json(new ApiResponse(201, createdUser, "User created successfully"));
  } catch (error) {
    // Handle any errors
    res
      .status(error.statusCode || 500)
      .json(
        new ApiError(
          error.statusCode || 500,
          error.message || "Internal server error"
        )
      );
  }
});


const login = asyncHandler(async (req, res) => {
  try {
    const {email, password} = req.body;
    if (!email || !password) {
      throw new ApiError(401, "something is missing , please check");
    }

    let user = await User.findOne({email});
    if (!user) {
      throw new ApiError(401, "incorrect email or password");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new ApiError(401, "incorrect password");
    }


    const token =  jwt.sign(
      {
        userId: user._id,
      },
      process.env.SECRET,
      {
        expiresIn: "1d",
      }
    );

    user = {
      _id: user._id,
      email: user.email,
    };
    console.log(token)
    return res
      .cookie("token", token, {
        httpOnly: true,
        secure:true,
        sameSite: 'None',
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json(new ApiResponse(200, user, `Welcome back `));
      
  } catch (error) {
    res.json(
      new ApiError(
        error?.statusCode || 500,
        error?.message || "internal server error in login"
      )
    );
  }
});

const logout = asyncHandler(async (req, res) => {
  try {
    // console.log("logout successfull")
    // console.log("user id  : ",req.id)

    res.clearCookie("token", {
      sameSite: 'None',
      secure: true,
      httpOnly: true,
      maxAge:0
    });

    // return res
    //   .cookie("token", "", {maxAge: 0})
    //   .json(new ApiResponse(200,null, "logged out successfully"));

    return res.json(
      new ApiResponse(200,null, "user logout successfully done")
    )

  } catch (error) {
    res.json(
      new ApiError(
        error?.statusCode || 500,
        error?.message || "internal server error"
      )
    );
  }
});

const forgetPassword = asyncHandler(async(req,res)=>{
  try {
    const {email} = req.body;

    if(!email){
      throw new ApiError(400, "email is required");
    }

    const user = await User.findOne({email});

    if(!user){
      throw new ApiError(400, "user not found");
    }

    const payload = {_id:user._id};

    const token =  jwt.sign(
      payload,
      process.env.SECRET,
      {
        expiresIn: "10m",
      }
    );

    // const resetLink = `http://localhost:5173/reset-password/${user._id}/${token}`;
    const resetLink = `https://inasta-frontend.onrender.com/reset-password/${user._id}/${token}`;


    const transpoter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.ethereal.email",
      port:587,
      secure:false,
      auth:{
        user:process.env.EMAIL,
        pass:process.env.PASSWORD
      }
    })

    const mailOptions = {
      from:{
        name:"Instagram-reset-link",
        address:process.env.EMAIL
      },
      to:email,
      subject:"Reset Password",
      html:`
      <p>Hello ${user.username},</p>
      <p>You have requested to reset your password. Please click on the link below to reset your password:</p>
      ${resetLink}
      <p>If you did not request a password reset, please ignore this email.</p>
      <p>Thank you, <br>Instagram</p>
      `
    };

    transpoter.sendMail(mailOptions);

    return res.json(new ApiResponse(200, mailOptions, "email sent successfully"));
  } catch (error) {
    res.json(
      new ApiError(
        error?.statusCode || 500,
        error?.message || "internal server error to send the reset link"
      )
    );
  }
})

const resetPassword = asyncHandler(async(req,res)=>{
try {
  const {password} = req.body
  const {id, token} = req.params

  const salt = await bcrypt.genSalt(10);
  const hashPassword =await bcrypt.hash(password,salt);

  const user = await User.findById({_id:id});

  if(!user){
    return res.json(new ApiError(404, "user not found"))
    }

    // verify the token
    let payload;

    try {
      payload = jwt.verify(token,process.env.SECRET);
    } catch (error) {
      throw new ApiError(404, "Invalid or expired token");
    }
    // match the token with the user
    if(payload._id !== user._id.toString()){
      throw new ApiError(401, "Unauthorized access");
    }

    const updateUser = await User.findByIdAndUpdate(id,{password:hashPassword},{new:true})

    return res.json(
      new ApiResponse(200,updateUser,"Password update successful")
    )
} catch (error) {
  res.json(
    new ApiError(
      error?.statusCode || 500,
      error?.message || "internal server error to update the password"
    )
  );
}
})


export {register ,login,logout, forgetPassword, resetPassword};