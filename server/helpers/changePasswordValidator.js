import validator from 'validator';

import validationFormatter from './validationFormatter';

export default (formDetails) => {
  const {
    confirmNewPassword,
    newPassword,
    oldPassword
  } = formDetails;
  const errorMessages = {};
  
  if (!oldPassword || validator.isEmpty(oldPassword)) {
    errorMessages.oldPassword ='Please enter your current password';
  }

  if (!newPassword || validator.isEmpty(newPassword)) {
    errorMessages.newPassword = 'Please enter your new password';
  }

  if (!confirmNewPassword || validator.isEmpty(confirmNewPassword)) {
    errorMessages.confirmNewPassword = 'Please confirm your new password';
  }

  if (confirmNewPassword !== newPassword) {
    errorMessages.confirmNewPassword = 'Passwords do not match';
  }

  return validationFormatter(errorMessages);
};
