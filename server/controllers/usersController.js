import jwt from 'jsonwebtoken';

import { Department, Lecturer, Student, User } from '../models';
import { getUserToken, userValidator } from '../helpers'

exports.createUser = (req, res) => {
  const { isValid, errorMessages } = userValidator(req.body);

  if (isValid) {
    const {
      email,
      firstName,
      middleName,
      password,
      role,
      surname,
      title,
    } = req.body;

    User.findOne({
      where: { email }
    }).then((foundUser) => {
      if (foundUser && foundUser !== null) {
        return res.status(409).json({
          status: 'Error',
          message: 'User Exists'
        });
      }

      User.create({
        email,
        firstName,
        middleName,
        password,
        role,
        surname,
        title,
      }).then((createdUser) => {
        const token = getUserToken(createdUser);

        switch (role) {
          case 'STUDENT': {
            const {
              registrationNumber,
              studentType,
              entryYear
            } = req.body;

            Student.create({
              registrationNumber,
              studentType,
              entryYear,
              userId: createdUser.id
            }).then((createdStudent) => {
              res.status(201).send({
                status: 'Succes',
                user: createdUser,
                studentDetails: createdStudent,
                token
              });
            }).catch((error) => {
              res.status(500).send(error.message);
            });
            break;
          }

          case 'LECTURER': {
            Lecturer.create({
              userId: createdUser.id
            }).then((createdLecturer) => {
              res.status(201).send({
                status: 'Succes',
                user: createdUser,
                lecturerDetails: createdLecturer,
                token
              });
            }).catch((error) => {
              res.status(500).send(error.message);
            });
            break;
          }

          default:
            res.status(201).send({
              status: 'Succes',
              user: createdUser,
              token
            });
            break;
        }
      }).catch((error) => {
        res.status(500).send(error.message);
      });
    }).catch((error) => {
      res.status(500).send(error.message);
    });
  } else {
    res.status(400).send({
      status: 'Error',
      message: errorMessages
    });
  }
}
