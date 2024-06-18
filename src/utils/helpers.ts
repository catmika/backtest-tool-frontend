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

export const isOptionEqualToValue = (option: any, value: any) => {
  if (typeof option === 'object' && typeof value === 'object') {
    return option.value === value.value;
  }
  return option === value;
};

export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const debounce = <T extends (...args: any[]) => any>(func: T, delay: number): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>): void => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};
