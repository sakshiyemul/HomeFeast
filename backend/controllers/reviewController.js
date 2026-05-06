const Review = require("../models/Review");
const Cook = require("../models/Cook");

exports.addReview = async (req, res) => {
  try {
    const { cookId, rating, comment } = req.body;
    const numericRating = Number(rating);

    if (!cookId || !numericRating) {
      return res.status(400).json({ message: "Cook and rating required" });
    }

    const review = await Review.findOneAndUpdate(
      { user: req.user._id, cookId },
      {
        user: req.user._id,
        cookId,
        rating: numericRating,
        comment
      },
      { new: true, upsert: true, runValidators: true }
    );

    const stats = await Review.aggregate([
      { $match: { cookId: review.cookId } },
      {
        $group: {
          _id: "$cookId",
          average: { $avg: "$rating" },
          count: { $sum: 1 }
        }
      }
    ]);

    const cook = await Cook.findById(cookId);
    if (cook && stats.length) {
      cook.rating = stats[0].average;
      cook.reviewsCount = stats[0].count;
      await cook.save();
    }

    return res.status(201).json(review);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unable to add review" });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const { cookId } = req.params;
    const reviews = await Review.find({ cookId })
      .populate("user", "name")
      .sort({ createdAt: -1 });
    return res.json(reviews);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unable to fetch reviews" });
  }
};
