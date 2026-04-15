import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import aiRouter from "./ai";
import billingRouter from "./billing";
import adminRouter from "./admin";
import configRouter from "./config";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/ai", aiRouter);
router.use("/billing", billingRouter);
router.use("/admin", adminRouter);
router.use(configRouter);

export default router;
