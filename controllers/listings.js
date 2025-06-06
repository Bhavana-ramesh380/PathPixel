const Listing = require("../models/listings.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

//All Listing / Index
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({}); 
    res.render("listings/index.ejs", { allListings });
   };

  module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
 };

 //Show Listing
 module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({ 
      path: "reviews",
      populate: {
        path: "author",
      },
     })
    .populate("owner");
    if (!listing) {
      throw new ExpressError(404, "Listing you requested for does not exist!");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
  };

    // Create Listing
  module.exports.createdListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success","New Listing Created!");
     res.redirect("/listings");
  };


//Edit Listing
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  
  const listing = await Listing.findById(id);
  // if (!listing) {
  //   throw new ExpressError(404, "listing  not exist or found!");
  // }
  if (!listing) {
    req.flash("error","Listing doesnot exist!");
    return res.redirect("/listings");
  }
  
  let originalImageUrl = listing.image.url;
   originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl});
};

// Update Listing
  module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
  
    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }
  
    // Update other fields
    listing.title = req.body.listing.title;
    listing.description = req.body.listing.description;
    listing.price = req.body.listing.price;
    listing.country = req.body.listing.country;
    listing.location = req.body.listing.location;
  
    // If a new image is uploaded, update it
    if (req.file) {
      listing.image = {
        url: req.file.path,
        filename: req.file.filename
      };
      console.log("New image uploaded:", req.file);
    }
  
    await listing.save();
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${listing._id}`);
  };


// Destroy Listing
module.exports.destroyListing = async (req, res) =>{
    let { id } = req.params;
   let deletedListing = await Listing.findByIdAndDelete(id);
   console.log(deletedListing);
   req.flash("success","Listing Deleted!");
   res.redirect("/listings");
  };