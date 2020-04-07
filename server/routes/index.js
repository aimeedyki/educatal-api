import express from 'express';
import { usersController } from '../controllers';

const app = express();

// route for creating user
app.post('/user', usersController.createUser);

export default app;
