import express from 'express'

import {register,login} from '../controllers/authController.js'

const router = express.Router();

//registering users
router.post('/register',register);

//login users
router.post('/login',login)

export default router