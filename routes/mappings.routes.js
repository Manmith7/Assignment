
import { Router } from "express";
import {
  assignDoctorToPatient,
  getAllMappings,
  getAllDoctorsAssignedToPatient,
  removeDoctorFromPatient
} from "../controllers/mappings.controllers.js"

const router = Router();

router.post('', assignDoctorToPatient);
router.get('', getAllMappings);
router.get('/:id', getAllDoctorsAssignedToPatient);
router.delete('/:id', removeDoctorFromPatient);

export default router;
