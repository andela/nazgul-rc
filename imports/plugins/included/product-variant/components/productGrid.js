import React, { Component } from "react";
import PropTypes from "prop-types";
import { Reaction } from "/client/api";
import { Components } from "@reactioncommerce/reaction-components";
import startTour from "../../adminTour";
import onboarding from "../../onboarding/onboarding";

class ProductGrid extends Component {
  static propTypes = {
    products: PropTypes.array
  };

  componentDidMount() {
    if (!Reaction.hasPermission("admin")) {
      onboarding.initAutoTour();
    }
    startTour();
  }

  renderProductGridItems = products => {
    if (Array.isArray(products)) {
      return products.map((product, index) => {
        return <Components.ProductGridItems {...this.props} product={product} key={index} index={index} />;
      });
    }
    return (
      <div className="row">
        <div className="text-center">
          <h3>
            <Components.Translation defaultValue="No Products Found" i18nKey="app.noProductsFound" />
          </h3>
        </div>
      </div>
    );
  };

  render() {
    return (
      <div className="container-main">
        <div className="product-grid">
          <Components.DragDropProvider>
            <ul className="product-grid-list list-unstyled" id="product-grid-list">
              {this.renderProductGridItems(this.props.products)}
            </ul>
          </Components.DragDropProvider>
        </div>
      </div>
    );
  }
}

export default ProductGrid;
