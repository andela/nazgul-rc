import { check } from "meteor/check";
import { Meteor } from "meteor/meteor";
import { RatingsAndReviews } from "../../lib/collections";

Meteor.publish("RatingsAndReviews", (productId) => {
  check(productId, String);
  return RatingsAndReviews.find({ productId });
});
