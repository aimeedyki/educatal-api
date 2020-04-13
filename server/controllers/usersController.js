import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';

import { Department, Lecturer, Student, User } from '../models';
import {
  getUserToken,
  paginate,
  userUpdateValidator,
  userValidator
} from '../helpers'

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
};

exports.fetchAllUsers = (req, res) => {
  const {
    limit = 8,
    offset = 0,
    role,
    nameQuery
  } = req.query;

  const whereClause = {};

  if (role) {
    whereClause.role = role;
  }

  if (nameQuery) {
    whereClause[Op.or] = [
      { firstName: { [Op.like]: `%${nameQuery}%` } },
      { middleName: { [Op.like]: `%${nameQuery}%` } },
      { surname: { [Op.like]: `%${nameQuery}%` } }
    ];
  }

  User.findAndCountAll({
    where: whereClause,
    order: [['surname', 'ASC']],
    limit,
    offset
  })
    .then((foundUsers) => {
      if (foundUsers.rows.length < 1) {
        return res.status(200)
          .send({
            status: 'Success',
            message: 'Sorry, there are no users'
          });
      }

      res.status(200).send({
        status: 'Success',
        users: foundUsers.rows,
        pagination: paginate(offset, limit, foundUsers)
      });
    })
    .catch(error => res.status(500).send(error.message));
};

exports.fetchUser = (req, res) => {
  const { userId } = req.params;

  User.findByPk(userId)
    .then((foundUser) => {
      if (!foundUser) {
        return res.status(404)
          .send({
            status: 'Error',
            message: 'User not found'
          });
      }

      switch (foundUser.role) {
        case 'STUDENT': {
          Student.findOne({
            where: { userId }
          }).then((foundStudent) => {
            res.status(200).send({
              status: 'Succes',
              user: foundUser,
              studentDetails: foundStudent
            });
          }).catch((error) => {
            res.status(500).send(error.message);
          });
          break;
        }

        case 'LECTURER': {
          Lecturer.findOne({
            where: { userId }
          }).then((foundLecturer) => {
            res.status(201).send({
              status: 'Succes',
              user: foundUser,
              lecturerDetails: foundLecturer
            });
          }).catch((error) => {
            res.status(500).send(error.message);
          });
          break;
        }

        default:
          res.status(201).send({
            status: 'Succes',
            user: foundUser
          });
          break;
      }
    })
    .catch(error => res.status(500).send(error.message));
};

exports.updateUser = (req, res) => {
  const { isValid, errorMessages } = userUpdateValidator(req.body);
  const { userId } = req.params;
  const {
    email,
    firstName,
    middleName,
    password,
    role,
    surname,
    title,
  } = req.body;
  let studentDetails;
  let lecturerDetails;

  if (isValid) {
    User.findByPk(userId)
      .then((user) => {
        if (!user) {
          return res.status(404)
            .send({
              status: 'Error',
              message: 'User not found'
            });
        }

        if (role !== user.role) {
          switch (role) {
            case 'STUDENT': {
              const {
                registrationNumber,
                studentType,
                entryYear
              } = req.body;

              if (user.role === 'LECTURER') {
                Lecturer.findOne({
                  where: { userId }
                }).then((foundLecturer) => {
                  foundLecturer
                    .destroy()
                    .then()
                    .catch(error => res.status(500).send(error));
                })
              }

              Student.create({
                registrationNumber,
                studentType,
                entryYear,
                userId: user.id
              }).then((createdStudent) => {
                studentDetails = createdStudent;
              }).catch((error) => {
                res.status(500).send({
                  status: 'Error',
                  message: error.message
                });
              });

              break;
            }

            case 'LECTURER': {
              if (user.role === 'STUDENT') {
                Student.findOne({
                  where: { userId }
                }).then((foundStudent) => {
                  foundStudent
                    .destroy()
                    .then()
                    .catch(error => res.status(500).send(error));
                })
              }

              Lecturer.create({
                userId: user.id
              }).then((createdLecturer) => {
                lecturerDetails = createdLecturer;
              }).catch((error) => {
                res.status(500).send(error.message);
              });

              break;
            }

            default:
              break;
          }
        }

        user.update({
          title: title || user.title,
          email: email || user.email,
          firstName: firstName || user.firstName,
          middleName: middleName || user.middleName,
          password: password || user.password,
          role: role || user.role,
          surname: surname || user.surname
        })
          .then((updateduser) => {
            let response;

            if (studentDetails) {
              response = { status: 'Success', updateduser, studentDetails }
            } else if (lecturerDetails) {
              response = { status: 'Success', updateduser, lecturerDetails }
            } else {
              response = { status: 'Success', updateduser }
            }

            res.status(200).send(response);
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
