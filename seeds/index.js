const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

mongoose.connect("mongodb://localhost:27017/yelpCamp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database connected");
});

const seedDB = async () => {
  await Campground.deleteMany();
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 100);
    const randomPlace = Math.floor(Math.random() * 17);
    const randomDescriptor = Math.floor(Math.random() * 20);
    const camp = new Campground({
      location: `${cities[random1000].City}`,
      image: 'https://source.unsplash.com/collection/483251',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo commodi ab repudiandae doloribus voluptas sequi vel est dolores saepe quos soluta ipsa aperiam iure aliquid, ducimus vitae consectetur maiores beatae?',
      title: `${descriptors[randomDescriptor]} ${places[randomPlace]}`,
      price: Math.floor(Math.random()*1000)
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
