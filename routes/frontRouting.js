const express = require('express')
const { userDetails } = require('../controllers/FrontController')
const routing = express.Router()

routing.get('/get-user-details', userDetails);

module.exports = routing