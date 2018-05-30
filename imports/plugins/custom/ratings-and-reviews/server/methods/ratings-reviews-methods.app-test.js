import { Meteor } from "meteor/meteor";
import { expect } from "meteor/practicalmeteor:chai";
import Random from "meteor-random";

describe("ratingsAndReviews", () => {
  const productId = Random.id();
  const userId = "testUserId";
  const name = "testName";
  let review = "testReview";
  let rating = 5;
  it("should save ratings and reviews for a product", (done) => {
    Meteor.call(
      "ratingsAndReviews/send",
      userId,
      name,
      rating,
      review,
      productId,
      (error, savedId) => {
        expect(error).to.be.undefined;
        expect(typeof savedId).to.equal("string");
        done();
      }
    );
  });

  it("should fetch ratings and review for product", (done) => {
    Meteor.call(
      "ratingsAndReviews/fetch",
      productId,
      0,
      1,
      (error, ratingsAndReviews) => {
        expect(error).to.be.undefined;
        expect(ratingsAndReviews.length).to.equal(1);
        expect(ratingsAndReviews[0].productId).to.equal(productId);
        expect(ratingsAndReviews[0].userId).to.equal(userId);
        expect(ratingsAndReviews[0].rating).to.equal(rating);
        expect(ratingsAndReviews[0].review).to.equal(review);
        expect(ratingsAndReviews[0].name).to.equal(name);
        done();
      }
    );
  });

  it("should edit rating and review for product", (done) => {
    review = "testReviewEdited";
    rating = 4;
    Meteor.call(
      "ratingsAndReviews/send",
      userId,
      name,
      rating,
      review,
      productId,
      (error, rowsEdited) => {
        expect(error).to.be.undefined;
        expect(rowsEdited).to.equal(1);
        done();
      }
    );
  });

  it("should fetch edited rating and review for product", (done) => {
    Meteor.call(
      "ratingsAndReviews/fetch",
      productId,
      0,
      1,
      (error, ratingsAndReviews) => {
        expect(error).to.be.undefined;
        expect(ratingsAndReviews.length).to.equal(1);
        expect(ratingsAndReviews[0].productId).to.equal(productId);
        expect(ratingsAndReviews[0].userId).to.equal(userId);
        expect(ratingsAndReviews[0].rating).to.equal(rating);
        expect(ratingsAndReviews[0].review).to.equal(review);
        expect(ratingsAndReviews[0].name).to.equal(name);
        done();
      }
    );
  });
});
