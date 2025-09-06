import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();


export const Register = async (req, res) => {
  //console.log('====================================');
  //console.log("Entering register");
  //console.log('====================================');
  const { username, email, password } = req.body;
  //console.log('====================================');
  //console.log(req.body);
  //console.log('====================================');
  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Email is invalid",
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 8 characters",
    });
  }

  try {
    // Check if username already exists
    const existingUsername = await pool.query(
      'SELECT * FROM users WHERE name = $1',
      [username]
    );
    if (existingUsername.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Username already taken",
      });
    }

    // Check if email already exists
    const existingEmail = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    if (existingEmail.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, hashedPassword]
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: newUser.rows[0].id,
        name: newUser.rows[0].name,
        email: newUser.rows[0].email
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error 1" });
  }
};



export const Login = async (req, res) => {
  //console.log('====================================');
  //console.log("Entering login");
  //console.log('====================================');

  const { emailOrUsername, password } = req.body;

  if (!emailOrUsername || !password) {
    return res.status(400).json({ 
      success: false, 
      message: "All fields are required [emailOrUsername & password]" 
    });
  }

  try {
    const userResult = await pool.query(
      'SELECT * FROM users WHERE email=$1 OR name=$1',
      [emailOrUsername]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User doesn't exist, please register!",
      });
    }

    const user = userResult.rows[0];

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      });
    }

    const payload = { userId: user.id, name: user.name, email: user.email };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Correct column name with quotes
    await pool.query('UPDATE users SET "refreshToken"=$1 WHERE id=$2', [refreshToken, user.id]);

    res.json({
      success: true,
      message: "Login successful",
      accessToken,
      refreshToken,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


export const refreshToken = async (req, res) => {
  const { token } = req.body;

  if (!token) return res.status(401).json({ message: 'No refresh token provided' });

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);


    const result = await pool.query('SELECT * FROM users WHERE id=$1 AND refreshtoken=$2', [decoded.id, token]);
    if (result.rows.length === 0) return res.status(403).json({ message: 'Invalid refresh token' });


    const accessToken = jwt.sign({ id: decoded.id, email: decoded.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });

    res.json({ accessToken });
  } catch (err) {
    console.error(err);
    res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
};
