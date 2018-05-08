import React, { Component } from "react";
import PropTypes from "prop-types";
import { Meteor } from "meteor/meteor";
import { Reaction } from "/client/api";
import { registerComponent, composeWithTracker } from "@reactioncommerce/reaction-components";
import { RatingsAndReviews } from "../../lib/collections";
import "../css/ratingsAndReviews.css";

class RatingsAndReviewsComponent extends Component {
  static propTypes = {
    ratingsAndReviews: PropTypes.array
  }

  constructor() {
    super();
    this.rating = 0;
    this.index = 0;
    this.state = {
      ratingText: "",
      averageRating: 0
    };
    this.ratingsTexts = {
      1: "I hate it",
      2: "I dont like it",
      3: "I dont like or dislike it",
      4: "I like it",
      5: "I love it"
    };
    this.interval;
    this.userId = Meteor.userId();
    this.productId = Reaction.Router.getParam("handle");
    this.ratings = ["one", "two", "three", "four", "five"];
    this.submitReview = this.submitReview.bind(this);
    this.hoverRating = this.hoverRating.bind(this);
    this.leaveRating = this.leaveRating.bind(this);
    this.displayReview = this.displayReview.bind(this);
    this.rate = this.rate.bind(this);
  }

  componentDidMount() {
    this.displayReview();
  }

  componentDidUpdate(prevProps) {
    const previous = prevProps.ratingsAndReviews.length;
    const current = this.props.ratingsAndReviews.length;
    if (previous !== current) {
      this.index = 0;
      if (this.interval) clearInterval(this.interval);
      this.displayReview();
    }
  }

  submitReview(event) {
    event.preventDefault();
    if (Meteor.userId()) {
      Meteor.call(
        "ratingsAndReviews/send",
        this.userId,
        this.rating,
        this.review.value,
        this.productId,
      );
    }
    this.review.value = "";
    this.rating = 0;
    this.leaveRating();
  }

  displayReview() {
    const { ratingsAndReviews } = this.props;
    if (ratingsAndReviews) {
      if (ratingsAndReviews.length) {
        this.blockQuote.classList.remove("invisible");
        this.reviewQuote.innerText = ratingsAndReviews[0].review;
        this.interval = setInterval(() => {
          if (this.index >= ratingsAndReviews.length - 1) {
            this.index = 0;
          } else {
            this.index += 1;
          }
          this.reviewQuote.classList.add("fade-out");
          setTimeout(() => {
            this.reviewQuote.innerText = ratingsAndReviews[this.index].review;
            this.reviewQuote.classList.remove("fade-out");
            this.reviewQuote.classList.add("fade-in");
          }, 2000);
        }, 15000);
      } else {
        this.reviewQuote.innerText = "";
        this.blockQuote.classList.add("invisible");
      }
    } else {
      this.reviewQuote.innerText = "";
      this.blockQuote.classList.add("invisible");
    }
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

  rate(rating) {
    this.rating = rating;
  }

  render() {
    const { ratingsAndReviews } = this.props;
    let averageRating = 0;
    let count = 0;
    if (ratingsAndReviews.length) {
      let ratingsSum = 0;
      ratingsAndReviews.map((ratingAndReview) => {
        if (ratingAndReview.rating) {
          ratingsSum += ratingAndReview.rating;
          count += 1;
        }
      });
      averageRating = Math.round(ratingsSum / count);
    }
    return (
      <div className="ratings-and-reviews row">
        <div
          className={`${Meteor.userId() ? "col-md-6" : ""} border-right
           average-rating text-center`}
        >
          <h5>
            <strong>Average Rating</strong>
          </h5>
          {
            [1, 2, 3, 4, 5].map((rating) => (
              <span
                key={rating}
                className={`fa fa-star big-star ${rating <= averageRating ?
                  "rated" : ""}`}
              />
            ))
          }
          <div
            className="text-justify review-form"
          >
            <blockquote
              className="blockquote"
              ref={(input) => {this.blockQuote = input;}}
            >
              <span ref={(input) => {this.reviewQuote = input;}} />
            </blockquote>
          </div>
        </div>
        {
          Meteor.userId() ?
            (
              <div className="col-md-6">
                <h5><strong>Have you used this product before?</strong></h5>
                <div className="rating-container">
                  <span
                    className="fa fa-star pointer"
                    onMouseEnter={() => this.hoverRating(1)}
                    onMouseLeave={this.leaveRating}
                    onClick={() => this.rate(1)}
                    ref={(input) => { this.one = input; }}
                  />
                  <span
                    className="fa fa-star pointer"
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
                <form className="review-form" onSubmit={this.submitReview}>
                  <textarea
                    rows="6"
                    placeholder="Drop a review."
                    maxLength="200"
                    className="review form-control"
                    ref={(input) => { this.review = input; }}
                    required
                  />
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

const compose = (props, onData) => {
  if (Meteor.subscribe(
    "RatingsAndReviews",
    Reaction.Router.getParam("handle")).ready()
  ) {
    const ratingsAndReviews = RatingsAndReviews.find({}).fetch();
    onData(null, { ratingsAndReviews });
  }
};

registerComponent(
  "RatingsAndReviewsComponent",
  RatingsAndReviewsComponent,
  composeWithTracker(compose)
);

export default RatingsAndReviewsComponent;
