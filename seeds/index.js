const { urlencoded } = require("express");
const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require('./cities')
const {places , descriptors} = require("./seedHelpers");

mongoose.connect("mongodb://localhost:27017/yelpCamp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database connected");
});

const seedDB = async()=>{
    await Campground.deleteMany();
    for(let i=0;i<50;i++){
        const random1000 = Math.floor(Math.random() * 100);
        const randomPlace = Math.floor(Math.random() * 17);
        const randomDescriptor = Math.floor(Math.random() * 20);
        const camp = new Campground({
            location:`${cities[random1000].City}`,
            title:`${descriptors[randomDescriptor]} ${places[randomPlace]}`
        });
        await camp.save();
    }
}

seedDB().then(()=>{
  mongoose.connection.close();
});