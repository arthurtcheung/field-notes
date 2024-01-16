const express = require('express');

const userController = require('../controllers/userController.js');

const router = express.Router();

// Handle POST req to '/api/user/register' endpoint
router.post('/register', userController.registerUser, (req, res) => {
  return res.status(200).json(res.locals.userId);
});

module.exports = router;
