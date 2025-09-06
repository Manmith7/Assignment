import pool from '../config/db.js';

// Assign doctor to patient
export const assignDoctorToPatient = async (req, res) => {
    try {
        const { patientId, doctorId } = req.body;

        if (!patientId || !doctorId) {
            return res.status(400).json({ success: false, message: 'patientId and doctorId are required' });
        }

        if (isNaN(patientId) || patientId <= 0 || isNaN(doctorId) || doctorId <= 0) {
            return res.status(400).json({ success: false, message: 'patientId and doctorId must be positive integers' });
        }

        const patientResult = await pool.query('SELECT * FROM patients WHERE id = $1', [patientId]);
        if (patientResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Patient not found' });
        }

        const doctorResult = await pool.query('SELECT * FROM doctors WHERE id = $1', [doctorId]);
        if (doctorResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }

        const result = await pool.query(
            `INSERT INTO mappings (patientid, doctorid)
       VALUES ($1, $2)
       ON CONFLICT (patientid, doctorid) DO NOTHING
       RETURNING *`,
            [patientId, doctorId]
        );

        if (result.rows.length === 0) {
            return res.status(200).json({ success: true, message: 'Mapping already exists' });
        }

        res.status(201).json({ success: true, mapping: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get all mappings
export const getAllMappings = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT m.id, p.name AS patient_name, d.name AS doctor_name, m."createdAt"
   FROM mappings m
   JOIN patients p ON m.patientid = p.id
   JOIN doctors d ON m.doctorid = d.id
   ORDER BY m."createdAt" DESC`
        );

        res.status(200).json({ success: true, mappings: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get all doctors assigned to a patient
export const getAllDoctorsAssignedToPatient = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            `SELECT d.id, d.name, d.email, d.specialization, d.mobile
       FROM mappings m
       JOIN doctors d ON m.doctorid = d.id
       WHERE m.patientid = $1`,
            [id]
        );
        res.status(200).json({ success: true, doctors: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Remove a doctor from a patient
export const removeDoctorFromPatient = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            `DELETE FROM mappings WHERE id = $1 RETURNING *`,
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Mapping not found' });
        }
        res.status(200).json({ success: true, message: 'Mapping removed', mapping: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
