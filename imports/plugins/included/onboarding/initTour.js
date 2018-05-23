import { introJs } from "intro.js";
import { Meteor } from "meteor/meteor";
import { Reaction } from "/client/api";
import vendourTourGuide from "./vendorTour";
import * as Collections from "../../../../lib/collections/collections";

const intro = introJs();
const steps = vendourTourGuide;
intro.setOptions({
  showBullets: false,
  showProgress: true,
  scrollToElement: true,
  steps
});

const initAutoTour = () => {
  const isVendor = Reaction.hasPermission("seller") || Reaction.hasPermission("owner");;
  const user = Collections.Accounts.findOne({ userId: Meteor.userId() }).fetch();
  if (user.hasTakenTour === false && isVendor) {
    intro.start();
    Collections.Accounts.update(user._id,
      { $set: { hasTakenTour: true } }
    );
  }
};

const initManualTour = () => {
  intro.start();
};

const tourSetup = {
  initAutoTour,
  initManualTour
};

export default tourSetup;