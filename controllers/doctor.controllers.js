import Doctor from '../models/doctor.model.js';

export const createDoctor = async (req, res) => {
  try {
    const user = req.user
    const { name, email, specialization, mobile } = req.body;
    if (!name || !email || !mobile) {
      return res.status(400).json({ success: false, message: 'Name, email, and mobile are required' });
    }
    if (typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Name must be a string with at least 2 characters' });
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return res.status(400).json({ success: false, message: 'Email format is invalid' });
    }
    if (specialization && (typeof specialization !== 'string' || specialization.trim().length > 100)) {
      return res.status(400).json({ success: false, message: 'Specialization must be a string up to 100 characters' });
    }
    const mobilePattern = /^\d{10}$/;
    if (!mobilePattern.test(mobile)) {
      return res.status(400).json({ success: false, message: 'Mobile must be a valid 10-digit number' });
    }
    if (user.userId && (isNaN(user.userId) || Number(user.userId) <= 0)) {
      return res.status(400).json({ success: false, message: 'userId must be a positive integer' });
    }
    const existingDoctor = await Doctor.findOne({ where: { email } });
    if (existingDoctor) {
      return res.status(400).json({ success: false, message: 'Doctor with this email already exists' });
    }
    const doctor = await Doctor.create({
      name: name.trim(),
      email: email.trim(),
      specialization: specialization ? specialization.trim() : null,
      mobile: mobile.trim(),
      userId: user.userId || null
    });
    res.status(201).json({ success: true, doctor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.findAll();
    res.status(200).json({ success: true, doctors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findByPk(id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    res.status(200).json({ success: true, doctor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const modifyDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, specialization, mobile } = req.body;
    const doctor = await Doctor.findByPk(id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length < 2) {
        return res.status(400).json({ success: false, message: 'Name must be a string with at least 2 characters' });
      }
      doctor.name = name.trim();
    }
    if (email !== undefined) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        return res.status(400).json({ success: false, message: 'Email format is invalid' });
      }
      const existingDoctor = await Doctor.findOne({ where: { email } });
      if (existingDoctor && existingDoctor.id !== doctor.id) {
        return res.status(400).json({ success: false, message: 'Another doctor with this email already exists' });
      }
      doctor.email = email.trim();
    }
    if (specialization !== undefined) {
      if (typeof specialization !== 'string' || specialization.trim().length > 100) {
        return res.status(400).json({ success: false, message: 'Specialization must be a string up to 100 characters' });
      }
      doctor.specialization = specialization.trim();
    }
    if (mobile !== undefined) {
      const mobilePattern = /^\d{10}$/;
      if (!mobilePattern.test(mobile)) {
        return res.status(400).json({ success: false, message: 'Mobile must be a valid 10-digit number' });
      }
      doctor.mobile = mobile.trim();
    }
    await doctor.save();
    res.status(200).json({ success: true, doctor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const destroyDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findByPk(id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    await doctor.destroy();
    res.status(200).json({ success: true, message: 'Doctor deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
