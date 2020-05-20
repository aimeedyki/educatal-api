import validator from 'validator';

import validationFormatter from './validationFormatter';

export default (formDetails) => {
  const {
    confirmPassword,
    newPassword,
    currentPassword
  } = formDetails;
  const errorMessages = {};

  if (!currentPassword || validator.isEmpty(currentPassword)) {
    errorMessages.currentPassword = 'Please enter your current password';
  }

  if (!newPassword || validator.isEmpty(newPassword)) {
    errorMessages.newPassword = 'Please enter your new password';
  }

  if (!confirmPassword || validator.isEmpty(confirmPassword)) {
    errorMessages.confirmPassword = 'Please confirm your new password';
  }

  if (confirmPassword !== newPassword) {
    errorMessages.confirmPassword = 'Passwords do not match';
  }

  return validationFormatter(errorMessages);
};
