export function isEmailValid(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export function isNameValid(name) {
  const re = / {2,}|[^A-Za-z ]/;
  return !re.test(String(name));
}

export function isPhoneNumberValid(phoneNumber) {
  const re = /[^0-9]/;
  return !re.test(String(phoneNumber));
}
