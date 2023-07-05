const express = require('express');
const routes = express.Router()

const { loginUser, userInfo, userDetails, updateUserDetails } = require('../controllers/UserController');

const { sendMessage } = require('../controllers/CommonController');

const { emailValidation, passwordValidation, onlyTextValidation, phoneValidation } = require('../common/validation');
const { authenticate } = require('../common/helper');
const { updateExperience, deleteExperience } = require('../controllers/ExperienceController');
const { addUpdateEducation } = require('../controllers/EducationController');

// User Routes

routes.post('/login-user', 
    emailValidation('email'), 
    passwordValidation('password'),
loginUser);

routes.get('/user-info', authenticate, userInfo);

routes.get('/user-details', authenticate, userDetails);

routes.post('/update-user-details', authenticate, updateUserDetails);

// Experience Routes

routes.post('/add-update-experience',

onlyTextValidation('company_name'),
onlyTextValidation('job_title'),
onlyTextValidation('from_year'),
onlyTextValidation('job_description'),

authenticate, updateExperience);

routes.post('/delete-experience',
authenticate, 
deleteExperience);

// Education Routes

routes.post('/add-update-education',

onlyTextValidation('education_type'),
onlyTextValidation('from_year'),
onlyTextValidation('to_year'),
onlyTextValidation('college_name'),
onlyTextValidation('education_description'),

authenticate, 
addUpdateEducation);

// Contact Routes

routes.post('/contact-message',
    onlyTextValidation('name'),
    emailValidation('email'),
    phoneValidation('phone'),
sendMessage);

module.exports = routes