const contact = require('../models/Contact');
const { checkValidation } = require("../common/validation");
const { _trans } = require('../common/helper');

const sendMessage = (req, res) => {

    if(errors = checkValidation(req, res)) { return res.status(412).json(errors); }

    let data = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        subject: req.body.subject ? req.body.subject : '',
        message: req.body.message ? req.body.message : ''
    }

    try {
        if(contact.create(data)){
            res.send({
                status: true,
                message: _trans('message_sent')
            })
        }else{
            res.send({
                status: false,
                message: _trans('something_wrong')
            })
        }
    } catch (error) {
        throw error;
    }

}

module.exports = {
    sendMessage
}