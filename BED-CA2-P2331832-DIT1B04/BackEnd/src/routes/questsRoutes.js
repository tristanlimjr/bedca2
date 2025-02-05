const express = require('express');
const router = express.Router();

const controller = require("../controllers/questsController")

router.post("/", controller.createQuest)
router.get("/", controller.readAll)


module.exports = router;