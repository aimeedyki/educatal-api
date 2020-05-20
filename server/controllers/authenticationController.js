import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { Lecturer, Student, User } from '../models';
import {
  changePasswordValidator,
  getUserToken,
  signinValidator
} from '../helpers';

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
          message: 'email or password is incorrect'
        });
      } else {
        const passkey = bcrypt.compareSync(password, foundUser.password);

        if (passkey) {
          const token = getUserToken(foundUser);
          const {
            departmentId,
            email,
            id,
            firstName,
            middleName,
            role,
            surname,
            title
          } = foundUser;
          const userData = {
            id,
            title,
            firstName,
            middleName,
            surname,
            email,
            role,
            departmentId,
          };

          // return user details according to users role
          switch (foundUser.role) {
            case 'STUDENT': {
              Student.findOne({
                where: { userId: foundUser.id }
              }).then((foundStudent) => {
                const {
                  id: studentId,
                  registrationNumber,
                  studentType,
                  entryYear
                } = foundStudent;

                res.status(201).send({
                  status: 'Succes',
                  data: {
                    user: {
                      ...userData,
                      studentType,
                      registrationNumber,
                      entryYear,
                      studentId
                    },
                    token
                  }
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
                const { id: lecturerID } = foundLecturer;

                res.status(201).send({
                  status: 'Succes',
                  data: {
                    user: { ...userData, lecturerID },
                    token
                  }
                });
              }).catch((error) => {
                res.status(500).send(error.message);
              });

              break;
            }

            default:
              res.status(201).send({
                status: 'Succes',
                data: {
                  user: userData,
                  token
                }
              });

              break;
          }
        } else {
          res.status(401).send({
            status: 'Error',
            message: 'email or password is incorrect'
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
};

exports.changePassword = (req, res) => {
  const { isValid, errorMessages } = changePasswordValidator(req.body);

  if (isValid) {
    const { newPassword, currentPassword } = req.body;
    const { userId } = req.decoded;

    User.findByPk(userId)
      .then((user) => {
        // checks if currentPassword matches user password
        if (!bcrypt.compareSync(currentPassword, user.password)) {
          return res.status(422).send({
            status: 'Error',
            message: 'Please reconfirm password'
          });
        }

        // checks if new password is the same with received to stored password
        if (bcrypt.compareSync(newPassword, user.password)) {
          return res.status(409).send({
            status: 'Error',
            message: 'You cannot use a previous password'
          });
        }

        user.update({
          password: bcrypt.hashSync(newPassword, 10)
        })
          .then((updatedUser) => {
            res.status(200)
              .send({
                status: 'Success',
                data: {
                  message: `Password for ${updatedUser.firstName}, has been updated`
                }
              });
          })
          .catch(error => res.status(500).send({
            status: 'Error',
            message: error.message
          }));
      })
      .catch(error => res.status(500).send({
        status: 'Error',
        message: error.message
      }));
  } else {
    res.status(400).send({
      status: 'Error',
      message: errorMessages
    });
  }
};
