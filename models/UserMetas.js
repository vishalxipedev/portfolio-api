const { Schema } = require('mongoose');
const { softDeletePlugin } = require('soft-delete-plugin-mongoose');
const mongodb = require('mongoose');

const usermetas = new Schema({
    user_id: { type: String, ref:"user", required:true,},
    social_media_details: [{ type: Array, default: null}],
    about_us: { type: String, default: null },
    experiences: [{ type: Array, default: null }],
    qualifications: [{ type: Array, default: null }],
    profile_pic: { type: String, default:null }
}, { timestamps: {} });

usermetas.plugin(softDeletePlugin);

const UserMetas = mongodb.model('usermetas', usermetas);

module.exports = UserMetas;