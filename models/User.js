const { Schema } = require('mongoose');
const { softDeletePlugin } = require('soft-delete-plugin-mongoose');
const mongodb = require('mongoose');

const usersSchema = new Schema({
    first_name: { type: String, required:true,},
    last_name: { type: String, required:true,},
    email: { type: String, required:true, unique: true },
    phone: { type: Number, required:true, unique: true },
    job_title: { type: String, default: null },
    city: { type: String, default:null },
    state: { type: String, default:null },
    zip_code: { type: Number, default:0 },
    country: { type: String, default:null },
    password: { type: String, required:true }
}, { timestamps: {} });

usersSchema.plugin(softDeletePlugin);

const User = mongodb.model('users', usersSchema);

module.exports = User;