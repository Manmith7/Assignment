import { Router } from "express";
import { verifyAccessToken } from "../middlewares/verifyToken.js";
import { createPatient,getAllPatients,getPatient,modifyPatient,destroyPatient } from "../controllers/patient.controller.js";
const router  = Router()


router.post('',verifyAccessToken,createPatient);
router.get('',verifyAccessToken,getAllPatients);
router.get('/:id',verifyAccessToken,getPatient);
router.put('/:id',verifyAccessToken,modifyPatient);
router.delete('/:id',verifyAccessToken,destroyPatient)

export default router