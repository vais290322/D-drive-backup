import express from "express";
import { createDoctor, updateDoctor,deleteDoctor, getdoctor,getAllDoctors } from "../controllers/doctor.controller.js";
import upload  from "../middlewares/multer.middleware.js";
import isAuthenticated from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route('/add-doctor').post(upload.single('profilePicture'),createDoctor);                                              
router.route('/update-doctor/:id').put(upload.single('profilePicture') ,updateDoctor);
router.route('/delete-doctor/:id').delete(deleteDoctor);
router.route('/get-doctor/:id').get(getdoctor);
router.route('/all-doctors').get(getAllDoctors);

export default router; 