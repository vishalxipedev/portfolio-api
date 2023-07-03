const { Schema } = require('mongoose');
const { softDeletePlugin } = require('soft-delete-plugin-mongoose');
const mongodb = require('mongoose');

const contactSchema = new Schema({
    name: { type: String, required:true },
    email: { type: String, required:true },
    phone: { type: Number, required:true },
    subject: { type: String },
    message: {type: String }
}, { timestamps: {} })

contactSchema.plugin(softDeletePlugin);

const contactModel = mongodb.model('contacts', contactSchema);

module.exports = contactModel;