import { Meteor } from "meteor/meteor";
import { RatingsAndReviews } from "../../lib/collections";
import { check } from "meteor/check";

const formatDate = () => {
  const now = new Date();
  let day = now.getDate();

  let month = now.getMonth() + 1;
  const year  = now.getFullYear();
  if (day < 10) day = `0${day}`;
  if (month < 10) month = `0${month}`;
  return `${day}/${month}/${year}`;
};

Meteor.methods({
  "ratingsAndReviews/send"(userId, name, rating, review, productId) {
    check(userId, String);
    check(name, String);
    check(rating, Number);
    check(review, String);
    check(productId, String);
    const exists = RatingsAndReviews.findOne({
      userId,
      productId
    });
    const ratingAndReview = {
      userId,
      name,
      rating,
      review,
      productId,
      date: formatDate()
    };
    let save;
    if (!exists) {
      save = RatingsAndReviews.insert(ratingAndReview);
    } else {
      save = RatingsAndReviews.update(
        { userId, productId },
        { $set: ratingAndReview }
      );
    }
    return save;
  },
  "ratingsAndReviews/fetch"(productId, skip, limit) {
    check(productId, String);
    check(skip, Number);
    check(limit, Number);
    return RatingsAndReviews
      .find({ productId }, { skip, limit, sort: { _id: -1 } }).fetch();
  }
});
