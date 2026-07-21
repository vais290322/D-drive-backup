### README for Vais User and Profile Management System

---

## **User and Profile Management API**

This project is a backend service for managing users and their associated profiles, supporting user authentication and CRUD operations on user data. The backend integrates **MySQL** (for user management) and **MongoDB** (for profile management).

---

### **Features**

- **User Management**: Create, read, update, and delete user data in MySQL.
- **Profile Management**: Create, read, update, and delete profiles in MongoDB.
- **Authentication**: User login with password validation and JWT token generation.
- **Relation Handling**: Links user data in MySQL with profile data in MongoDB.
- **Error Handling**: Centralized error handling for validation and operational errors.

---

### **Technologies Used**

- **Node.js**: Runtime environment.
- **Express.js**: Framework for building RESTful APIs.
- **Sequelize ORM**: Database ORM for MySQL.
- **Mongoose**: ODM for MongoDB.
- **bcrypt**: Password hashing.
- **JWT (Json Web Token)**: Authentication mechanism.

---

### **Setup**

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Databases**
   - **MySQL**: Update `config/config.json` with your MySQL credentials.
   - **MongoDB**: Ensure MongoDB is running and update the MongoDB URI in your `.env` file.

4. **Run Migrations**
   ```bash
   npx sequelize-cli db:migrate
   ```

5. **Run the Application**
   ```bash
   npm start
   ```

---

### **API Endpoints**

#### **User Routes**
| Method | Endpoint                   | Description                       |
|--------|----------------------------|-----------------------------------|
| POST   | `/user`                    | **Sign up a new user.**           |
| POST   | `/user/profile`            | **Create a user with a profile.** |
| GET    | `/user/profile/:id`        | **Fetch user with their profile.**|
| GET    | `/users`                   | **Fetch all users and profiles.** |

#### **Auth Routes**
| Method | Endpoint                   | Description                       |
|--------|----------------------------|-----------------------------------|
| POST   | `/login`                   | **Log in an existing user.**      |

---

### **Usage Instructions**

#### **1. Create a User**
**Endpoint**: `POST /user`  
**Request Body**:  
```json
{
  "name": "John Doe",
  "password": "password123"
}
```
**Response**:
```json
{
  "success": true,
  "message": "User created successfully.",
  "data": {
    "id": 1,
    "name": "John Doe"
  }
}
```

---

#### **2. Create User with Profile**
**Endpoint**: `POST /user/profile`  
**Request Body**:  
```json
{
  "userData": {
    "name": "John Doe",
    "password": "password123"
  },
  "profileData": {
    "address": "123 Main St",
    "phoneNo": "1234567890"
  }
}
```
**Response**:
```json
{
  "success": true,
  "message": "User and profile created successfully.",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe"
    },
    "profile": {
      "userId": 1,
      "address": "123 Main St",
      "phoneNo": "1234567890"
    }
  }
}
```

---

#### **3. Log In User**
**Endpoint**: `POST /login`  
**Request Body**:  
```json
{
  "name": "John Doe",
  "password": "password123"
}
```
**Response**:
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "token": "your_jwt_token_here"
  }
}
```

---

#### **4. Fetch User with Profile**
**Endpoint**: `GET /user/profile/:id`  
**Response**:
```json
{
  "success": true,
  "message": "User and profile fetched successfully.",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe"
    },
    "profile": {
      "userId": 1,
      "address": "123 Main St",
      "phoneNo": "1234567890"
    }
  }
}
```

---

#### **5. Fetch All Users**
**Endpoint**: `GET /users`  
**Response**:
```json
{
  "success": true,
  "message": "All users and profiles fetched successfully.",
  "data": [
    {
      "user": {
        "id": 1,
        "name": "John Doe"
      },
      "profile": {
        "userId": 1,
        "address": "123 Main St",
        "phoneNo": "1234567890"
      }
    }
  ]
}
```

---

### **Environment Variables**

Create a `.env` file in the root directory and add the following:
```
JWT_KEY=your_jwt_secret_key
MONGO_URI=mongodb://localhost:27017/your_database
```

---

### **Project Structure**
```
├── controllers
│   ├── user-controller.js
├── models
│   ├── user.js
├── migrations
│   ├── <timestamp>-add-email-to-users.js
├── repositories
│   ├── user-repository.js
│   ├── profile-repository.js
├── routes
│   ├── user-routes.js
├── services
│   ├── user-service.js
├── utils
│   ├── app-error.js
├── config
│   ├── config.json
└── index.js
```

---

### **License**
This project is licensed under the Vais Engineering PVT LIMITED License. 