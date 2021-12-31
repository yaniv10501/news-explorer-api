module.exports.testUrl = (string) => {
  const pattern = /^(https?:\/\/)([\w\-._~:/?%#[\]@!$&'()*+,;=]+)/;
  return pattern.test(string);
};

module.exports.testEmail = (email) => {
  const pattern =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[x01-x08x0bx0cx0e-x1fx21x23-x5bx5d-x7f]|\\[x01-x09x0bx0cx0e-x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[x01-x08x0bx0cx0e-x1fx21-x5ax53-x7f]|\\[x01-x09x0bx0cx0e-x7f])+)\])/;

  return {
    valid: pattern.test(email),
    match: email.match(pattern),
  };
};

module.exports.testName = (name) => {
  const pattern = /^[a-zA-Z]+$/;

  return {
    valid: pattern.test(name),
    match: name.match(pattern),
  };
};

module.exports.testStrength = (string) => {
  const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$/;
  return pattern.test(string);
};

module.exports.testMessage = (message) => {
  const pattern = /[<>]/;

  return {
    valid: !pattern.test(message),
    match: message.match(pattern),
  };
};
