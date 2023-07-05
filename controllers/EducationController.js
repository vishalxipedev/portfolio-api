const { _trans } = require("../common/helper");
const { checkValidation } = require("../common/validation");
const UserMetas = require("../models/UserMetas");

const addUpdateEducation = async (req, res) => {

    if(errors = checkValidation(req)) { return res.status(422).json(errors) }

    let data = {
        education_type: req.body.education_type,
        from_year: req.body.from_year,
        to_year: req.body.to_year,
        college_name: req.body.college_name,
        education_description: req.body.education_description
    }

    try {

        let updateData = await UserMetas.findOne({ "user_id": req.body._id });
        let userMeta = await UserMetas.findById(updateData?._id);

        if(!req.body.data_id){
            
            userMeta?.educations.push(data)

        }else{
            
            userMeta?.educations?.map((element, index) => {
                if (element._id.toString() === req.body.data_id) {
                    userMeta.educations[index] = data
                }
            })

        }
        let saveOrUpdateData = userMeta.save()

        if(saveOrUpdateData && !req.body.data_id) {
            res.send({
                status: true,
                message: _trans('add_education_successfully')
            })
        }else if(saveOrUpdateData && req.body.data_id){
            res.send({
                status: true,
                message: _trans('update_education_successfully')
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

const deleteEducation = async (req, res) => {

    if(req.body.data_id) {
        
        let response = await UserMetas.findOneAndUpdate({ user_id: req.body._id }, { $pull: { educations: {_id: req.body.data_id} }});

        if(response){
            res.send({
                status: true,
                message: _trans('delete_education'),
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
    addUpdateEducation,
    deleteEducation
}