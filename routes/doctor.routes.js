import { createDoctor,getAllDoctors,getDoctorById,modifyDoctor,destroyDoctor } from "../controllers/doctor.controllers.js";

import { Router } from "express";
import { verifyAccessToken } from "../middlewares/verifyToken.js";

const router  = Router()

router.post('',verifyAccessToken,createDoctor)
router.get('',verifyAccessToken,getAllDoctors)
router.get('/:id',verifyAccessToken,getDoctorById);
router.put('/:id',verifyAccessToken,modifyDoctor);
router.delete('/:id',verifyAccessToken,destroyDoctor);

export default router;