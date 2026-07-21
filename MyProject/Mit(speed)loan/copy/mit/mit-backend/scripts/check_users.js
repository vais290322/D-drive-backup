const mongoose = require('mongoose');
require('dotenv').config();
const Profile = require('../src/models/Profile');

async function val() {
    try {
        await mongoose.connect('mongodb://localhost:27017/mitelectroworld');
        console.log('Connected');
        const users = await Profile.find({});
        console.log('Users found:', users.length);
        users.forEach(u => console.log(u.email));
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
val();
