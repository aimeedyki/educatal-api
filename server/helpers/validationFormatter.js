export default (errorMessages) => {
  if (Object.keys(errorMessages).length === 0) {
    return { isValid: true };
  }

  return { isValid: false, errorMessages };
}
