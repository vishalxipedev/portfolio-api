const { Schema } = require('mongoose');
const { softDeletePlugin } = require('soft-delete-plugin-mongoose');
const mongodb = require('mongoose');

const usermetas = new Schema({
    user_id: { type: mongodb.Schema.Types.ObjectId, ref:"user", required:true,},
    social_media_details: [{ type: Array, default: null}],
    about_us: { type: String, default: null },
    experiences: [
        {
            company_name:{ type: String, default: "" }, 
            job_title:{ type: String, default: "" },
            from_year:{ type: String, default: "" },
            to_year:{ type: String, default: "" },
            job_description:{ type: String, default: "" }
        }
    ],
    qualifications: [{ type: Array, default: null }],
    profile_pic: { type: String, default:null }
}, { timestamps: {} });

usermetas.plugin(softDeletePlugin);

const UserMetas = mongodb.model('usermetas', usermetas);

module.exports = UserMetas;