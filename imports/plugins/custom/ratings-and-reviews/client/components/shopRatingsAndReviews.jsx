import React, { Component } from "react";
import PropTypes from "prop-types";
import { Meteor } from "meteor/meteor";
import { Reaction } from "/client/api";
import { registerComponent, composeWithTracker } from "@reactioncommerce/reaction-components";
import { Orders } from "/lib/collections";
import { RatingsAndReviews } from "../../../ratings-and-reviews/lib/collections";
import RateAndReviewShop from "./rateAndReviewShop.jsx";
import "../css/ratingsAndReviews.css";

class ShopRatingsAndReviewsComponent extends Component {
  static propTypes = {
    averageRating: PropTypes.number,
    hasPurchased: PropTypes.bool
  }

  constructor() {
    super();
    this.state = {
      ratingsAndReviews: [],
      loading: false
    };
    this.shopId = Reaction.getShopId();
    this.skip = 0;
    this.limit = 10;
    this.fetchRatingsAndReviews = this.fetchRatingsAndReviews.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.refresh = this.refresh.bind(this);
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
      this.shopId,
      this.skip,
      this.limit,
      (error, ratingsAndReviews) => {
        if (!error) {
          this.skip += ratingsAndReviews.length;
          this.setState({
            ratingsAndReviews: [
              ...this.state.ratingsAndReviews,
              ...ratingsAndReviews
            ],
            loading: false
          });
        }
      }
    );
  }

  refresh() {
    this.setState({ ratingsAndReviews: [], loading: true });
    this.skip = 0;
    this.fetchRatingsAndReviews();
  }

  render() {
    const { averageRating, hasPurchased } = this.props;
    const { ratingsAndReviews } = this.state;
    const { roles } = Meteor.user();
    const globalRoles = roles.__global_roles__;
    let isAdmin = !!globalRoles;
    if (isAdmin) isAdmin = globalRoles.includes("admin");
    const isQualified = hasPurchased && !isAdmin;
    return (
      <div>
        <div data-toggle="modal" data-target="#reviewsModal" onClick={this.refresh} id="openReviewsModal">
          {
            isQualified ? "Rate Us" : "Shop Reviews"
          }
        </div>
        <div
          className="modal fade"
          id="reviewsModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="title"
          aria-hidden="true"
        >
          <div
            className={`modal-dialog modal-dialog-centered ${isQualified ? "modal-lg" : ""}`}
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header">
                Ratings And Reviews
                <button
                  className="close"
                  type="button"
                  aria-label="Close"
                  data-dismiss="modal"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className={`${isQualified ? "col-md-6 " : ""}average-rating text-center shop`}>
                    <h5>
                      <strong>Average Rating</strong>
                    </h5>
                    {
                      [1, 2, 3, 4, 5].map((rating) => (
                        <span
                          key={rating}
                          className={`fa fa-star big-star shop ${rating <= averageRating ?
                            "rated" : ""}`}
                        />
                      ))
                    }
                    {
                      this.state.loading ? (
                        <div className="submit-review"><i className="fa fa-spinner fa-spin" /></div>
                      ) : (
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
                                    <div className="r-and-r shop">{ratingAndReview.review}</div>
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
                      )
                    }
                  </div>
                  {
                    isQualified ? (
                      <div className="col-md-6">
                        <RateAndReviewShop refresh={this.refresh} />
                      </div>
                    ) : ""
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const computeAverage = (ratingsAndReviews, orders) => {
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
  const shopId = Reaction.getShopId();
  const userId = Meteor.userId();
  if (Meteor.subscribe("RatingsAndReviews", shopId).ready() && Meteor.subscribe("HasPurchased").ready()) {
    const ratingsAndReviews = RatingsAndReviews.find({
      productId: shopId
    }).fetch();
    const orders = Orders.find({}).fetch();
    onData(null, {
      averageRating: computeAverage(ratingsAndReviews, orders),
      hasPurchased: !!orders.length
    });
  }
};

registerComponent(
  "ShopRatingsAndReviewsComponent",
  ShopRatingsAndReviewsComponent,
  composeWithTracker(compose)
);

export default ShopRatingsAndReviewsComponent;

