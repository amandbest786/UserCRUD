const express = require("express");
const router = express.Router()
const user = require('./userController')
const validation = require('./validations')
const authorization = require('./authorization')

router.post('/createUser', validation.userCreateValidation, user.createUser)
router.post('/userAuth', validation.userAuth, user.userAuth)
router.get('/getUser', validation.getUser, user.getUser)
router.put('/updateUser/:userId', authorization.userAuth, validation.updateUser, user.updateUser)
router.delete('/deleteUser/:userId', authorization.userAuth, validation.deleteUser, user.deleteUser)

module.exports = router;
