const employees = require("../models/employees_schema");
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

    return res.status(400).send({ message: "Employee not in database. Please register new employee or try again." });
  });
};

const editEmployee = (req, res) => {
  const query = employees.findOne({ icNumber: req.body.icNumber });
  query.exec(async (err, user) => {
    if (err) {
      return res.status(500).send({ message: "Error: " + err });
    }

    if (user) {
      let emp = await employees.updateOne(
        { icNumber: req.body.icNumber },
        {
          $set: {
            phoneNo: req.body.phoneNo,
            email: req.body.email,
            address: req.body.address ? req.body.address : '',
            position: req.body.position,
            securityLvl: req.body.securityLvl
          },
        }
      );

      if (emp) {
        return res.status(200).send({
          message: `Employee ${req.body.icNumber} edited!`,
        });
      }

      return res.status(500).send({ message: "Error: " + err });
    }

    return res.status(404).send({ message: "Employee doesn't exist" });
  });
}

const getEmployee = (req, res) => {
  const query = employees.findOne({ icNumber: req.query.icNumber });
  query.exec(async (err, user) => {
    if (err) {
      return res.status(500).send({ message: "Error: " + err });
    }

    if (user) {
      return res.status(200).send({
        user,
      });
    }

    return res.status(404).send({ message: "Employee doesn't exist" });
  })
}

const getAllEmployees = (req, res) => {
  const query = employees.find({});
  query.exec(async (err, data) => {
      if (err) {
          console.log("Error: " + err);
          return res.status(500).send({ message: "Error: " + err });
      }

      if (data) {
          return res.status(200).send({
              data
          });
      } else {
          return res.status(403).send({
              message: 'No employees registered.',
              data: []
          })
      }
  })
}

const deleteEmployee = (req, res) => {
  const query = employees.findOne({ icNumber: req.body.icNumber });
  query.exec(async (err, user) => {
    if (err) {
      return res.status(500).send({ message: "Error: " + err });
    }

    if (user) {
      let emp = await employees.deleteOne({
        icNumber: req.body.icNumber,
      });

      if (emp) {
        return res.status(200).send({
          message: `Employee ${req.body.icNumber} deleted!`,
        });
      }

      return res.status(500).send({ message: "Error: " + err });
    }

    return res.status(404).send({ message: "Employee doesn't exist" });
  });
};

employeesRouter.post("/register", (req, res) => {
  return createEmployee(req, res);
});

employeesRouter.post("/authenticate", (req, res) => {
  return authenticateEmployee(req, res);
})

employeesRouter.post("/edit", (req, res) => {
  return editEmployee(req, res);
})

employeesRouter.post("/delete", (req, res) => {
  return deleteEmployee(req, res)
})

employeesRouter.get("/get", (req, res) => {
  return getEmployee(req, res)
})

employeesRouter.get("/all", (req, res) => {
  return getAllEmployees(req, res)
})

module.exports = employeesRouter;
