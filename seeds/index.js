const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
    console.log("DATABASE CONNECTED");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 400; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            images: [
                {
                    url: "https://res.cloudinary.com/dbqnojxhy/image/upload/v1617625676/YelpCampSantino/alpha_grandcanyon_landscape_aphpge.jpg",
                    filename: "YelpCampSantino/alpha_grandcanyon_landscape_aphpge"
                },
                {
                    url: "https://res.cloudinary.com/dbqnojxhy/image/upload/v1617625719/YelpCampSantino/alpha_grandcanyon_dusk_waztxi.jpg",
                    filename: "YelpCampSantino/alpha_grandcanyon_dusk_waztxi"
                },
                {
                    url: "https://res.cloudinary.com/dbqnojxhy/image/upload/v1617625750/YelpCampSantino/alpha_amalfi_coast_cj7viu.jpg",
                    filename: "YelpCampSantino/alpha_amalfi_coast_cj7viu"
                }
            ],
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis assumenda necessitatibus iste pariatur ab eveniet quae impedit tempora nobis culpa rerum veritatis voluptates dolores maiores, neque vel quidem! Suscipit, iure.",
            author: "60645b50633d7d3afc3042de",
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            }
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})