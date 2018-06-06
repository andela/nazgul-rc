import { Reaction } from "/client/api";
import { introJs } from "intro.js";
import "/node_modules/intro.js/introjs.css";

const steps = [
  {
    intro: `<h3>Welcome to Reaction Commerce </h3>
            <hr />
            <p>Thank you for using Reaction Commerce. Let me take you through the platform.</p>`
  },
  {
    element: "#openReviewsModal",
    intro: `<h3>SHOP REVIEW</h3>
            <hr />
            <p>When customers review your shop, 
            the average ratings of those reviews are computed. You can always get the average rating of those reviews here.</p>
    `
  },
  {
    element: ".accounts button",
    intro: "Under this Account Menu, you can fund your wallet and transfer funds with the wallet feature. Also, this is where you sign out from your account."
  },
  {
    element: ".nazgul-for-all-0",
    intro: `<h3>ORDERS</h3>
            <hr>
            <p>This is the section where you see all the orders made in the store.<p>
<p>You get to see the detail of an order this includes:</p>
<p>The customer's details and general order summary.</p>`
  },
  {
    element: ".nazgul-for-all-2",
    intro: `<h3>ACCOUNTS</h3>
            <hr>
            <p>You can manage all account here.</p>
<ul>
<li>You can create users and assign roles to the user.</li>
<li>You can create groups and activate what operation each group is authorized to perform.</li>
</ul>`
  },
  {
    element: ".nazgul-for-all-3",
    intro: `<h3>SHOP SETTING</h3>
            <hr>
            <p>You can change the details of the store under the general setting tab, set up open exchange rates application and activate marketplace.</p>`
  },
  {
    element: ".nazgul-for-all-4",
    intro: `<h3>EMAIL</h3>
            <hr>
            <p>You can set up an email address with any email provider of your choice here.</p>`
  },
  {
    element: ".nazgul-for-all-5",
    intro: `<h3>LOCALIZATION</h3>
            <hr>
            <p>In this section, you can setup timezone, base currency, units and preferred available languages for the store.</p>`
  },
  {
    element: ".nazgul-for-all-11",
    intro: `<h3>SMS</h3>
            <hr>
            <p>You can setup SMS notification in the panel. Just provide the SMS Phone Number And the API Key and you are good to go.</p>`
  },
  {
    element: ".nazgul-for-all-12",
    intro: `<h3>PAYMENT</h3>
            <hr>
            <p>All the payment options for the store can be activated and configured here.</p>`
  },
  {
    intro: `<h3>Reaction Tour</h3>
            <hr>
            <p>That is it! Hope this tour has been helpful? You can try out all these features now and take the tour anytime.</p>`
  }
];

const intro = new introJs().onafterchange(function (targetElement) {
  if (targetElement.id === "openReviewsModal"
    || targetElement.className === "rui btn btn-default flat introjs-showElement introjs-relativePosition") return;
  targetElement.click();
});
intro.setOptions({ steps });

const startTour = () => {
  if (Reaction.hasPermission("admin")) {
    intro.start();
  }
};

export default event => {
  if (event) startTour();
  if (!localStorage.getItem("TOUR_TAKEN")) {
    localStorage.setItem("TOUR_TAKEN", true);
    startTour();
  }
};
