import { Reaction } from "/client/api";
import { introJs } from "intro.js";
import "/node_modules/intro.js/introjs.css";

const steps = [
  {
    intro: `<h3>Welcome to Reaction Commerce </h3>
            <hr>
            <p>Thank you for using Reaction Commerce. Let me take you through the platform.</p>`
  },
  {
    element: ".nazgul-for-all-0",
    intro: `<h3>ORDERS</h3>
            <hr>
            <p>This is the section where you see all the orders made in the store.</p>`
  },
  {
    element: ".nazgul-for-all-1",
    intro: `<h3>ACCOUNTS</h3>
            <hr>
            <p>You can manage all account here. Including creating account for groups.</p>`
  },
  {
    element: ".nazgul-for-all-3",
    intro: `<h3>SHOP SETTING</h3>
            <hr>
            <p>You can change the title of the store in this section.</p>`
  },
  {
    element: ".nazgul-for-all-4",
    intro: `<h3>EMAIL</h3>
            <hr>
            <p>You can setup email address with any email provider of your choice.</p>`
  },
  {
    element: ".nazgul-for-all-5",
    intro: `<h3>LOCALIZATION</h3>
            <hr>
            <p>In this section you can setup TimeZone, Base Currency and Units.</p>`
  },
  {
    element: ".nazgul-for-all-11",
    intro: `<h3>SMS</h3>
            <hr>
            <p>You can setup SMS notification in the panel. Just provide the SMS Phone Number
And the API Key and you are good to go.</p>`
  },
  {
    element: ".nazgul-for-all-12",
    intro: `<h3>PAYMENT</h3>
            <hr>
            <p>All the payment options for your store can be setup here.</p>`
  },
  {
    intro: `<h3>Reaction Tour</h3>
            <hr>
            <p>That is it! Hope this tour has been helpful? You can try out all these features now.</p>`
  }
];

const intro = new introJs();
intro.setOptions({ steps });

const startTour = () => {
  if (Reaction.hasPermission("admin")) {
    intro.start();
  }
};

export default (event) => {
  if (event) startTour();
  if (!localStorage.getItem("TOUR_TAKEN")) {
    localStorage.setItem("TOUR_TAKEN", true);
    startTour();
  }
};
