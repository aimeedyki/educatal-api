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
app.post('/signin', authenticationController.signinUser);

export default app;
