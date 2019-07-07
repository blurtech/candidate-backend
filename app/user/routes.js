const express = require('express');
const passport = require('passport');
const authenticateMiddleware = require('../../middlewares/authenticateMiddleware');
const router = express.Router();

require('./model');
const controller = require('./controllers');

router.post('/', controller.login);

router.get('/', authenticateMiddleware, controller.tryWithJWT);

router.get('/profile', authenticateMiddleware, controller.currentUser);

router.get('/initiatives', authenticateMiddleware, controller.userInitiatives);

router.get('/positive', authenticateMiddleware, controller.positiveSwipes);

router.patch('/profile', authenticateMiddleware, controller.editProfile);

router.post('/register', controller.register);

router.get('/rating', authenticateMiddleware, controller.userRating);

router.get('/exp', authenticateMiddleware, controller.userExperience);
/**
 * Export a router with paths
 * POST: /
 * GET: /profile
 * PATCH: /profile
 */

module.exports = router;
