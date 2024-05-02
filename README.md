# Postaway Social Media APIs

Hi there! I've built PostAway 2.0.0, an updated version of a social media platform. This REST API powers the app, making it easy for users to create, share, and interact with posts and comments. It's designed to be simple and secure, ensuring your data stays safe while you connect with others. PostAway 2.0.0 is an upgrade from the earlier version, offering better features and a safer online space for everyone to share and engage!


## Technologies


![Javascript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Git](https://img.shields.io/badge/GIT-E44C30?style=for-the-badge&logo=git&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-darkred?style=for-the-badge&logoColor=white)


## Authentication & Authorization

- Using JWT tokens for authentication upon login.

- Implement middleware for authorization, ensuring only authorized users can access specific endpoints based on roles and ownership.


## Error Handling

- Implementing meaningful error responses and status codes for various scenarios (e.g., unauthorized access, missing data, server errors).


## Dependencies

  - **body-parser** :For parsing request body.

  - **express** : Framework for Node.js

  - **jsonwebtoken** : For user authentication.

  - **multer** : For uploading multipart form data.

  - **swagger-ui-express** : API Documentation.

  - **mongoose** : MongoDB ODM tool.


## API Overview

- **User Authentication**

  - **User Registration**:  Register new users on the application.

  - **User Login/Logout**: Authenticate users to access the system and log them out.

  - **Get User Details by ID**: Fetch details for a specific user by ID.

  - **Get Details of All Users**: Retrieve details of all registered users.

  - **Update User Details by ID**: Allow users to update their profile information.

  - **Log out User from all devices**: Log out a specific user from all devices.


- **Posts**:

  - **Retrieve All Posts**: Fetch all available posts from the server.

  - **Create New Post**: Enable users to create new posts with captions and images.

  - **Retrieve User's Posts**: Get all posts of the logged-in user.

  - **Retrieve Specific Post by ID**: Fetch a specific post by its unique ID.

  - **Delete Specific Post by ID**: Allow users to delete a specific post by its ID.

  - **Update Specific Post by ID**: Enable users to modify a specific post by its ID.


- **Comments**:

  - **Create New Comment**: Allow users to add comments to posts.

  - **Delete Specific Comment by ID**: Enable users to delete a specific comment by its ID.

  - **Update Specific Comment by ID**: Allow users to modify a specific comment by its ID.

  - **Retrieve Comments for Specific Post**: Fetch comments for a specific post.


- **Likes**:

  - **Toggle Like/Unlike Post or Comment**: Enable users to like or unlike specific posts or comments.

  - **Retrieve Likes for Specific Post/Comment**: Fetch the list of users who liked a particular post or comment.


- **OTP**:

  - **Send OTP to User's Email**: Send a one-time password to the user's email for verification.

  - **Verify OTP**: Verify the OTP entered by the user for authentication.

  - **Reset User's Password**: Allow users to reset their password using the verified OTP.

- **Friendship**:

  - **Toggle Friendship Status**: Enable users to toggle friendship status with other users.

  - **Retrieve Pending Friend Requests**: Fetch pending friend requests for a user.

  - **Respond to Friend Requests**: Allow users to accept or reject friend requests.

  - **Retrieve Friend List**: Fetch the friend list of a specific user based on their user ID.


## Steps to Setup

1. Clone the repository.
2. Install dependencies.
3. Run the server from the index.js file.
3. The server will start listening on port 5000.


## Project Structure

- **`configurations/`**
    - **`email.config.js`** Nodemailer configurations for sending emails.
    - **`mongoose.config.js`** Mongoose (MongoDB ODM tool) configurations for database interaction.
    

- **`features/`**
    

    - **`comment/`**

        - **`comment.controller.js`** All the controlling operations of the comments-related APIs.

        - **`comment.repository.js`** All the data operations of the comments-related APIs.

        - **`comment.route.js`** All the route configurations of the comments-related APIs.

        - **`comment.schema.js`** Database schema of comments using Mongoose.


    - **`friendship/`**

        - **`friendship.controller.js`** All the controlling operations of the friendship-related APIs.

        - **`friendship.repository.js`** All the data operations of the friendship-related APIs.

        - **`friendship.route.js`** All the route configurations of the friendship-related APIs.

        - **`friendship.schema.js`** Database schema of friendship using Mongoose.


    - **`like/`**

        - **`like.controller.js`** All the controlling operations of the likes-related APIs.

        - **`like.repository.js`** All the data operations of the likes-related APIs.

        - **`like.route.js`** All the route configurations of the like-related APIs.  

        - **`like.schema.js`** Database schema of like using Mongoose.


    - **`OTP/`**

        - **`otp.route.js`** All the route configurations of the OTP-related APIs.

        - **`otp.controller.js`** All the cotrolling operations of the OTP-related APIs.

        - **`otp.repository.js`** All the data operations of the OTP-related APIs.


    - **`post/`**

        - **`post.controller.js`** All the controlling operations of the post-related APIs.

        - **`post.repository.js`** All the data operations of the post-related APIs.

        - **`post.route.js`** All the route configurations of the post-related APIs.  

        - **`post.schema.js`** Database schema of posts using Mongoose.  
    

    - **`user/`**

        - **`user.controller.js`** All the controlling operations of the user-related APIs.

        - **`user.repository.js`** All the data operations of the user-related APIs.

        - **`user.route.js`** All the route configurations of the user-related APIs.  

        - **`user.schema.js`** Database schema of users using Mongoose.  
        

- **`middleware/`**

    - **`fileUpload.middleware.js`** Middleware for uploading image files.

    - **`jwt.middleware.js`** Authentication token middleware.

    - **`logger.middleware.js`** Middle for logging request URL and request body.


- **`uploads/`**:This folder contains all the uploaded images.

- **`index.js`**: Entry point of the application.

- **`log.txt`** logger.middleware.js file is logging data in this file.

- **`package-lock.json`** This file contains information about the versions of all the dependencies.

- **`package.json`**: File containing project metadata and dependencies.

- **`README.md`**: File containing complete project details.

- **`swagger.json`** Documentation file of all the APIs.


## API Endpoints


 - ### User Route

    -  User Registration

        `POST /api/users/signup` 

    - User login

        `POST /api/users/signin` 

    - Returns a specific user's details by user id

        `GET /api/users/get-details/:userId` 

    - Returns details of all registered users

        `GET /api/users/get-all-details` 

    - Update details of a specific user by user id

        `PUT /api/users//update-details/:userId` 

    - Log out

        `GET /api/users/logout` 

    - Log out from all devices

        `GET /api/users/logout-all-device` 


 - ### Post Route

    - Returns all posts

      `GET /api/posts/all`

    - Returns a specific post by post id

      `GET /api/posts/:postId`

    - returns posts of logged-in user

      `GET /api/posts/`

    - Create post

      `POST /api/posts/`

    - Delete post by post id

      `DELETE /api/posts/:postId`

    - Update post by post id

      `PUT /api/posts/:postId`


 - ### Comment Route

    - Returns all comments by post id

      `GET /api/comments/:postId`

    - Create new comment by post id

      `POST /api/comments/:postId`

    - Delete comment by comment id

      `DELETE /api/comments/:commentId`

    - Update comment by comment id

      `PUT /api/comments/:commentId`

 - ### Like Route

    - Returns all likes for a specific post or comment

      `GET /api/likes/:id`

    - Toggle like for a specific post or comment

      `GET /api/likes/toggle/:id`

 - ### OTP Route

    - Sends a unique 6-digit OTP to the user's email

      `POST /api/otp/send`

    - Verifies the OTP

      `POST /api/otp/verify`

    - Resets the password

      `POST /api/otp/reset-password`

 - ### Friendship Route

    - Toggles friendship status

      `GET /api/friends/:friendId`

    - Returns pending friend requests 

      `GET /api/friends/get-pending-requests`

    - Responds to the friend requests 

      `GET /api/friends/:friendId`

    - Returns the friend list of the user

      `GET /api/friends/get-friends/:userId`

 - ### Documentation Route

    - Get the complete API Docs

        `GET /api-docs`


## Author

Vinayak Gupta

## Contact me 

 [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/vinayak-gupta-a40bb2299/)  [![LeetCode](https://img.shields.io/badge/-LeetCode-FFA116?style=for-the-badge&logo=LeetCode&logoColor=black)](https://leetcode.com/vinayak700/)  [![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:vinayakt890@gmail.com) 
 [![Naukari](https://img.shields.io/badge/Naukri.com-0A66C2?style=for-the-badge&logo=Naukri.com&logoColor=white)](https://www.naukri.com/mnjuser/profile)
  
## License

This project is licensed under the ISC License.

