const express = require('express');
const router = express.Router();
const UserController = require('../../controllers/user-controller');
// Define your routes here
router.get('/', (req,res)=>{
    res.send('vais enginnering auth service ');
});
//?  for signin route
router.post('/user', UserController.signin);
router.post('/user/profile', UserController.createUserWithProfile);
router.get('/user/profile/:id', UserController.getUserWithProfile);
router.get('/users' , UserController.getAllUsers);
//? for login 
router.post('/login', UserController.login);
//! for delete

router.delete('/user/:id', UserController.deleteUserAndProfile);

module.exports = router;