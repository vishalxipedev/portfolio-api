const bcrypt = require('bcrypt');
const message = require('./messages');
const { _ } = require('lodash');
const jwt = require('jsonwebtoken')

const bcryptPassword = async (password) => {
    if(password) {
        var encryptedpassword = await bcrypt.hash(password, 10).then();
        return encryptedpassword;
    }else{
        return 'Hello';
    }
}

const _trans = (key, input = '') => {
    return !input ? _.upperFirst(_.lowerCase(_.startCase(message[key]))) : _.upperFirst(_.replace(input, '_', ' ')) +' '+ message[key];
}

const authenticate = (req, res, next) => {

    let authHeader = req.headers['authorization'];
    let token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(401).send({ status: false, message: _trans('unauthorized') })

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {

        if (err) return res.status(403).send({ status: false, message: _trans('forbidden') })

        req.user = user

        next()
    })


}




module.exports = {
    bcryptPassword,
    _trans,
    authenticate
}