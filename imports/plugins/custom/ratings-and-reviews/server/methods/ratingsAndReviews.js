import { Meteor } from "meteor/meteor";
import { RatingsAndReviews } from "../../lib/collections";
import { check } from "meteor/check";

Meteor.methods({
  "ratingsAndReviews/send"(userId, rating, review, productId) {
    check(userId, String);
    check(rating, Number);
    check(review, String);
    check(productId, String);
    const exists = RatingsAndReviews.findOne({
      userId,
      productId
    });
    const ratingAndReview = {
      userId,
      rating,
      review,
      productId
    };
    if (!exists) return RatingsAndReviews.insert(ratingAndReview);
    return RatingsAndReviews.update(
      { userId, productId },
      { $set: ratingAndReview }
    );
  },
  "ratingsAndReviews/fetch"(productId) {
    check(productId, String);
    return RatingsAndReviews.find({ productId }).fetch();
  }
});
