import validator from 'validator';

export default (formDetails) => {
  if (Object.keys(formDetails).length === 0){
    return {error: 'Please provide date'};
  }
  console.log('yell', formDetails)
  const errorMessages = {};
  const roles = ['ADMIN', 'LECTURER', 'STUDENT'];


  if (!validator.isEmail(formDetails.email)) {
    errorMessages.email = 'Please provide a valid email';
  }
  if (!validator.isLength(formDetails.password, { min: 6 })) {
    errorMessages.password = 'Password must be 6 characters or more';
  }
  if (validator.isEmpty(formDetails.firstName)) {
    errorMessages.firstName = 'First name cannot be empty';
  }
  if (validator.isEmpty(formDetails.surname)) {
    errorMessages.surname = 'Surname cannot be empty';
  }
  if (roles.indexOf(formDetails.role) === -1) {
    errorMessages.role = 'Please enter a valid role';
  }

  if (Object.keys(errorMessages).length === 0) {
    return { isValid: true };
  }

  console.log('ami')
  return { isValid: false, errorMessages };
};
