import express from 'express';
import {
  authenticationController,
  usersController
} from '../controllers';

const app = express();

// route for creating user
app.post('/user', usersController.createUser);

// route for signing in user
app.post('/signin', authenticationController.signinUser);

export default app;
