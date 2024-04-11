export const validatePassword = (password: string) => {
  if (password.length < 8 || password.length > 64) {
    // console.log('Password must be between 8 and 64 characters');
    return false;
  }

  if (!/\d/.test(password)) {
    // console.log('Password must contain at least one numeric digit (0-9)');
    return false;
  }

  return true;
};

export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
