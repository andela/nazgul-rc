const steps = [
  {
    intro: `<h2>Welcome to Reaction Commerce.</h2>
    <hr>
    <div class="tourcontainer">
     This is a short onboarding that takes you through the interface.
    </div>`
  },
  {
    element: ".product-grid-list",
    intro: `<h2>The Products</h2>
    <hr>
    <div>
      You can select a product here and it will be added to your cart.
    </div>`
  },
  {
    element: ".search",
    intro: `<h2>Product Search</h2>
    <hr>
    <div class="tourcontainer">
      A product can be searched for here.
    </div>`
  },
  {
    element: ".cart",
    intro: `<h2>Shopping Cart</h2>
    <hr>
    <div class="tourcontainer">
    This is your cart which holds  all your current products you have selected.
    </div>`
  },
  {
    element: ".accounts",
    intro: `<h2>Your Account</h2>
    <hr>
    <div class="tourcontainer">
      This holds everything related to your account like
      signing up, signing in, user profile and your wallet.
    </div>`
  },
  {
    element: ".languages",
    intro: `<h2>Language Support</h2>
    <hr>
    <div class="tourcontainer">
      You can change the default language as required here.
    </div>`
  },
  {
    element: ".brand",
    intro: `<h2>Our shop</h2>
    <hr>
    <div class="tourcontainer">
      This is where the shop you are on is displayed.
    </div>`
  },
  {
    element: ".takeTour",
    intro: `<h2>Tour Button</h2>
    <hr>
    <div class="tourcontainer">	
      You can always take this tour again at anytime by clicking this button.
    </div>`
  },
  {
    element: "#tour-button",
    intro: `<h2>Tour</h2>
    <hr>
    <div class="tourcontainer">
      This is the end of the tour.
      You can go back and forth or start this tour from the homepage by clicking the 'Take a tour' button.
    </div>`
  }
];
export default steps;
