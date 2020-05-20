import express from 'express';

import {
  authenticationController,
  usersController
} from '../controllers';
import authentication from '../middlewares/authentication';

const app = express();

// route for creating user
app.post(
  '/user',
  authentication.verifyUser,
  authentication.verifyAdmin,
  usersController.createUser
);

// route for signing in user
app.put('/signin', authenticationController.signinUser);

// route for fetching all users
app.get(
  '/user',
  authentication.verifyUser,
  authentication.verifyAdmin,
  usersController.fetchAllUsers
);

// route for fetching a user
app.get(
  '/user/:userId',
  authentication.verifyUser,
  authentication.verifyAdmin,
  usersController.fetchUser
)

// route to update user's password
app.patch(
  '/user/password',
  authentication.verifyUser,
  authenticationController.changePassword
);

// route to edit user details
app.put(
  '/user/:userId',
  authentication.verifyUser,
  authentication.verifyAdmin,
  usersController.updateUser
);

export default app;
