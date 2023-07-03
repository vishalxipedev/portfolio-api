const User = require("../models/User");
const UserMetas = require("../models/UserMetas");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const { _trans } = require('../common/helper');
const { checkValidation } = require("../common/validation");


const loginUser = async (req, res) => {

    if(errors = checkValidation(req, res)) { return res.status(412).json(errors); }

    let user_data = await User.findOne({ email: req.body.email });

    if(user_data){

        let passwordvalid = await bcrypt.compareSync(req.body.password, user_data.password);

        if(!passwordvalid) {
            res.send({
                status: false,
                message: _trans('invalid_account')
            })
        }else{
            let token = await jwt.sign({ id: user_data.id }, process.env.TOKEN_SECRET , { expiresIn: 86400 });

            let user_info = {
                first_name: user_data.first_name,
                last_name: user_data.last_name,
                email: user_data.email,
                phone: user_data.phone,
                job_title: user_data.job_title,
                access_token: token
            }
            res.send({
                status: true,
                data: user_info
            });
        }

    }else{
        res.send({
            status: false,
            message: _trans('invalid_account')
        })
    }
}

const userInfo = async (req, res) => {
    if(req.user && req.user.id) {
        const user_details = await User.findOne({_id: req.user.id});
        if(user_details){
            res.send({
                status: true,
                data: user_details
            });
        }else{
            res.send({
                status: false,
                message: _trans("user_does_not_exists")
            })
        }
    }
}

const userDetails = async (req, res) => {
    
    const user_details = await UserMetas.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "user_id",
                foreignField: "_id",
                as:"user_metas"
            }
            
        },{$unwind: '$user_metas'}
    ]);

    if(user_details){
        res.send({
            status: true,
            data: user_details[0]
        });
    }else{
        res.send({
            status: false,
            message: _trans("user_does_not_exists")
        })
    }
}


const updateUserDetails = async (req, res) => {
    let data = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        phone: req.body.phone,
        job_title: req.body.job_title,
    }
    try{
       let updated_result = await User.findByIdAndUpdate({_id: req.body._id}, {$set: data});
        if(updated_result){
            res.send({
                status: true,
                message: _trans('user_updated_successfully')
            })
        }else{
            res.send({
                status: false,
                message: _trans('something_wrong')
            })
        }
        
    }catch(err) {
        console.log(err);
    }
}

module.exports = {
    loginUser,
    userInfo,
    userDetails,
    updateUserDetails
}