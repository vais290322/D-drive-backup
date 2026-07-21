const Register = require("../models/register.models.js");
const bcrypt = require("bcrypt");


exports.staffregister = async (req, res) => {
    try {
      const {
        name,
        email,
        password,
      
      } = req.body;
      if (
        !name ||
        !email ||
        !password 
      )
        return res.status(400).json({ message: "All fields are required" });
  
      const existingUser = await Register.findOne({ 
        $or: [
          { email: email },
          { role: "staff" }, 
        ]
      });
      if (existingUser)
        return res.status(400).json({ message: "Staff already registered" });

  
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new Register({
        name,
        email,
        password: hashedPassword,
        role: "staff",
      });
      await user.save();
  
      res.status(201).json({ message: "Registration successful" });
    } catch (error) {
      console.error("Register Error:", error);
      res.status(500).json({ message: "Server error" });
    }
};


exports.getstaffregister = async (req, res) => {
    try {
    
      const staff = await Register.findOne({ role: "staff" });
      if (!staff) {
        return res.status(404).json({ message: "Staff not found" });   
      }
      res.status(201).json({ message: "Staff fetch successful" , data: staff });
    } catch (error) {
      console.error("Register Error:", error);
      res.status(500).json({ message: "Server error" });
    }
};


exports.updatestaffregister = async (req, res) => {
    try {
      const {
        name,
        email,
        password,
      } = req.body; 
      if (
       !name ||
       !email ||
       !password 
      ){
        return res.status(400).json({ message: "All fields are required" });
      }
      const staff = await Register.findOne({ role: "staff" });
      if (!staff) {
        return res.status(404).json({ message: "Staff not found" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      staff.name = name 
      staff.email = email 
      staff.password = hashedPassword
      staff.isAdmin =null
      await staff.save();
      res.status(201).json({ message: "Staff updated successfully", data: staff });
    }catch (error) {
      console.error("Register Error:", error);
      res.status(500).json({ message: "Server error" });
    }
}