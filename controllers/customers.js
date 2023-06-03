const customers = require("../models/customer_schema");
const customerRouter = require("express").Router();

const getCustomer = (req, res) => {
    console.log(req.body)
    const query = customers.findOne({ email: req.body.email });
    query.exec(async (err, data) => {
        if (err) {
            console.log("Error: " + err);
            return res.status(500).send({ message: "Error: " + err });
        }

        if (data) {
            return res.status(200).send({
                data
            });
        }

        return res.status(404).send({ message: "Customer does not exist. Please proceed to customer page to make your first booking to create your account!" });
    })
}

customerRouter.post('/get', async (req, res) => {
    return getCustomer(req, res);
})

module.exports = customerRouter;