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
  const query = appointment.find({ email: req.body.email })
  query.exec(async (err, data) => {
    if (err) {
      console.log('Error: ' + err)
      return res.status(500).send({ message: 'Error: ' + err })
    }

    if (data) {
      let weatherDistance = data.weatherDistance

      if (
        (data.weatherDistance.lat == req.body.distance.lat &&
        data.weatherDistance.long == req.body.distance.long) || weatherDistance.length < 1
      ) {
        let weaDis = await customers.updateOne(
          { id: req.body.id },
          {
            $set: {
              weatherDistance: weatherDistance
            }
          }
        )

        if (weaDis) {
          return res.status(200).send({
            message:
              'New distance: ' +
              req.body.distance.lat +
              ', ' +
              req.body.distance.long +
              '.'
          })
        }
      } else {
        return res.status(200).send({
            message: "No distance change."
        })
      }
    }
  })
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
