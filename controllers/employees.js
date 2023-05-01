// const config = require("../utils/config");
const employees = require("../models/employees_schema");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");
const employeesRouter = require("express").Router();

const createEmployee = (req, res) => {
  const query = employees.findOne({ icNumber: req.body.icNumber });
  query.exec(async (err, user) => {
    if (err) {
      console.log("Error: " + err);
      return res.status(500).send({ message: "Error: " + err });
    }
    if (user) {
      return res.status(400).send({ message: "Employee already exists!" });
    }

    // const hash = await bcrypt.hash(req.body.password, 10);
    const u = new employees({
      name: req.body.name,
      icNumber: req.body.icNumber,
      phoneNo: req.body.phoneNo,
      email: req.body.email,
      address: req.body.address ? req.body.address : '',
      position: req.body.position,
      securityLvl: req.body.securityLvl
    });
    const saved = await u.save();
    if (saved) {
      return res.status(200).send({ message: "Employee successfully created!" });
    }
    return res.status(500).send({ message: "Something went wrong..." });
  });
};

const authenticateEmployee = (req, res) => {
  const query = employees.findOne({ icNumber: req.body.icNumber });
  query.exec(async (err, user) => {
    if (err) {
      console.log("Error: " + err);
      return res.status(500).send({ message: "Error: " + err });
    }
    if (user) {
      return res.status(200).send({
        message: "Successfully logged in!",
        name: user.name,
        icNumber: user.icNumber,
        securityLvl: user.securityLvl,
      });
    }
    return res.status(400).send({ message: "Employee does not exist!" });
  });
};

// const getUserDetails = (req, res) => {
//   const query = employees.findOne({ email: req.query.email });
//   query.exec(async (err, user) => {
//     if (err) {
//       return res.status(500).send({ message: "Error: " + err });
//     }

//     if (user) {
//       return res.status(200).send({
//         fName: user.fName,
//         lName: user.lName,
//         gender: user.gender,
//         type: user.type,
//         phoneNo: user.phoneNo,
//         dob: user.dob,
//         address: user.address,
//         state: user.state,
//         country: user.country,
//         email: user.email,
//       });
//     }

//     return res.status(400).send({ message: "User does not exist!" });
//   });
// };

// const getNumberOfemployees = (req, res) => {
//   const query = employees.find({});
//   query.exec(async (err, user) => {
//     if (err) {
//       return res.status(500).send({ message: "Error: " + err });
//     }

//     if (user) {
//       num = Object.keys(user).length;

//       return res.status(200).send({
//         num: num,
//       });
//     }

//     return res.status(400).send({ message: "User does not exist!" });
//   });
// };

employeesRouter.post("/register", (req, res) => {
  return createEmployee(req, res);
});

employeesRouter.post("/authenticate", (req, res) => {
  return authenticateEmployee(req, res);
})

module.exports = employeesRouter;
