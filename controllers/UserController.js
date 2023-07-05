const User = require("../models/User");
const UserMetas = require("../models/UserMetas");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
var mongoose = require('mongoose');
var objectId = mongoose.Types;

const { _trans } = require('../common/helper');
const { checkValidation } = require("../common/validation");


const loginUser = async (req, res) => {

    if (errors = checkValidation(req, res)) { return res.status(412).json(errors); }

    let user_data = await User.findOne({ email: req.body.email });

    if (user_data) {

        let passwordvalid = await bcrypt.compareSync(req.body.password, user_data.password);

        if (!passwordvalid) {
            res.send({
                status: false,
                message: _trans('invalid_account')
            })
        } else {
            let token = await jwt.sign({ id: user_data.id }, process.env.TOKEN_SECRET, { expiresIn: 86400 });

            let user_info = {
                user_id: user_data._id,
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

    } else {
        res.send({
            status: false,
            message: _trans('invalid_account')
        })
    }
}

const userInfo = async (req, res) => {
    if (req.user && req.user.id) {
        const user_details = await User.findOne({ _id: req.user.id });
        if (user_details) {
            res.send({
                status: true,
                data: user_details
            });
        } else {
            res.send({
                status: false,
                message: _trans("user_does_not_exists")
            })
        }
    }
}

const userDetails = async (req, res) => {

    const user_details = await User.aggregate([
        {
            $lookup: {
                from: "usermetas",
                localField: "_id",
                foreignField: "user_id",
                as: "user_metas"
            }

        }, { $unwind: '$user_metas' }
    ]);

    if (user_details) {
        res.send({
            status: true,
            data: user_details[0]
        });
    } else {
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

    let user_metas_data = {
        about_us: req.body.about_us
    }

    try {

        let updated_result = await User.findByIdAndUpdate({ _id: req.body._id }, { $set: data });

        if (updated_result) {
            await UserMetas.findOneAndUpdate({ user_id: req.body._id }, { $set: user_metas_data }, '');
            res.send({
                status: true,
                message: _trans('user_updated_successfully')
            })
        } else {
            res.send({
                status: false,
                message: _trans('something_wrong')
            })
        }

    } catch (err) {
        console.log(err);
    }
}

const addExperience = async (req, res) => {

    if (errors = checkValidation(req, res)) { return res.status(412).json(errors); }

    let data = {
        _id: new objectId.ObjectId(),
        company_name: req.body.company_name,
        job_title: req.body.job_title,
        from_year: req.body.from_year,
        to_year: req.body.to_year,
        job_description: req.body.job_description
    }

    try {

        let updateData = await UserMetas.findOneAndUpdate({ user_id: req.body._id }, { $push: { experiences: data } });

        if (updateData) {
            res.send({
                status: true,
                message: _trans('add_experience_successfully')
            })
        } else {
            res.send({
                status: false,
                message: _trans('something_wrong')
            })
        }

    } catch (error) {
        console.log(error);
    }

}

const updateExperience = async (req, res) => {

    if (errors = checkValidation(req, res)) { return res.status(412).json(errors); }

    let data = {
        company_name: req.body.company_name,
        job_title: req.body.job_title,
        from_year: req.body.from_year,
        to_year: req.body.to_year,
        job_description: req.body.job_description,
    }

    try {

        let updateData = await UserMetas.findOne({ "user_id": req.body._id });
        let userMeta = await UserMetas.findById(updateData?._id);

        if(!req.body.data_id){
            
            userMeta?.experiences.push(data)

        }else{
            
            userMeta?.experiences?.map((element, index) => {
                if (element._id.toString() === req.body.data_id) {
                    userMeta.experiences[index] = data
                }
            })

        }
        let saveOrUpdateData = userMeta.save()

        if(saveOrUpdateData && !req.body.data_id) {
            res.send({
                status: true,
                message: _trans('add_experience_successfully')
            })
        }else if(saveOrUpdateData && req.body.data_id){
            res.send({
                status: true,
                message: _trans('update_experience_successfully')
            })
        }else{
            res.send({
                status: false,
                message: _trans('something_wrong')
            })
        }

    } catch (error) {
        console.log(error);
    }

}

const deleteExperience = async (req, res) => {

    if(req.body.data_id) {
        let response = await UserMetas.findOneAndUpdate({ user_id: req.body._id }, { $pull: { experiences: {_id: req.body.data_id} }});

        if(response){
            res.send({
                status: true,
                message: _trans('delete_experience'),
            })
        }else{
            res.send({
                status: false,
                message: _trans('something_wrong')
            })
        }

    }else{
        res.send({
            status: false,
            message: _trans('missing_parameter')
        })
    }


}

module.exports = {
    loginUser,
    userInfo,
    userDetails,
    updateUserDetails,
    addExperience,
    updateExperience,
    deleteExperience
}