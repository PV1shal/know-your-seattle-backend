import express from 'express';
import blocksController from "./blocks.controller.js";

const router = express.Router();

router.route("/getBlocks").get(blocksController.apiGetBlocks);
router.route("/store").get(blocksController.apiStoreBlock);

export default router;