import validationFormatter from './validationFormatter';

export default (fields) => {
  const { email, password } = fields;
  const errorMessages = {};

  if (!password || password === '') {
    errorMessages.password = 'Please enter your password';
  }

  if (!email || email === '') {
    errorMessages.email = 'Please enter your email';
  }

  return validationFormatter(errorMessages);
};
