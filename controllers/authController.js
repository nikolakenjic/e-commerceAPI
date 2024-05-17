const register = async (req, res, next) => {
  res.send('register user');
};

const login = async (req, res, next) => {
  res.send('login user');
};

const logout = async (req, res, next) => {
  res.send('logout user');
};

module.exports = { register, login, logout };
