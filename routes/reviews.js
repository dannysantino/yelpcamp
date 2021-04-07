const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utilities/catchAsync");
const Campground = require("../models/campground");
const Review = require("../models/review");
const reviews = require("../controllers/reviews")
const ExpressError = require("../utilities/ExpressError");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");


// add review
router.post("/", isLoggedIn, validateReview, catchAsync(reviews.addReview));

// delete review
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(reviews.delete));

module.exports = router;