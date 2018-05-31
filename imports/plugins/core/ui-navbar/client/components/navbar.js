import React, { Component } from "react";
import PropTypes from "prop-types";
import { Reaction, Router } from "/client/api";
import { Components } from "@reactioncommerce/reaction-components";
import { Meteor } from "meteor/meteor";
import startTour from "../../../../included/adminTour";
import ShopRatingsAndReviewsComponent from "../../../../custom/ratings-and-reviews/client/components/shopRatingsAndReviews.jsx";
import onboarding from "../../../../included/onboarding/onboarding";

// TODO: Delete this, and do it the react way - Mike M.
async function openSearchModalLegacy(props) {
  if (Meteor.isClient) {
    const { Blaze } = await import("meteor/blaze");
    const { Template } = await import("meteor/templating");
    const { $ } = await import("meteor/jquery");

    const searchTemplate = Template[props.searchTemplate];

    Blaze.renderWithData(searchTemplate, {}, $("html").get(0));

    $("body").css("overflow", "hidden");
    $("#search-input").focus();
  }
}

class NavBar extends Component {
  static propTypes = {
    brandMedia: PropTypes.object,
    hasProperPermission: PropTypes.bool,
    searchEnabled: PropTypes.bool,
    shop: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.startOnboarding = this.startOnboarding.bind(this);
  }

  state = {
    navBarVisible: false
  };

  toggleNavbarVisibility = () => {
    const isVisible = this.state.navBarVisible;
    this.setState({ navBarVisible: !isVisible });
  };

  handleCloseNavbar = () => {
    this.setState({ navBarVisible: false });
  };

  handleOpenSearchModal = () => {
    openSearchModalLegacy(this.props);
  };

  renderLanguage() {
    return (
      <div className="languages hidden-xs language-e">
        <Components.LanguageDropdown />
      </div>
    );
  }

  renderCurrency() {
    return (
      <div className="currencies hidden-xs currency-e">
        <Components.CurrencyDropdown />
      </div>
    );
  }

  renderBrand() {
    const shop = this.props.shop || { name: "" };
    const logo = this.props.brandMedia && this.props.brandMedia.url();

    return <Components.Brand logo={logo} title={shop.name} />;
  }

  renderSearchButton() {
    if (this.props.searchEnabled) {
      return (
        <div className="search search-e">
          <Components.FlatButton
            icon="fa fa-search"
            kind="flat"
            onClick={this.handleOpenSearchModal}
          />
        </div>
      );
    }
  }

  renderOnboardingButton() {
    if (!Reaction.hasPermission("admin")) {
      return (
        <div className="takeTour search">
          <button onClick={this.startOnboarding} className="rui btn btn-default flat button" type="button" kind="flat">
            Take a Tour
          </button>
        </div>
      );
    }
  }

  renderRatingsAndReviews() {
    return (
      <div className="search">
        <Components.ShopRatingsAndReviewsComponent />
      </div>
    );
  }

  startOnboarding(e) {
    e.preventDefault();
    const windowPage = Router.current().route.path.indexOf("/tag/");
    if (windowPage !== 0) {
      Router.go("/tag/shop");
    }
    if (Router.current().route.path === "/tag/shop") {
      setTimeout(() => {
        onboarding.initManualTour();
      }, 1000);
    }
  }

  renderNotificationIcon() {
    if (this.props.hasProperPermission) {
      return (
        <div className="notification-e">
          <Components.Notification />
        </div>
      );
    }
  }

  renderCartContainerAndPanel() {
    return (
      <div className="cart-container">
        <div className="cart">
          <Components.CartIcon />
        </div>
        <div className="cart-alert">
          <Components.CartPanel />
        </div>
      </div>
    );
  }

  renderMainDropdown() {
    return <Components.MainDropdown />;
  }

  renderHamburgerButton() {
    return (
      <div className="showmenu showmenu-e"><Components.Button icon="bars" onClick={this.toggleNavbarVisibility} /></div>
    );
  }

  renderTagNav() {
    return (
      <div className="menu">
        <Components.TagNav isVisible={this.state.navBarVisible} closeNavbar={this.handleCloseNavbar}>
          <Components.Brand />
        </Components.TagNav>
      </div>
    );
  }
  renderStaticPages() {
    return <Components.StaticPagesComponent />;
  }

  renderTakeTourButton() {
    if (!Reaction.hasPermission("admin")) {
      return null;
    }
    return (
      <div className="take-tour">
        <Components.Button
          kind="flat"
          label="Take Tour"
          onClick={event => {
            startTour(event);
          }}
          className="take-tour-span"
        />
      </div>
    );
  }

  render() {
    return (
      <div className="rui navbar">
        {this.renderHamburgerButton()}
        {this.renderBrand()}
        {this.renderTagNav()}
        {this.renderSearchButton()}
        {this.renderTakeTourButton()}
        {this.renderNotificationIcon()}
        {this.renderOnboardingButton()}
        {this.renderRatingsAndReviews()}
        {this.renderLanguage()}
        {this.renderCurrency()}
        {this.renderStaticPages()}
        {this.renderMainDropdown()}
        {this.renderCartContainerAndPanel()}
      </div>
    );
  }
}

export default NavBar;
