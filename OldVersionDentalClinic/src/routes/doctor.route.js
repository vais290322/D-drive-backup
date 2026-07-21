const express = require("express");
const { createDoctor, updateDoctor, deleteDoctor, getdoctor, getAllDoctors } = require("../controllers/doctor.controller.js");
const upload = require("../middlewares/multer.middleware.js");
const isAuthenticated = require("../middlewares/auth.middleware.js");

const router = express.Router();

router.route('/add-doctor').post(upload.single('profilePicture'), createDoctor);
router.route('/update-doctor/:id').put(upload.single('profilePicture'), updateDoctor);
router.route('/delete-doctor/:id').delete(deleteDoctor);
router.route('/get-doctor/:id').get(getdoctor);
router.route('/all-doctors').get(getAllDoctors);

module.exports = router;
