const Profile = require('../models/profile'); 

class ProfileRepository {

    async getProfileByUserId(userId) {
        return await Profile.findOne({ userId });
    }

    async createProfile(data) {
        const profile = new Profile(data);
        return await profile.save();
    }

    async updateProfile(userId, data) {
        return await Profile.updateOne({ userId }, data);
    }

    async deleteProfile(userId) {
        return await Profile.deleteOne({ userId });
    }
    async getAllProfiles(){
        return await Profile.find();
    }
}

module.exports = ProfileRepository;
