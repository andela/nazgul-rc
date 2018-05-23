import { SimpleSchema } from "meteor/aldeed:simple-schema";
import { registerSchema } from "@reactioncommerce/reaction-collections";

const RatingsAndReviews = new SimpleSchema({
  rating: {
    type: Number,
    optional: false
  },
  review: {
    type: String,
    optional: false
  },
  userId: {
    type: String,
    optional: false
  },
  name: {
    type: String,
    optional: false
  },
  productId: {
    type: String,
    optional: false
  },
  date: {
    type: String,
    optional: false
  }
});

registerSchema("RatingsAndReviews", RatingsAndReviews);
export default RatingsAndReviews;
