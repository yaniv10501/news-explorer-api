const router = require('express').Router();
const { getAllUsers, getUserMe } = require('../controllers/users');

router.get('/users/all', getAllUsers);

router.get('/users/me', getUserMe);

module.exports = router;
