const mongoose = require('mongoose')
const nanoid = require('nanoid')

const { Url } = require('../models/url.model');

const BASE_URL = "http://localhost:3000/"


const generateID = async (url, iter) => {
    // genereate id
    const nano = nanoid.customAlphabet(nanoid.urlAlphabet, 5)
    // const shorturl = nano()
    var shorturl = 'rRXc0'

    if (iter > 1 ){
        shorturl = nano();
    }

    const urlEntry = new Url({
        _id: shorturl,
        original: url,
        shortUrl: shorturl
    })

    return await urlEntry.save()
    .then(() => {
        return shorturl
    })
    .catch(err => {
        if (err.message.startsWith('E11000')) {
            console.error('Collision :', url);

            if (iter < 5) {
                return generateID(url, iter + 1)
            }
            else {
                throw new Error('Url cannot be generated');
            }
        }
    });
}

exports.generateNewUrl = async (req, res) => {
    const { url } = req.body;

    try {

        await generateID(url, 0).then((shorturl) => {
            return res.status(201).send({ url: BASE_URL + shorturl })
        });
    }
    catch (err) {
        console.log("🚀 ~ Error", err.message)

        return res.status(500).send({ error: err.message })
    }
}


exports.getOrignalUrl = async (req, res) => {
    const shorturl = req.param.id

    try {
        const entry = await Url.findById(shorturl);

        console.log(entry)
        return res.redirect(entry.original)
    }
    catch (err) {
        console.log("🚀 ~ Error", err.message)

        return res.status(500).send({ error: err.message })
    }
}