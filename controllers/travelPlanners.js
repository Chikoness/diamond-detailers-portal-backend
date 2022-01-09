const users = require('../models/users_schema');
const planners = require('../models/travel_planners_schema')
const travelPlannersRouter = require('express').Router();

const writePlanner = (req, res) => {
    const query = users.findOne({ email: req.body.email });
    query.exec(async (err, data) => {
        if (err) {
            console.log('Error: ' + err);
            return res.status(500).send({ message: 'Error: ' + err });
        }
        if (data) {
            let _planner = await planners.find({});

            var str = Object.keys(_planner).length
            var pad = Math.floor((Math.random() * 100) + 1);
            var id = data.fName + data.lName + "-" + pad + "-" + str

            const planner = new planners({
                id: id,
                destination: req.body.destination,
                from: req.body.from,
                until: req.body.until,
                typeOfTravel: req.body.typeOfTravel,
                plans: req.body.plans,
                reminderNote: req.body.reminderNote,
                email: req.body.email,
            });
            
            const saved = await planner.save();

            if (saved) {
                console.log('Planner to ' + req.body.destination + ' created!')
                return res.status(200).send({ message: 'Planner to' + req.body.destination + ' created!'});
            }
        }

        return res.status(404).send({ message: 'User doesn\'t exist' });
    });
}

const getPlanners = (req, res) => {
    const query = users.findOne({ email: req.query.email });
    query.exec(async (err, data) => {
        if (err) {
            return res.status(500).send({ message: 'Error: ' + err });
        }

        if (data) {
            let planner = await planners.find({ email: req.query.email });

            return res.status(200).send({
                message: `All planners from user ${req.query.email}`,
                data: planner
            })
        }

        return res.status(404).send({ message: 'User doesn\'t exist' });
    });
}

const getOnePlanner = (req, res) => {
    const query = planners.findOne({ id: req.query.id });
    query.exec(async (err, data) => {
        if (err) {
            return res.status(500).send({ message: 'Error: ' + err });
        }

        if (data) {
            return res.status(200).send({
                data: data
            })
        }

        return res.status(404).send({ message: 'Planner doesn\'t exist' });
    });
}

const editPlanner = (req, res) => {
    const query = planners.findOne({ id: req.body.id });
    query.exec(async (err, data) => {
        if (err) {
            return res.status(500).send({ message: 'Error: ' + err });
        }

        if (data) {
            let planner = await planners.updateMany(
                { id: req.body.id },
                { $set: {
                    destination: req.body.destination,
                    from: req.body.from,
                    until: req.body.until,
                    typeOfTravel: req.body.typeOfTravel,
                    plans: req.body.plans,
                    reminderNote: req.body.reminderNote,
                }
            })
            
            if (planner) {
                return res.status(200).send({
                    message: `Planner ${req.body.id} edited!`
                });
            }

            return res.status(500).send({ message: 'Error: ' + err });
        }

        return res.status(404).send({ message: 'Planner doesn\'t exist' });
    });
}

const deleteOnePlanner = (req, res) => {
    const query = planners.findOne({ id: req.query.id });
    query.exec(async (err, data) => {
        if (err) {
            return res.status(500).send({ message: 'Error: ' + err });
        }

        if (data) {
            let planner = await planners.deleteOne({ 
                id: req.query.id 
            });            

            if (planner) {
                return res.status(200).send({
                    message: `Planner ${req.query.id} deleted!`
                });
            }

            return res.status(500).send({ message: 'Error: ' + err });
        }

        return res.status(404).send({ message: 'Planner doesn\'t exist' });
    });
}

travelPlannersRouter
	.post('/writeplanner', async(req, res) => {
		return writePlanner(req, res);
	})

travelPlannersRouter
    .get('/getPlanners', async(req, res) => {
        return getPlanners(req, res);
    })

travelPlannersRouter
    .get('/planner', async(req, res) => {
        return getOnePlanner(req, res);
    })

travelPlannersRouter
    .post('/planner', async(req, res) => {
        return editPlanner(req, res);
    })

travelPlannersRouter
    .delete('/planner', async(req, res) => {
        return deleteOnePlanner(req, res);
    })

module.exports = travelPlannersRouter;