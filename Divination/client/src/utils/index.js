export const formatDate = (date) => new Date(date).toLocaleDateString();
export const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
