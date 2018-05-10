import { Mongo } from "meteor/mongo";
import * as Schemas from "./schemas";

export const RatingsAndReviews = new Mongo.Collection("RatingsAndReviews");
RatingsAndReviews.attachSchema(Schemas.RatingsAndReviews);

