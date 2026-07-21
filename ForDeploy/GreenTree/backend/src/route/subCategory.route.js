const express = require('express');
const router = express.Router();
const subCategoryController = require('../controller/subCategory.controller.js');
const {authenticate, authorize} = require('../middleware/authorization.js');

// Create
router.post('/subcategory',authenticate,authorize(["admin","staff"]),subCategoryController.createSubCategory);

// Read all
router.get('/subcategory',authenticate,authorize(["admin","staff"]), subCategoryController.getSubCategories);


router.get('/allsubcategory',authenticate,authorize(["admin","staff"]), subCategoryController.getSubCategory);

// Read one
router.get('/subcategory/:id',authenticate,authorize(["admin","staff"]), subCategoryController.getSubCategorybyid);

// Update
router.put('/subcategory/:id',authenticate,authorize(["admin","staff"]), subCategoryController.updateSubCategory);

// Delete
router.delete('/subcategory/:id',authenticate,authorize(["admin","staff"]), subCategoryController.deleteSubCategory);

module.exports = router;