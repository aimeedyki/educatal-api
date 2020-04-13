import validator from 'validator';

import validationFormatter from './validationFormatter';
import { roles, studentTypes } from '../constants';

export default (formDetails) => {
  if (Object.keys(formDetails).length === 0) {
    return { errorMessages: { error: 'Please provide data' } };
  }

  const {
    email,
    entryYear,
    firstName,
    middleName,
    password,
    registrationNumber,
    role,
    studentType,
    surname,
    title
  } = formDetails;
  const errorMessages = {};

  if (email && !validator.isEmail(email)) {
    errorMessages.email = 'Please provide a valid email';
  }

  if (password && !validator.isLength(password, { min: 6 })) {
    errorMessages.password = 'Password must be 6 characters or more';
  }

  if (firstName && validator.isEmpty(firstName)) {
    errorMessages.firstName = 'First name cannot be empty';
  }

  if (surname && validator.isEmpty(surname)) {
    errorMessages.surname = 'Surname cannot be empty';
  }

  if (role && Object.values(roles).indexOf(role) === -1) {
    errorMessages.role = 'Please enter a valid role';
  }

  if (middleName && validator.isEmpty(middleName)) {
    errorMessages.surname = 'Surname cannot be empty';
  }

  if (title && validator.isEmpty(title)) {
    errorMessages.surname = 'Surname cannot be empty';
  }

  if (role === 'STUDENT') {
    if (!registrationNumber || validator.isEmpty(registrationNumber)) {
      errorMessages.registrationNumber
        = 'Registration number cannot be empty when changing role to STUDENT';
    }

    if (!studentType || Object.values(studentTypes).indexOf(studentType)) {
      errorMessages.studentType
        = 'Please enter a valid student type when changing role to STUDENT';
    }

    if (!entryYear || validator.isEmpty(entryYear)) {
      errorMessages.entryYear
        = 'Entry year cannot be empty when changing role to STUDENT';
    }
  }

  return validationFormatter(errorMessages);
};


