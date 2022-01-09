const mongoose = require('mongoose');


const testDataSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name is required']
    },
    phoneNumber: {
        type: Number,
        min: 4999999999,
        max: 9999999999,
        unique: true
    },
    income: {type: mongoose.Schema.Types.ObjectId, ref: "Income"}
})

const incomeSchema = mongoose.Schema({
    companyName: {
        type: String
    },
    income: {
        type: Number,
        required: true
    }
})

exports.Income = mongoose.model('Income', incomeSchema);

exports.testData = mongoose.model('TestData', testDataSchema);