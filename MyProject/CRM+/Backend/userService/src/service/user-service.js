const {UserRepository, ProfileRepository} = require('../repositories');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const AppError = require('../utils/app-error');
class UserService {
    constructor(){
      this.userRepository = new UserRepository();
      this.profileRepository = new ProfileRepository();
    }
    // Fetch all users along with their profiles
async getAllUsersWithProfiles() {
    try {
        // Step 1: Get all users from MySQL
        const users = await this.userRepository.getAll();

        if (!users || users.length === 0) {
            throw new Error('No users found');
        }

        // Step 2: Get all profiles from MongoDB
        const profiles = await this.profileRepository.getAllProfiles();

        // Step 3: Map profiles to respective users
        const usersWithProfiles = users.map(user => {
            const profile = profiles.find(profile => profile.userId === user.id);
            return {
                ...user.toJSON(), // Convert Sequelize instance to plain object
                profile: profile || null, // Attach profile if it exists, otherwise null
            };
        });

        return usersWithProfiles;
    } catch (error) {
        throw new Error('Error fetching users with profiles: ' + error.message);
    }
}

// Login method
async login(email, password) {
    try {
        // Step 1: Find user by email
        const user = await this.userRepository.getByField('email', email);
        if (!user) {
            throw new AppError('AuthenticationError', 'Invalid credentials', 'Email not found', 401);
        }

        // Step 2: Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new AppError('AuthenticationError', 'Invalid credentials', 'Incorrect password', 401);
        }

        // Step 3: Generate JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_KEY || 'your_jwt_secret',
            { expiresIn: '1h' }
        );

        // Optional: Save token in the database
        await this.userRepository.update(user.id, { token });

        return { token, user };
    } catch (error) {
        throw new Error('Error during login: ' + error.message);
    }
}



     //* Create a user only (no profile)
     async createUser(userData) {
        try {
            // Step 1: Create User in MySQL
            const user = await this.userRepository.create(userData);

            return  user 
        } catch (error) {
            throw new Error('Error creating user: ' + error.message);
        }
    }

      // Create a user and profile
      
      async createUserWithProfile(userData, profileData) {
        try {
            console.log('Creating in service layer', userData, profileData);
            // Step 1: Create User in MySQL
            const user = await this.userRepository.create(userData);

            // Step 2: Create Profile in MongoDB
            // Ensure userId in Profile is the same as created user id
            const profile = await this.profileRepository.createProfile({
                userId: user.id,
                ...profileData
            });

            return { user, profile };
        } catch (error) {
            throw new Error('Error creating user and profile: ' + error.message);
        }
    }

    // Get User with Profile (fetch from both databases)
    async getUserWithProfile(userId) {
        try {
            // Step 1: Get user from MySQL
            const user = await this.userRepository.getById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            // Step 2: Get profile from MongoDB
            const profile = await this.profileRepository.getProfileByUserId(userId);
            if (!profile) {
                throw new Error('Profile not found');
            }

            return { user, profile };
        } catch (error) {
            throw new Error('Error fetching user and profile: ' + error.message);
        }
    }

    // Update User and Profile
    async updateUserAndProfile(userId, userData, profileData) {
        try {
            // Step 1: Update user in MySQL
            const updatedUser = await this.userRepository.update(userId, userData);

            // Step 2: Update profile in MongoDB
            const updatedProfile = await this.profileRepository.updateProfile(userId, profileData);

            return { updatedUser, updatedProfile };
        } catch (error) {
            throw new Error('Error updating user and profile: ' + error.message);
        }
    }

    // Delete User and Profile
    async deleteUserAndProfile(userId) {
        try {
            // Step 1: Delete user from MySQL
            const deletedUser = await this.userRepository.delete(userId);

            // Step 2: Delete profile from MongoDB
            const deletedProfile = await this.profileRepository.deleteProfile(userId);

            return { deletedUser, deletedProfile };
        } catch (error) {
            throw new Error('Error deleting user and profile: ' + error.message);
        }
    }
      // ? validate password
      async checkPassword(plainPassword, hashedPassword){
        try {
            return await  bcrypt.compare(plainPassword, hashedPassword);
          } catch (error) {
            console.log('Error during password comparison in AuthService');
            throw new AppError(
              'PasswordError',
              'Password comparison failed',
              'An error occurred while checking the password',
              500
            );
          }
    }
    //* for validate tokens
    async validateToken(token) {

        try {
    
            // Verify the JWT token
            const decoded = jwt.verify(token, JWT_KEY);
            console.log(decoded.userId)
            const authRecord = await this.userRepository.getByField('token', token);

    
            if (!authRecord) {
                throw new AppError(
                    'UnauthorizedError',
                    'Validation Error',
                    'Token not found or revoked',
                    401
                );
            }
    
            return {
                ...decoded,
                // user: userResponse.data.data,
            };
    
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                console.error("Token validation failed: Token has expired at", error.expiredAt);
                throw new AppError(
                    'UnauthorizedError',
                    'Token Expired',
                    'The provided token has expired. Please log in again.',
                    401
                );
            } else {
                console.error("Error during token validation:", error);
                throw new AppError(
                    'UnauthorizedError',
                    'Token Invalid',
                    'The provided token is invalid or malformed.',
                    401
                );
            }
        }
    }
    
}

module.exports = UserService;
