const express = require('express');
const passport = require('passport');
const authenticateMiddleware = require('../../middlewares/authenticateMiddleware');
const router = express.Router();
const ctrl = require('./controllers');

router.get('/initiatives', ctrl.getAllOrgInitiatives);

router.get('/:username', authenticateMiddleware, ctrl.getInitiativesByOrg);

module.exports = router;
