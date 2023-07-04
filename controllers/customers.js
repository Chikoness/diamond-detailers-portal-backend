const customers = require('../models/customer_schema')
const appointment = require('../models/appointment_schema')

const customerRouter = require('express').Router()

const getCustomer = (req, res) => {
  const query = customers.findOne({ email: req.body.email })
  query.exec(async (err, data) => {
    if (err) {
      console.log('Error: ' + err)
      return res.status(500).send({ message: 'Error: ' + err })
    }

    if (data) {
      return res.status(200).send({
        data
      })
    }

    return res.status(404).send({
      message:
        'Customer does not exist. Please proceed to customer page to make your first booking to create your account!'
    })
  })
}

const getAllCustomerDirtInfo = (req, res) => {
  const query = appointment.find({ email: req.body.email })
  query.exec(async (err, data) => {
    if (err) {
      console.log('Error: ' + err)
      return res.status(500).send({ message: 'Error: ' + err })
    }

    if (data) {
      return res.status(200).send({
        data
      })
    }

    return res
      .status(404)
      .send({ message: 'No history for this customer yet.' })
  })
}

const getCustomerWeatherDistance = (req, res) => {
  const query = customers.findOne({ email: req.body.email })
  query.exec(async (err, data) => {
    if (err) {
      console.log('Error: ' + err)
      return res.status(500).send({ message: 'Error: ' + err })
    }

    if (data) {
      let weatherDistance = data.weatherDistance

      // weatherDistance has not been created before
      if (weatherDistance == undefined || Object.keys(weatherDistance).length < 1) {

        let newWeatherDistance = {
            old: {
                lat: req.body.weatherDistance.lat,
                long: req.body.weatherDistance.long,
                weather: req.body.weatherDistance.weather,
                distance: 0
            },
            new: {
                lat: req.body.weatherDistance.lat,
                long: req.body.weatherDistance.long,
                weather: req.body.weatherDistance.weather,
                distance: 0
            },
            distance: 0
        }

        let weaDis = await customers.updateOne(
          { email: req.body.email },
          {
            $set: {
              weatherDistance: newWeatherDistance
            }
          }
        )

        if (weaDis) {
          return res.status(200).send({
            message:
              'New distance: ' + req.body.weatherDistance.lat + ', ' + req.body.weatherDistance.long + '.'
          })
        }
      } else {
        // has been created before

        // weather and distance is the same
        if (data.weatherDistance.new.lat == req.body.weatherDistance.lat && data.weatherDistance.new.long == req.body.weatherDistance.long) {

            return res.status(200).send({
                message: "No distance change."
            })
        }

        // weather and distance has changed from previously, move current lat, long and weather into old and rewrite new

        // but first, calculate the distance travelled
        const latOld = data.weatherDistance.new.lat;
        const latNew = req.body.weatherDistance.lat;
        const longOld = data.weatherDistance.new.long
        const longNew = req.body.weatherDistance.long

        // use distance() function to calculate distance travelled
        let distanceTravelled = distance(latOld, latNew, longOld, longNew);
        let allTravelDistance = 0;

        if (data.weatherDistance.distance == 0) {
            // total distance travelled not recorded before
            allTravelDistance = distanceTravelled
        } else {
            // has been recorded before
            allTravelDistance = data.weatherDistance.distance + distanceTravelled;
        }

        let newWeatherDistance = {
            old: {
                lat: latOld,
                long: longOld,
                weather: data.weatherDistance.new.weather,
                distance: data.weatherDistance.new.distance
            },
            new: {
                lat: latNew,
                long: longNew,
                weather: req.body.weatherDistance.weather,
                distance: distanceTravelled
            },
            distance: allTravelDistance
        }

        let weaDis = await customers.updateOne(
            { email: req.body.email },
            {
              $set: {
                weatherDistance: newWeatherDistance
              }
            }
          )
  
          if (weaDis) {
            return res.status(200).send({
              message:
                'New distance: ' + req.body.weatherDistance.lat + ', ' + req.body.weatherDistance.long + '.'
            })
          }
      }
    }
  })
}

const distance = (lat1, lat2, lon1, lon2) => {
  // The math module contains a function
  // named toRadians which converts from
  // degrees to radians.
  lon1 = (lon1 * Math.PI) / 180
  lon2 = (lon2 * Math.PI) / 180
  lat1 = (lat1 * Math.PI) / 180
  lat2 = (lat2 * Math.PI) / 180

  // Haversine formula
  let dlon = lon2 - lon1
  let dlat = lat2 - lat1
  let a =
    Math.pow(Math.sin(dlat / 2), 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2)

  let c = 2 * Math.asin(Math.sqrt(a))

  // Radius of earth in kilometers. Use 3956
  // for miles
  let r = 6371

  // calculate the result
  return c * r
}



customerRouter.post('/get', async (req, res) => {
  return getCustomer(req, res)
})

customerRouter.post('/getDirtInfo', async (req, res) => {
  return getAllCustomerDirtInfo(req, res)
})

customerRouter.post('/getWeatherDistance', async (req, res) => {
  return getCustomerWeatherDistance(req, res)
})

module.exports = customerRouter
