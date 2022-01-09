const mongoose = require('mongoose')


const urlSchema = mongoose.Schema({
    _id: String,
    original: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        unique: true,
        required: true,
        index: true
    }
}, { _id: false })


exports.Url = mongoose.model('url', urlSchema)