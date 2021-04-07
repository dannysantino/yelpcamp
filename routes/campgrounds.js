const express = require("express");
const router = express.Router();
const catchAsync = require("../utilities/catchAsync");
const Campground = require("../models/campground");
const campgrounds = require("../controllers/campgrounds");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");
const multer = require('multer');
const { storage } = require("../cloudinary")
const upload = multer({ storage });


// all campgrounds & // new campground submit route
router.route("/")
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array("image"), validateCampground, catchAsync(campgrounds.addNew))

// add new
router.get("/new", isLoggedIn, campgrounds.new)

// details page & // update route & // delete route
router.route("/:id")
    .get(catchAsync(campgrounds.campDetails))
    .put(isLoggedIn, isAuthor, upload.array("image"), validateCampground, catchAsync(campgrounds.update))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.delete));

// edit page
router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.edit))


module.exports = router;