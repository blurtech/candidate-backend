const express = require('express');
const passport = require('passport');
const authenticateMiddleware = require('../../middlewares/authenticateMiddleware');

const router = express.Router();

require('./model');
const controller = require('./controllers');

router.get('/', controller.getAll);

router.get('/:id', controller.getOne);

router.patch('/:id', authenticateMiddleware, controller.edit);

router.post('/create', authenticateMiddleware, controller.create);

router.post('/vote', authenticateMiddleware, controller.vote);

/**
 * Export a router with paths
 * GET: /
 * GET: /:id
 * PATCH: /:id
 * POST: /create
 * POST: /vote
 */
module.exports = router;
