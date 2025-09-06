import pool from '../config/db.js';

// Create a new patient
export const createPatient = async (req, res) => {
  try {
    const user = req.user;
    //console.log('====================================');
    //console.log("user",user);
    //console.log('====================================');
    const { name, age, gender, email, mobile, address, date_of_birth } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Name is required and must be a non-empty string' });
    }

    if (!age || isNaN(age) || age <= 0) {
      return res.status(400).json({ success: false, message: 'Age is required and must be a positive number' });
    }

    if (!gender || !['male', 'female', 'other'].includes(gender.toLowerCase())) {
      return res.status(400).json({ success: false, message: 'Gender is required and must be one of "male", "female", "other"' });
    }

    if (!mobile || !/^\d{10}$/.test(mobile)) {
      return res.status(400).json({ success: false, message: 'Mobile is required and must be a 10-digit number' });
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Email format is invalid' });
    }

    if (date_of_birth && isNaN(Date.parse(date_of_birth))) {
      return res.status(400).json({ success: false, message: 'Date of birth format is invalid' });
    }

    // Insert into database
    const result = await pool.query(
      `INSERT INTO patients (name, age, gender, email, mobile, address, date_of_birth, user_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [name, age, gender, email || null, mobile, address || null, date_of_birth || null,user.userId]
    );
    //console.log('====================================');
    //console.log("result",result);
    //console.log('====================================');
    res.status(201).json({ success: true, patient: result.rows[0] });
  } catch (err) {
    console.error("err,",err);
    res.status(500).json({ success: false, message: 'Server error',errors:err});
  }
};


// Get all patients
export const getAllPatients = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM patients');
    res.status(200).json({ success: true, patients: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get a single patient by ID
export const getPatient = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM patients WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    res.status(200).json({ success: true, patient: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update patient details
export const modifyPatient = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, gender, email, mobile, address, date_of_birth } = req.body;

    // Validate input fields
    if (name !== undefined && (typeof name !== 'string' || name.trim().length === 0)) {
      return res.status(400).json({ success: false, message: 'Name must be a non-empty string' });
    }

    if (age !== undefined && (isNaN(age) || age <= 0)) {
      return res.status(400).json({ success: false, message: 'Age must be a positive number' });
    }

    if (gender !== undefined && !['male', 'female', 'other'].includes(gender.toLowerCase())) {
      return res.status(400).json({ success: false, message: 'Gender must be one of "male", "female", "other"' });
    }

    if (mobile !== undefined && !/^\d{10}$/.test(mobile)) {
      return res.status(400).json({ success: false, message: 'Mobile must be a 10-digit number' });
    }

    if (email !== undefined && email !== null && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Email format is invalid' });
    }

    if (date_of_birth !== undefined && date_of_birth !== null && isNaN(Date.parse(date_of_birth))) {
      return res.status(400).json({ success: false, message: 'Date of birth format is invalid' });
    }

    const result = await pool.query(
      `UPDATE patients SET
        name = COALESCE($1, name),
        age = COALESCE($2, age),
        gender = COALESCE($3, gender),
        email = COALESCE($4, email),
        mobile = COALESCE($5, mobile),
        address = COALESCE($6, address),
        date_of_birth = COALESCE($7, date_of_birth)
       WHERE id = $8
       RETURNING *`,
      [name, age, gender, email, mobile, address, date_of_birth, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    res.status(200).json({ success: true, patient: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


// Delete a patient
export const destroyPatient = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM patients WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    res.status(200).json({ success: true, message: 'Patient deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
