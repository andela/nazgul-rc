import React, { Component } from "react";
import PropTypes from "prop-types";
import { Meteor } from "meteor/meteor";
import { Reaction } from "/client/api";
import { RatingsAndReviews } from "../../../ratings-and-reviews/lib/collections";
import "../css/ratingsAndReviews.css";

class RateAndReviewShop extends Component {
  static propTypes = {
    refresh: PropTypes.func
  }

  constructor() {
    super();
    this.rating = 0;
    this.maxLength = 500;
    this.state = {
      ratingTextCount: "",
      ratingText: "",
      ratingShop: false,
      ratedShop: false
    };
    this.ratingsTexts = {
      1: "I hate it",
      2: "I dont like it",
      3: "I dont like or dislike it",
      4: "I like it",
      5: "I love it"
    };
    this.shopId = Reaction.getShopId();
    this.user = Meteor.user();
    this.ratings = ["one", "two", "three", "four", "five"];
    this.submitReview = this.submitReview.bind(this);
    this.hoverRating = this.hoverRating.bind(this);
    this.leaveRating = this.leaveRating.bind(this);
    this.computeRemainingText = this.computeRemainingText.bind(this);
    this.rate = this.rate.bind(this);
  }

  submitReview(event) {
    event.preventDefault();
    if (Meteor.userId() && !this.state.ratingShop) {
      this.setState({ ratingShop: true });
      Meteor.call(
        "ratingsAndReviews/send",
        this.user._id,
        this.user.name,
        this.rating,
        this.review.value,
        this.shopId,
        () => {
          this.review.value = "";
          this.rating = 0;
          this.setState({
            ratingTextCount: "",
            ratingShop: false
          });
          if (this.props.refresh)   {
            this.props.refresh();
          } else {
            this.setState({ ratedShop: true });
          }
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
    if (ratingTextCount < 500) return this.setState({ ratingTextCount });
    return this.setState({ ratingTextCount: "" });
  }

  rate(rating) {
    this.rating = rating;
  }

  render() {
    const { roles } = Meteor.user();
    const globalRoles = roles.__global_roles__;
    let isAdmin = !!globalRoles;
    if (isAdmin) isAdmin = globalRoles.includes("admin");
    if (!isAdmin) {
      return (
        <div className="text-center rate-shop">
          {
            this.state.ratedShop ? "We've received your feedback. Thank you!" :
              (
                <div>
                  <h5><strong>Please rate our service</strong></h5>
                  <div className="rating-container shop">
                    {
                      this.state.ratingShop ? (
                        <i className="fa fa-spinner fa-spin" />
                      ) : (
                        <span>
                          <span
                            className="fa fa-star pointer shop"
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
                        </span>
                      )
                    }
                  </div>
                  <span>{this.state.ratingText}</span>
                  <form className="review-form shopForm" onSubmit={this.submitReview}>
                    <textarea
                      rows="6"
                      placeholder="Drop a review."
                      maxLength={this.maxLength}
                      className="review form-control shop"
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
              )
          }
        </div>
      );
    }
    return null;
  }
}

export default RateAndReviewShop;

