const express = require('express');
const routes = express.Router()

const { loginUser, userInfo, userDetails, updateUserDetails, addExperience, updateExperience } = require('../controllers/UserController');

const { sendMessage } = require('../controllers/CommonController');

const { emailValidation, passwordValidation, onlyTextValidation, phoneValidation } = require('../common/validation');
const { authenticate } = require('../common/helper');

// User Routes

routes.post('/login-user', 
    emailValidation('email'), 
    passwordValidation('password'),
loginUser);

routes.get('/user-info', authenticate, userInfo);

routes.get('/user-details', authenticate, userDetails);

routes.post('/update-user-details', authenticate, updateUserDetails);

routes.post('/add-update-experience',

onlyTextValidation('company_name'),
onlyTextValidation('job_title'),
onlyTextValidation('from_year'),
onlyTextValidation('job_description'),

authenticate, updateExperience);

// Contact Routes

routes.post('/contact-message',
    onlyTextValidation('name'),
    emailValidation('email'),
    phoneValidation('phone'),
sendMessage);

module.exports = routes