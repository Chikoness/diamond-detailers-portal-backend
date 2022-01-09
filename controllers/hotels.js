const users = require('../models/users_schema');
const hotels = require('../models/hotels_schema')
const hotelsRouter = require('express').Router();

const registerHotel = (req, res) => {
    const query = users.findOne({ email: req.body.email });
    query.exec(async (err, data) => {
        if (err) {
            console.log('Error: ' + err);
            return res.status(500).send({ message: 'Error: ' + err });
        }
        if (data) {
            let _hotel = await hotels.find({ email: req.body.email });

            var str = "" + Object.keys(_hotel).length
            var pad = "000"
            var id = "hotel-" + pad.substring(0, pad.length - str.length) + str

            const hotel = new hotels({
                id: id,
                name: req.body.name,
                description: req.body.description,
                phoneNo: req.body.phoneNo,
                email: req.body.email,
                websites: req.body.websites,
                star: req.body.star,
                rooms: req.body.rooms,
                facilities: req.body.facilities,
                address: req.body.address,
                state: req.body.state,
                country: req.body.country
            });
            
            const saved = await hotel.save();

            if (saved) {
                console.log('hotel ' + id + ' created!')
                return res.status(200).send({ message: 'hotel ' + id + ' created!'});
            }
        }

        return res.status(404).send({ message: 'User doesn\'t exist' });
    });
}

const getHotelsByState = (req, res) => {
    const query = hotels.find({ state: req.query.state });
    query.exec(async (err, data) => {
        if (err) {
            return res.status(500).send({ message: 'Error: ' + err });
        }

        if (data) {
            return res.status(200).send({
                message: `All hotels from ${req.query.state}`,
                data: data
            })
        }

        return res.status(404).send({ message: `No hotels registered for ${req.query.state}!` });
    });
}

const getHotelsByUser = (req, res) => {
    const query = hotels.find({ email: req.query.email });
    query.exec(async (err, data) => {
        if (err) {
            return res.status(500).send({ message: 'Error: ' + err });
        }

        if (data) {
            return res.status(200).send({
                message: `All hotels by ${req.query.email}`,
                data: data
            })
        }

        return res.status(404).send({ message: `No hotels registered for ${req.query.state}!` });
    });
}

const getOnehotel = (req, res) => {
    const query = hotels.findOne({ id: req.query.id });
    query.exec(async (err, data) => {
        if (err) {
            return res.status(500).send({ message: 'Error: ' + err });
        }

        if (data) {
            return res.status(200).send({
                data: data
            })
        }

        return res.status(404).send({ message: 'Hotel doesn\'t exist' });
    });
}

const editHotel = (req, res) => {
    const query = hotels.findOne({ id: req.body.id });
    query.exec(async (err, data) => {
        if (err) {
            return res.status(500).send({ message: 'Error: ' + err });
        }

        if (data) {
            let hotel = await hotels.updateMany(
                { id: req.body.id },
                { $set: {
                    name: req.body.name,
                    description: req.body.description,
                    phoneNo: req.body.phoneNo,
                    websites: req.body.websites,
                    star: req.body.star,
                    rooms: req.body.rooms,
                    facilities: req.body.facilities,
                    address: req.body.address,
                    state: req.body.state,
                    country: req.body.country
                }
            })
            
            if (hotel) {
                return res.status(200).send({
                    message: `Hotel ${req.body.id} edited!`
                });
            }

            return res.status(500).send({ message: 'Error: ' + err });
        }

        return res.status(404).send({ message: 'Hotel doesn\'t exist' });
    });
}

const deleteOneHotel = (req, res) => {
    const query = hotels.findOne({ id: req.query.id });
    query.exec(async (err, data) => {
        if (err) {
            return res.status(500).send({ message: 'Error: ' + err });
        }

        if (data) {
            let hotel = await hotels.deleteOne({ 
                id: req.query.id 
            });            

            if (hotel) {
                return res.status(200).send({
                    message: `hotel ${req.query.id} deleted!`
                });
            }

            return res.status(500).send({ message: 'Error: ' + err });
        }

        return res.status(404).send({ message: 'hotel doesn\'t exist' });
    });
}

hotelsRouter
	.post('/registerHotel', async(req, res) => {
		return registerHotel(req, res);
	})

hotelsRouter
    .get('/hotel/state', async(req, res) => {
        return getHotelsByState(req, res);
    })

hotelsRouter
    .get('/hotel/user', async(req, res) => {
        return getHotelsByUser(req, res);
    })

hotelsRouter
    .get('/hotel', async(req, res) => {
        return getOnehotel(req, res);
    })

hotelsRouter
    .post('/hotel', async(req, res) => {
        return editHotel(req, res);
    })

hotelsRouter
    .delete('/hotel', async(req, res) => {
        return deleteOneHotel(req, res);
    })

module.exports = hotelsRouter;