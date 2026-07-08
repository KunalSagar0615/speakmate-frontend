export const getStored = (key, fallback = null) => {
  try {
    const value = localStorage.getItem(key);
    return value ?? fallback;
  } catch {
    return fallback;
  }
};

export const setStored = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // No-op
  }
};

export const removeStored = (key) => {
  try {
    localStorage.removeItem(key);
  } catch {
    // No-op
  }
};
