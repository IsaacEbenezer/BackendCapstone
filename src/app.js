const express = require("express");
const app = express();
const subscriberModel = require("./models/subscribers");
// Your code goes here

//Middleware used to parse incoming requests with JSON payload
app.use(express.json());

// Displays the welcome message .
app.get("/", (req, res) => {
  res.json("welcome User..");
});

// 1. To Get Response with an  array of all subscribers(object) from the database
app.get("/subscribers", async (req, res) => {
  const subscribers = await subscriberModel.find();
  res.json(subscribers);
});

// 2. To Get Response with an array of subscriber's name and subscribed channel from the database
app.get("/subscribers/names", async (req, res) => {
  const subscribers = await subscriberModel.find(
    {},
    { name: 1, subscribedChannel: 1, _id: 0 }
  );
  res.json(subscribers);
});

// 3. To Get a particular subscriber from the database using _id
app.get("/subscribers/:id", async (req, res) => {
  const id = req.params.id;

  await subscriberModel
    .findById(id)
    .then((data) => {
      if (!data) {
        // When there is no  subscriber  found with  the given id.
        error = Error(`There is no subscriber with  _id: ${id}.`);
        res.status(404).json({ message: error.message });
      } else {
        res.json(data);
      }
    })
    .catch((error) => {
      // When the id is not entered in the correct format.
      res.status(404).json({
        message: `There is no subscriber with  _id: ${id}.`,
      });
    });
  });
  
  // 4. To Add a subscriber to the database, we use "Post" method.
  app.post("/subscribers", async (req, res) => {
    const subscribers = new subscriberModel({
      name: req.body.name,
      subscribedChannel: req.body.subscribedChannel,
    });
    
  await subscribers
    .save()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.json({ message: error.message });
    });
});

// 5. To Update a subscriber in the database using _id ,we use "put" method.
app.put("/subscribers/:id", async (req, res) => {
  let upId = req.params.id;
  let upName = req.body.name;
  let upSubscribedChannel = req.body.subscribedChannel;

  await subscriberModel
    .findOneAndUpdate(
      { _id: upId },
      { $set: { name: upName, subscribedChannel: upSubscribedChannel } },
      { new: true }
      )
      .then((data) => {
        if (!data) {
        // When the subscriber is not present for the given id.
        error = Error(`There is no subscriber with _id: ${upId}.`);
        res.status(404).json({ message: error.message });
      } else {
        res.status(200).json(data);
      }
    })
    .catch((error) => {
      // When the id is not entered in the correct format.
      res.status(404).json({
        message: `There is no subscriber with _id: ${upId}.`,
      });
    });
});

// 6. To Delete a subscriber from the database using _id ,we use "delete" method.
app.delete("/subscribers/:id", async (req, res) => {
  const id = req.params.id;
  
  await subscriberModel
  .findByIdAndDelete({ _id: id })
  .then((data) => {
    if (!data) {
      // When the subscriber is not present for the given id.
      error = Error(`There is no subscriber with _id: ${id}.`);
      res.status(404).json({ message: error.message });
    } else {
      // Deleted data won't be shown to the client.
      res.json("Subscriber deleted successfully.");
    }
  })
  .catch((error) => {
    // When the id is not entered in the correct format.
    res.status(404).json({
      message: `Subscriber doesn't exist with the given _id: ${id}.`,
    });
  });
});

// Handles unwanted requests.
app.use((req, res) => {
  res.status(404).json({ message: "Error !! please check the route " });
});

module.exports = app;
