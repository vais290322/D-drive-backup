const express = require('express');
const router = express.Router();
const ClientController = require('../../controllers/client-controller');
// Define your routes here
router.get('/', (req,res)=>{
    res.send('vais enginnering client service ');
});
router.post('/client', ClientController.createClient);

module.exports = router;