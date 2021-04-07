const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })


module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
}

module.exports.new = (req, res) => {
    res.render("campgrounds/addnew")
}

module.exports.addNew = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    await campground.save();
    req.flash("success", "Campground successfully added!");
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.campDetails = async (req, res) => {
    const foundCamp = await Campground.findById(req.params.id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate("author");
    if (!foundCamp) {
        req.flash("error", "Campground not found");
        return res.redirect("/campgrounds")
    }
    res.render("campgrounds/campdetails", { foundCamp });
}

module.exports.edit = async (req, res) => {
    const { id } = req.params
    const foundCamp = await Campground.findById(id);
    if (!foundCamp) {
        req.flash("error", "Campground not found");
        return res.redirect("/campgrounds")
    }
    res.render("campgrounds/edit", { foundCamp });
}

module.exports.update = async (req, res) => {
    const { id } = req.params;
    const updatedCamp = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    updatedCamp.images.push(...imgs);
    await updatedCamp.save();
    if (req.body.deleteImages) {
        for (filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await updatedCamp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash("success", "Campground successfully updated")
    res.redirect(`/campgrounds/${updatedCamp._id}`);
}

module.exports.delete = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Campground deleted!")
    res.redirect("/campgrounds")
}