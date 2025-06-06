const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listings.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => {
    console.log("connection is successful");
    })
    .catch((err) => {
    console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
} 

  
const initDB = async () => {
    await Listing.deleteMany({});
    initData.data =  initData.data.map((obj) => ({
        ...obj,
         owner:"683c208d3f7daf82570e9f8a" 
        }));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();