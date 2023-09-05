import { Router } from "express";
import * as CC from "./coupon.controller.js";
import { validation } from "../../middleware/validation.js";
import * as CV from "./coupon.Validation.js";
import { auth, role } from "../../middleware/auth.js";


const router = Router();

router.post(
    "/",
    auth(role.user),
    validation(CV.createCoupon),
    CC.createCoupon
);
router.put(
    "/:couponId",
    auth(role.user),
    validation(CV.updateCoupon),
    CC.updateCoupon
);



export default router;
