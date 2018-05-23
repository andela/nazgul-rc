import { introJs } from "intro.js";
import { Meteor } from "meteor/meteor";
import customerOnboarding from "./customerOnboarding";
import * as Collections from "../../../../lib/collections/collections";

const userIntro = introJs();
const steps = customerOnboarding;
userIntro.setOptions({
  showBullets: false,
  showProgress: true,
  scrollToElement: true,
  steps
});

const initAutoTour = () => {
  const user = Collections.Accounts.findOne({ userId: Meteor.userId() });
  if (Meteor.user().emails.length === 0) {
    if (!localStorage.getItem("takenTour")) {
      setTimeout(() => {
        userIntro.start();
      }, 5000);
      localStorage.setItem("takenTour", true);
    }
  } else if (user.hasTakenTour === false && !localStorage.getItem("takenTour")) {
    setTimeout(() => {
      userIntro.start();
    }, 5000);
    Collections.Accounts.update(user._id,
      { $set: { hasTakenTour: true } }
    );
  }
  Collections.Accounts.update(user._id,
    { $set: { hasTakenTour: true } }
  );
};

const initManualTour = () => {
  userIntro.start();
};

const onboarding = {
  initAutoTour,
  initManualTour
};

export default onboarding;