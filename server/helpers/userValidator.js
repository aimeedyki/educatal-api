import validator from 'validator';

import validationFormatter from './validationFormatter';
import { roles, studentTypes } from '../constants';

export default (formDetails) => {
  if (Object.keys(formDetails).length === 0) {
    return { errorMessages: { error: 'Please provide data' } };
  }

  const {
    email,
    firstName,
    password,
    role,
    surname
  } = formDetails;
  const errorMessages = {};

  if (!email || !validator.isEmail(email)) {
    errorMessages.email = 'Please provide a valid email';
  }

  if (!password || !validator.isLength(password, { min: 6 })) {
    errorMessages.password = 'Password must be 6 characters or more';
  }

  if (!firstName || validator.isEmpty(firstName)) {
    errorMessages.firstName = 'First name cannot be empty';
  }

  if (!surname || validator.isEmpty(surname)) {
    errorMessages.surname = 'Surname cannot be empty';
  }

  if (!role || Object.values(roles).indexOf(role) === -1) {
    errorMessages.role = 'Please enter a valid role';
  }

  switch (role) {
    case 'STUDENT': {
      const {
        registrationNumber,
        studentType,
        entryYear
      } = formDetails;

      if (!registrationNumber || validator.isEmpty(surname)) {
        errorMessages.registrationNumber = 'Registration number cannot be empty';
      }

      if (!studentType || Object.values(studentTypes).indexOf(studentType)) {
        errorMessages.studentType = 'Please enter a valid student type';
      }

      if (!entryYear || validator.isEmpty(entryYear) ) {
        errorMessages.entryYear = 'Entry year cannot be empty';
      }

      break;
    }

    default:
      break;
  }

  return validationFormatter(errorMessages);
};
