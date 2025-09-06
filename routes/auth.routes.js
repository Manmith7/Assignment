import { Router } from "express";
import { Register,Login } from "../controllers/auth.controllers.js";
const router  = Router()

router.post("/register",Register);
router.post("/login",Login);
router.get("/",()=>{
    //console.log('====================================');
    //console.log("IN auth routes");
    //console.log('====================================');
})

export default router