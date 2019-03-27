import bcrypt from 'bcryptjs';

const hashPassword = (password) => {
  // Verify that the password is at least 8 characters.
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }
  // Hash the password before storing it.
  return bcrypt.hash(password, 10);
};

export { hashPassword as default };