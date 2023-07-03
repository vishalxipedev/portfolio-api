const { body, validationResult } = require("express-validator");
const { _trans } = require('./helper');


const emailValidation = (input) => {
    return body(input).isEmail().withMessage(_trans('email_not_valid')).trim();
}


const passwordValidation = (input) => {
    return body(input).isLength({ min: 8 }).trim().withMessage(_trans('password_length_invalid'));
}

const onlyTextValidation = (input) => {
    return body(input).notEmpty().withMessage(_trans('is_required', input));
}

const phoneValidation = (input) => {
    return body(input).notEmpty().withMessage(_trans('is_required', input)).isNumeric().withMessage(_trans('is_numeric', input));
}

const checkValidation = (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return {
            status: false,
            errors: errors.array()
        }
    } else {
        return false
    }
}

module.exports = {
    emailValidation,
    passwordValidation,
    checkValidation,
    onlyTextValidation,
    phoneValidation
}