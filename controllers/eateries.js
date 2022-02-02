const eateries = require("../models/eateries_schema");
const eateriesRouter = require("express").Router();

const registerEatery = (req, res) => {
  const query = users.findOne({ email: req.body.email });
  query.exec(async (err, data) => {
    if (err) {
      console.log("Error: " + err);
      return res.status(500).send({ message: "Error: " + err });
    }
    if (data) {
      let _eatery = await eateries.find({ email: req.body.email });

      var str = "" + Object.keys(_eatery).length;
      var pad = "000";
      var id = "hotel-" + pad.substring(0, pad.length - str.length) + str;

      const eatery = new eateries({
        id: id,
        name: req.body.name,
        description: req.body.description,
        phoneNo: req.body.phoneNo,
        email: req.body.email,
        websites: req.body.websites,
        sop: req.body.sop,
        menu: req.body.menu,
        address: req.body.address,
        state: req.body.state,
        country: req.body.country,
      });

      const saved = await eatery.save();

      if (saved) {
        console.log("Eatery " + id + " created!");
        return res.status(200).send({ message: "Eatery " + id + " created!" });
      }
    }

    return res.status(404).send({ message: "User doesn't exist" });
  });
};

const getAllEateries = (req, res) => {
  const query = eateries.find({});
  query.exec(async (err, data) => {
    if (err) {
      return res.status(500).send({ message: "Error: " + err });
    }

    if (data) {
      return res.status(200).send({
        data: data,
      });
    }

    return res
      .status(404)
      .send({ message: `No eateries registered yet so far.` });
  });
};

const getEateriesByState = (req, res) => {
  const query = eateries.find({ state: req.query.state });
  query.exec(async (err, data) => {
    if (err) {
      return res.status(500).send({ message: "Error: " + err });
    }

    if (data) {
      return res.status(200).send({
        message: `All eateries from ${req.query.state}`,
        data: data,
      });
    }

    return res
      .status(404)
      .send({ message: `No eateries registered for ${req.query.state}!` });
  });
};

const getEateriesByUser = (req, res) => {
  const query = eateries.find({ email: req.query.email });
  query.exec(async (err, data) => {
    if (err) {
      return res.status(500).send({ message: "Error: " + err });
    }

    if (data) {
      return res.status(200).send({
        message: `All eateries by ${req.query.email}`,
        data: data,
      });
    }

    return res
      .status(404)
      .send({ message: `No eateries registered by this user!` });
  });
};

const getOneEatery = (req, res) => {
  const query = eateries.findOne({ id: req.query.id });
  query.exec(async (err, data) => {
    if (err) {
      return res.status(500).send({ message: "Error: " + err });
    }

    if (data) {
      return res.status(200).send({
        data: data,
      });
    }

    return res.status(404).send({ message: "Hotel doesn't exist" });
  });
};

const editEatery = (req, res) => {
  const query = eateries.findOne({ id: req.body.id });
  query.exec(async (err, data) => {
    if (err) {
      return res.status(500).send({ message: "Error: " + err });
    }

    if (data) {
      let hotel = await eateries.updateMany(
        { id: req.body.id },
        {
          $set: {
            name: req.body.name,
            description: req.body.description,
            phoneNo: req.body.phoneNo,
            email: req.body.email,
            websites: req.body.websites,
            sop: req.body.sop,
            menu: req.body.menu,
            address: req.body.address,
            state: req.body.state,
            country: req.body.country,
          },
        }
      );

      if (hotel) {
        return res.status(200).send({
          message: `Hotel ${req.body.id} edited!`,
        });
      }

      return res.status(500).send({ message: "Error: " + err });
    }

    return res.status(404).send({ message: "Hotel doesn't exist" });
  });
};

const deleteOneEatery = (req, res) => {
  const query = eateries.findOne({ id: req.query.id });
  query.exec(async (err, data) => {
    if (err) {
      return res.status(500).send({ message: "Error: " + err });
    }

    if (data) {
      let hotel = await eateries.deleteOne({
        id: req.query.id,
      });

      if (hotel) {
        return res.status(200).send({
          message: `hotel ${req.query.id} deleted!`,
        });
      }

      return res.status(500).send({ message: "Error: " + err });
    }

    return res.status(404).send({ message: "hotel doesn't exist" });
  });
};

eateriesRouter.post("/eateries/register", async (req, res) => {
  return registerEatery(req, res);
});

eateriesRouter.get("/eateries/all", async (req, res) => {
  return getAllEateries(req, res);
});

eateriesRouter.get("/eateries/state", async (req, res) => {
  return getEateriesByState(req, res);
});

eateriesRouter.get("/eateries/user", async (req, res) => {
  return getEateriesByUser(req, res);
});

eateriesRouter.get("/eateries/", async (req, res) => {
  return getOneEatery(req, res);
});

eateriesRouter.post("/eateries/", async (req, res) => {
  return editEatery(req, res);
});

eateriesRouter.delete("/eateries/", async (req, res) => {
  return deleteOneEatery(req, res);
});

module.exports = eateriesRouter;
