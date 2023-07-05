const { _trans } = require("../common/helper");
const { checkValidation } = require("../common/validation");
const UserMetas = require("../models/UserMetas");

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
    updateExperience,
    deleteExperience
}