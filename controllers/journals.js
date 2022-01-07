const journals = require('../models/journals_schema');
const users = require('../models/users_schema');
const journalsRouter = require('express').Router();

const writeJournal = (req, res) => {
    const query = users.findOne({ email: req.body.email });
    query.exec(async (err, data) => {
        if (err) {
            console.log('Error: ' + err);
            return res.status(500).send({ message: 'Error: ' + err });
        }
        if (data) {
            let _journal = await journals.find({ email: req.body.email });

            var str = "" + Object.keys(_journal).length
            var pad = "000"
            var id = pad.substring(0, pad.length - str.length) + str
            
            let generateRandomId = data.fName.charAt(0) + '-' + id;

            const journal = new journals({
                title: req.body.title,
                id: generateRandomId,
                content: req.body.content,
                author: data.fName,
                email: req.body.email,
                date: req.body.date
            });
            
            const saved = await journal.save();

            if (saved) {
                console.log('Journal by user ' + data.fName + ' on ' + req.body.date + ' created!')
                return res.status(200).send({ message: 'Journal by user ' + data.fName + ' on ' + req.body.date + ' created!'});
            }
        }

        return res.status(404).send({ message: 'User doesn\'t exist' });
    });
}

const getOnlyUsersJournals = (req, res) => {
    const query = users.findOne({ email: req.query.email });
    query.exec(async (err, data) => {
        if (err) {
            return res.status(500).send({ message: 'Error: ' + err });
        }

        if (data) {
            let journal = await journals.find({ email: req.query.email });
            let j = await journals.findOne({ email: req.query.email });

            return res.status(200).send({
                message: `All journals from user ${j.author}`,
                journals: journal
            })
        }

        return res.status(404).send({ message: 'User doesn\'t exist' });
    });
}

const getOneJournal = (req, res) => {
    const query = journals.findOne({ id: req.query.id });
    query.exec(async (err, data) => {
        if (err) {
            return res.status(500).send({ message: 'Error: ' + err });
        }

        if (data) {
            return res.status(200).send({
                journal: data
            })
        }

        return res.status(404).send({ message: 'Journal doesn\'t exist' });
    });
}

journalsRouter
	.post('/writejournal', async(req, res) => {
		return writeJournal(req, res);
	})

journalsRouter
    .get('/user', async(req, res) => {
        return getOnlyUsersJournals(req, res);
    })

journalsRouter
    .get('/journal/', async(req, res) => {
        return getOneJournal(req, res);
    })

module.exports = journalsRouter;