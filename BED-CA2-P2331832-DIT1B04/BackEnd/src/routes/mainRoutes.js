const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');
const fitnessRoutes = require('./fitnessRoutes')
const partyRoutes = require('./partyRoutes')
const questsRoutes = require('./questsRoutes')
const authRoutes = require('./auth')
const reviewRoutes = require('./reviewRoutes')
const inventoryRoutes = require('./inventoryRoutes')
const colonyRoutes = require('./colonyRoutes')
const planetRoutes = require('./planetRoutes')

router.use("/users", userRoutes)
router.use("/challenges", fitnessRoutes)
router.use("/party", partyRoutes)
router.use("/quest", questsRoutes)
router.use("/auth", authRoutes);
router.use("/review", reviewRoutes);
router.use("/i", inventoryRoutes)
router.use("/colony", colonyRoutes)
router.use("/planet", planetRoutes)


module.exports = router;    