const { checkValidation } = require("../common/validation")

const addUpdateEducation = (req, res) => {

    if(errors = checkValidation(req)) { return res.status(422).json(errors) }

    let data = {
        education_type: req.body.education_type,
        from_year: req.body.from_year,
        to_year: req.body.to_year,
        college_name: req.body.college_name,
        education_description: req.body.education_description
    }



}

module.exports = {
    addUpdateEducation
}