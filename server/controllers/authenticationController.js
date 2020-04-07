import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { Lecturer, Student, User } from '../models';
import { getUserToken, signinValidator } from '../helpers';

exports.signinUser = (req, res) => {
  const { isValid, errorMessages } = signinValidator(req.body);
  const { email, password } = req.body;

  if (isValid) {
    User.findOne({
      where: { email }
    }).then((foundUser) => {
      if (!foundUser) {
        res.status(401).send({
          status: 'Error',
          message: 'username or password is incorrect'
        });
      } else {
        const passkey = bcrypt.compareSync(password, foundUser.password);

        if (passkey) {
          const token = getUserToken(foundUser);

          // return user details according to users role
          switch (foundUser.role) {
            case 'STUDENT': {
              Student.findOne({
                where: { userId: foundUser.id }
              }).then((foundStudent) => {
                res.status(201).send({
                  status: 'Succes',
                  user: foundUser,
                  studentDetails: foundStudent,
                  token
                });
              }).catch((error) => {
                res.status(500).send(error.message);
              });

              break;
            }

            case 'LECTURER': {
              Lecturer.findOne({
                where: { userId: foundUser.id }
              }).then((foundLecturer) => {
                res.status(201).send({
                  status: 'Succes',
                  user: foundUser,
                  lecturerDetails: foundLecturer,
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
                user: foundUser,
                token
              });

              break;
          }
        } else {
          res.status(401).send({
            status: 'Error',
            message: 'username or password is incorrect'
          });
        }
      }
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
