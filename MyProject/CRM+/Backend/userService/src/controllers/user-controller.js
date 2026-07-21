const UserService = require('../service/user-service')
const {StatusCodes} = require('http-status-codes');
const userService = new UserService();
const handleError = (res, error) => {
    const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR; 
    const errorResponse = {
        success: false,
        message: error.message || 'An unexpected error occurred',
    };
    if (error.details) {
        errorResponse.error = error.details; 
    } else {
        errorResponse.error = {
            name: error.name || 'Error',
            message: error.message || 'An error occurred',
            description: error.description || 'No additional information available',
            statusCode: statusCode,
        };
    }
    return res.status(statusCode).json(errorResponse);
};


const signin = async (req, res) => {
   try {
    const userData =  req.body;
    const user = await userService.createUser(userData);
    res.status(StatusCodes.OK).json({
        success: true,
        message: 'User signed in successfully',
        data: user,
    })  
   } catch (error) {
    // handleError(error);
    console.log(error);
   }
}
const createUserWithProfile = async(req, res)=>{
    try {
        // Step 1: Extract user and profile data from request body
        console.log(req.body, 'Entire Request Body');
        // Manually map fields if the request body is flat
        const userData = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        };
        const profileData = {
            address: req.body.address,
            phoneNo: req.body.phoneNo,
            plan_validate: req.body.plan_validate,
            isvalidate: req.body.isvalidate,
        };
        // Step 2: Call the service to create user and profile
        const result = await userService.createUserWithProfile(userData, profileData);

        res.status(200).json({
            success: true,
            message: 'User and profile created successfully',
            data: result,
        })
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to create user and profile',
            error: error.message,
        });
    }
}
const getUserWithProfile = async(req, res) => {
    try {
        const id = req.params.id; 

        const users = await userService.getUserWithProfile(id)
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Users fetched successfully',
            data: users,
        })
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch users',
            error: error.message,
        });
    }
}
const getAllUsers = async(req, res) => {
    try {
        const users = await userService.getAllUsersWithProfiles()
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Users fetched successfully',
            data: users,
        })
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch users',
            error: error.message,
        });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Call the login service
        const result = await userService.login(email, password);

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Login successful',
            data: result,
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: 'Login failed',
            error: error.message,
        });
    }
};
const deleteUserAndProfile = async (req, res) => {
    try {
        // Extract the userId from request params
        const { id: userId } = req.params;

        // Call the service layer to delete the user and profile
        const result = await userService.deleteUserAndProfile(userId);

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'User and profile deleted successfully',
            data: result,
        });
    } catch (error) {
        console.error('Error deleting user and profile:', error);

        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to delete user and profile',
            error: error.message,
        });
    }
};

module.exports = {
    signin,
    createUserWithProfile,
    getUserWithProfile,
    getAllUsers,
    login,
    deleteUserAndProfile
}