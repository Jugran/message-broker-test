
const { testData, Income } = require('../models/testData')


exports.saveData = async (req, res) => {
    const session = await testData.startSession();

    try {
        const { name, phone, income, company } = req.body;

        session.startTransaction();

        const incomeData = new Income({ income, companyName: company });

        const data = new testData({
            name: name,
            phoneNumber: phone,
            income: incomeData
        })

        await Promise.all([
            incomeData.save({ session }),
            data.save({ session })
        ]);

        await session.commitTransaction();
        session.endSession();
        console.log("🚀 data saved")
        return res.status(201).send({ message: "data saved" })

    }
    catch (error) {
        console.error('Error occured while saving data', error.message, error.stack);

        await session.abortTransaction();
        session.endSession();
        return res.status(500).send({ error: "cannot save data" })
    }
}


exports.getData = async (req, res) => {
    try {
        const { phone } = req.body;
        const data = await testData.findOne({ phoneNumber: phone }, { '_id': false, '__v': false })
            .populate("income", { income: 1, companyName: 1, _id: 0 })

        return res.status(200).send({ data: data })

    }
    catch (error) {
        console.error('Error occured while fetching data', error.message, error.stack);
        return res.status(500).send({ error: "cannot retrieve data" })
    }
}