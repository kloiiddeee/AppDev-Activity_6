const mysql = require('mysql2');
const bcrypt = require('bcrypt');

// Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'eco',
  password: 'eco',
  database: 'ecommerce_db'
});

//..................................................Register Page
exports.getRegister = (req, res) => {
  res.render('register', { title: 'Register' });
};

//..................................................Register Handler
exports.postRegister = async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  db.query(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, hashedPassword],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.send('Error registering user');
      }
      res.redirect('/auth/login');
    }
  );
};

//..................................................Login Page
exports.getLogin = (req, res) => {
  res.render('login', { title: 'Login' });
};

//..................................................Login Handler
exports.postLogin = (req, res) => {
  const { email, password } = req.body;
  db.query(
    'SELECT * FROM users WHERE email = ?',
    [email],
    async (err, results) => {
      if (err) {
        console.error(err);
        return res.send('Error logging in');
      }
      if (results.length === 0) {
        return res.send('No user with that email');
      }
      const user = results[0];
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        res.send('Logged in successfully');
      } else {
        res.send('Incorrect password');
      }
    }
  );
};

//..................................................Logout Handler
exports.getLogout = (req, res) => {
  res.send('Logged out');
};
