const attractions = require("../models/attractions_schema");
const attractionsRouter = require("express").Router();

const registerAttraction = (req, res) => {
  const query = attractions.find({});
  query.exec(async (err, data) => {
    if (err) {
      console.log("Error: " + err);
      return res.status(500).send({ message: "Error: " + err });
    }
    if (data) {
      let _attraction = await attractions.find({ email: req.body.email });

      var str = "" + Object.keys(_attraction).length;
      var pad = "000";
      var id = "attr-" + pad.substring(0, pad.length - str.length) + str;

      const attraction = new attractions({
        id: id,
        name: req.body.name,
        description: req.body.description,
        phoneNo: req.body.phoneNo,
        websites: req.body.websites,
        sop: req.body.sop,
        address: req.body.address,
        state: req.body.state,
        country: req.body.country,
      });

      const saved = await attraction.save();

      if (saved) {
        console.log("Attraction " + id + " created!");
        return res.status(200).send({ message: "Attraction " + id + " created!" });
      }
    }

    return res.status(404).send({ message: "Attraction doesn't exist" });
  });
};

const getAllAttractions = (req, res) => {
  const query = attractions.find({});
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
      .send({ message: `No attractions registered yet so far.` });
  });
};

const getAttractionsByState = (req, res) => {
  const query = attractions.find({ state: req.query.state });
  query.exec(async (err, data) => {
    if (err) {
      return res.status(500).send({ message: "Error: " + err });
    }

    if (data) {
      return res.status(200).send({
        message: `All attractions from ${req.query.state}`,
        data: data,
      });
    }

    return res
      .status(404)
      .send({ message: `No attractions registered for ${req.query.state}!` });
  });
};

const getOneAttraction = (req, res) => {
  const query = attractions.findOne({ id: req.query.id });
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

const editAttraction = (req, res) => {
  const query = attractions.findOne({ id: req.body.id });
  query.exec(async (err, data) => {
    if (err) {
      return res.status(500).send({ message: "Error: " + err });
    }

    if (data) {
      let attraction = await attractions.updateMany(
        { id: req.body.id },
        {
          $set: {
            name: req.body.name,
            description: req.body.description,
            phoneNo: req.body.phoneNo,
            websites: req.body.websites,
            sop: req.body.sop,
            address: req.body.address,
            state: req.body.state,
            country: req.body.country,
          },
        }
      );

      if (attraction) {
        return res.status(200).send({
          message: `Attraction ${req.body.id} edited!`,
        });
      }

      return res.status(500).send({ message: "Error: " + err });
    }

    return res.status(404).send({ message: "Attraction doesn't exist" });
  });
};

const deleteOneAttraction = (req, res) => {
  const query = attractions.findOne({ id: req.query.id });
  query.exec(async (err, data) => {
    if (err) {
      return res.status(500).send({ message: "Error: " + err });
    }

    if (data) {
      let attraction = await attractions.deleteOne({
        id: req.query.id,
      });

      if (attraction) {
        return res.status(200).send({
          message: `Attraction ${req.query.id} deleted!`,
        });
      }

      return res.status(500).send({ message: "Error: " + err });
    }

    return res.status(404).send({ message: "Attraction doesn't exist" });
  });
};

attractionsRouter.post("/attractions/register", async (req, res) => {
  return registerAttraction(req, res);
});

attractionsRouter.get("/attractions/all", async (req, res) => {
  return getAllAttractions(req, res);
});

attractionsRouter.get("/attractions/state", async (req, res) => {
  return getAttractionsByState(req, res);
});

attractionsRouter.get("/attractions", async (req, res) => {
  return getOneAttraction(req, res);
});

attractionsRouter.post("/attractions", async (req, res) => {
  return editAttraction(req, res);
});

attractionsRouter.delete("/attractions", async (req, res) => {
  return deleteOneAttraction(req, res);
});

module.exports = attractionsRouter;
