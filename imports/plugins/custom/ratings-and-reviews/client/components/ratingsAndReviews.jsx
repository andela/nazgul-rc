import React, { Component } from "react";
import PropTypes from "prop-types";
import { Meteor } from "meteor/meteor";
import { Reaction } from "/client/api";
import { registerComponent, composeWithTracker } from "@reactioncommerce/reaction-components";
import { RatingsAndReviews } from "../../lib/collections";
import "../css/ratingsAndReviews.css";

class RatingsAndReviewsComponent extends Component {
  static propTypes = {
    averageRating: PropTypes.number
  }

  constructor() {
    super();
    this.rating = 0;
    this.maxLength = 300;
    this.state = {
      ratingTextCount: "",
      ratingText: "",
      averageRating: 0,
      ratingsAndReviews: []
    };
    this.ratingsTexts = {
      1: "I hate it",
      2: "I dont like it",
      3: "I dont like or dislike it",
      4: "I like it",
      5: "I love it"
    };
    this.skip = 0;
    this.limit = 10;
    this.user = Meteor.user();
    this.productId = Reaction.Router.getParam("handle");
    this.ratings = ["one", "two", "three", "four", "five"];
    this.submitReview = this.submitReview.bind(this);
    this.hoverRating = this.hoverRating.bind(this);
    this.leaveRating = this.leaveRating.bind(this);
    this.computeRemainingText = this.computeRemainingText.bind(this);
    this.fetchRatingsAndReviews = this.fetchRatingsAndReviews.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.rate = this.rate.bind(this);
  }

  componentDidMount() {
    this.reviews.addEventListener("scroll", this.onScroll, false);
    this.fetchRatingsAndReviews();
  }

  onScroll() {
    if (this.reviews.scrollHeight - this.reviews.scrollTop === this.reviews
      .clientHeight) {
      this.fetchRatingsAndReviews();
    }
  }

  fetchRatingsAndReviews() {
    Meteor.call(
      "ratingsAndReviews/fetch",
      this.productId,
      this.skip,
      this.limit,
      (error, ratingsAndReviews) => {
        if (!error) {
          this.skip += ratingsAndReviews.length;
          this.setState({
            ratingsAndReviews: [
              ...this.state.ratingsAndReviews,
              ...ratingsAndReviews
            ]
          });
        }
      }
    );
  }

  submitReview(event) {
    event.preventDefault();
    if (Meteor.userId()) {
      Meteor.call(
        "ratingsAndReviews/send",
        this.user._id,
        this.user.name,
        this.rating,
        this.review.value,
        this.productId,
        () => {
          this.review.value = "";
          this.setState({ ratingTextCount: "" });
          this.rating = 0;
          this.leaveRating();
          this.skip = 0;
          this.limit = 10;
          this.setState({ ratingsAndReviews: [] });
          this.fetchRatingsAndReviews();
        }
      );
    }
    this.review.value = "";
    this.setState({ ratingTextCount: "" });
    this.rating = 0;
    this.leaveRating();
  }

  hoverRating(rating) {
    this.ratings.map((val, index) => {
      if (index <= rating - 1) {
        this[val].classList.add("hover-rating");
      } else {
        this[val].classList.remove("hover-rating");
      }
    });
    const ratingText = this.ratingsTexts[rating];
    this.setState(() => ({ ratingText }));
  }

  leaveRating() {
    this.ratings.map((val, index) => {
      if (index > this.rating - 1) {
        this[val].classList.remove("hover-rating");
      } else {
        this[val].classList.add("hover-rating");
      }
    });
    const ratingText = "";
    this.setState(() => ({ ratingText }));
  }

  computeRemainingText() {
    const ratingTextCount = this.maxLength - this.review.value.length;
    if (ratingTextCount < 300) return this.setState({ ratingTextCount });
    return this.setState({ ratingTextCount: "" });
  }

  rate(rating) {
    this.rating = rating;
  }

  render() {
    const { averageRating } = this.props;
    const { ratingsAndReviews } = this.state;
    const { roles, name } = Meteor.user();
    const globalRoles = roles.__global_roles__;
    let isAdmin = !!globalRoles;
    if (isAdmin) isAdmin = globalRoles.includes("admin");
    const showForm = !isAdmin && name;
    return (
      <div className="ratings-and-reviews row">
        <div
          className={`${showForm ? "col-md-6" : ""} average-rating text-center`}
        >
          <h5>
            <strong>Average Rating</strong>
          </h5>
          {
            [1, 2, 3, 4, 5].map((rating) => (
              <span
                key={rating}
                className={`fa fa-star big-star product ${rating <= averageRating ?
                  "rated" : ""}`}
              />
            ))
          }
          <div
            className="text-justify review-form reviews"
            ref={(input) => { this.reviews = input; }}
          >
            <blockquote
              className={`blockquote ${ratingsAndReviews.length ?
                "" : "hidden"}`}
            >
              {
                ratingsAndReviews.map((ratingAndReview, index) => {
                  return (
                    <div key={ratingAndReview._id}>
                      {
                        [1, 2, 3, 4, 5].map((rating) => (
                          <span
                            key={rating}
                            className={`fa fa-star small-star
                             ${rating <= ratingAndReview.rating ?
                            "rated" : ""}`}
                          />
                        ))
                      }
                      <span className="pull-right">{ratingAndReview.date}</span>
                      <div className="r-and-r product">{ratingAndReview.review}</div>
                      <div className="pull-right">
                        {`- ${ratingAndReview.name}`}
                      </div>
                      {
                        ratingsAndReviews[index + 1] ?
                          (<div className="hr"/>) : ""
                      }
                    </div>
                  );
                })
              }
            </blockquote>
          </div>
        </div>
        {
          showForm ?
            (
              <div className="col-md-6 average-rating">
                <h5><strong>Have you used this product before?</strong></h5>
                <div className="rating-container product">
                  <span
                    className="fa fa-star pointer"
                    onMouseEnter={() => this.hoverRating(1)}
                    onMouseLeave={this.leaveRating}
                    onClick={() => this.rate(1)}
                    ref={(input) => { this.one = input; }}
                  />
                  <span
                    className="fa fa-star pointer product"
                    onMouseEnter={() => this.hoverRating(2)}
                    onMouseLeave={this.leaveRating}
                    onClick={() => this.rate(2)}
                    ref={(input) => { this.two = input; }}
                  />
                  <span
                    className="fa fa-star pointer"
                    onMouseEnter={() => this.hoverRating(3)}
                    onMouseLeave={this.leaveRating}
                    onClick={() => this.rate(3)}
                    ref={(input) => { this.three = input; }}
                  />
                  <span
                    className="fa fa-star pointer"
                    onMouseEnter={() => this.hoverRating(4)}
                    onMouseLeave={this.leaveRating}
                    onClick={() => this.rate(4)}
                    ref={(input) => { this.four = input; }}
                  />
                  <span
                    className="fa fa-star pointer"
                    onMouseEnter={() => this.hoverRating(5)}
                    onMouseLeave={this.leaveRating}
                    onClick={() => this.rate(5)}
                    ref={(input) => { this.five = input; }}
                  />
                </div>
                <span>{this.state.ratingText}</span>
                <form className="review-form productForm" onSubmit={this.submitReview}>
                  <textarea
                    rows="6"
                    placeholder="Drop a review."
                    maxLength={this.maxLength}
                    className="review form-control"
                    ref={(input) => { this.review = input; }}
                    onChange={this.computeRemainingText}
                    required
                  />
                  <div className="pull-right">
                    {
                      this.state.ratingTextCount !== "" ?
                        `${this.state.ratingTextCount} remaining` : ""
                    }
                  </div>
                  <input
                    type="submit"
                    className="btn btn-block btn-default submit-review"
                    defaultValue="Send Rating and Review"
                  />
                </form>
              </div>
            ) : ""
        }
      </div>
    );
  }
}

const computeAverage = (ratingsAndReviews) => {
  if (!ratingsAndReviews.length) return 0;
  let ratingSum = 0;
  let count = 0;
  ratingsAndReviews.map((ratingAndReview) => {
    if (ratingAndReview.rating) {
      ratingSum += ratingAndReview.rating;
      count += 1;
    }
  });
  return ratingSum / count;
};
const compose = (props, onData) => {
  const productId = Reaction.Router.getParam("handle");
  if (Meteor.subscribe(
    "RatingsAndReviews",
    productId).ready()
  ) {
    const ratingsAndReviews = RatingsAndReviews.find({
      productId
    }).fetch();
    onData(null, {
      averageRating: computeAverage(ratingsAndReviews)
    });
  }
};

registerComponent(
  "RatingsAndReviewsComponent",
  RatingsAndReviewsComponent,
  composeWithTracker(compose)
);

export default RatingsAndReviewsComponent;
