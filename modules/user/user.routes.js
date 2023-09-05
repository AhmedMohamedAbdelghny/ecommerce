import { Router } from "express";
import * as UC from "./user.controller.js";
import { validation } from "../../middleware/validation.js";
import * as UV from "./user.Validation.js";
const router = Router();

router.post("/signUp", validation(UV.signUp), UC.signUp)
router.get("/confirmEmail/:token", validation(UV.confirmEmail), UC.confirmEmail)



















router.get("/refreashToken/:token", UC.refreashToken)
router.patch("/forgetPassword/", UC.forgetPassword)
router.patch("/resestPassword/:token", UC.resestPassword)
router.post("/signIn", UC.signIn)


export default router;
