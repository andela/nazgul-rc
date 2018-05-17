import React, { Component } from "react";
import { compose } from "recompose";
import _ from "lodash";
import { Reaction } from "/client/api";
import { registerComponent } from "@reactioncommerce/reaction-components";
import SearchSubscription from "./searchSubscription";

function tagToggle(arr, val) {
  if (arr.length === _.pull(arr, val).length) {
    arr.push(val);
  }
  return arr;
}

const wrapComponent = Comp =>
  class SearchModalContainer extends Component {
    constructor(props) {
      super(props);
      this.state = {
        collection: "products",
        value: localStorage.getItem("searchValue") || "",
        renderChild: true,
        facets: [],
        filterKey: {}
      };
    }

    componentDidMount() {
      document.addEventListener("keydown", this.handleKeyDown);
    }

    componentWillUnmount() {
      document.removeEventListener("keydown", this.handleKeyDown);
    }

    handleKeyDown = event => {
      if (event.keyCode === 27) {
        this.setState({
          renderChild: false
        });
      }
    };

    setPriceFilter(price) {
      if (price === "0") {
        const { price, ...state } = this.state.filterKey;
        return this.setState({ filterKey: state });
      }
      const minMaxPrice = price.split("-");
      this.setState({
        filterKey: {
          ...this.state.filterKey,
          price: {
            "price.min": minMaxPrice[0],
            "price.max": minMaxPrice[1]
          }
        }
      });
    }
    setVendorFilter(vendorParam) {
      if (vendorParam === "0") {
        const { vendor, ...state } = this.state.filterKey;
        return this.setState({ filterKey: state });
      }
      this.setState({
        filterKey: {
          ...this.state.filterKey,
          vendor: vendorParam
        }
      });
    }

    handleFilter = (event, type) => {
      if (type === "price") this.setPriceFilter(event.target.value);
      if (type === "vendor") this.setVendorFilter(event.target.value);
    };

    handleChange = (event, value) => {
      localStorage.setItem("searchValue", value);

      this.setState({ value });
    };

    handleClick = () => {
      localStorage.setItem("searchValue", "");
      this.setState({ value: "" });
    };

    handleAccountClick = event => {
      Reaction.Router.go("account/profile", {}, { userId: event._id });
      this.handleChildUnmount();
    };

    handleTagClick = tagId => {
      const newFacet = tagId;
      const element = document.getElementById(tagId);
      element.classList.toggle("active-tag");

      this.setState({
        facets: tagToggle(this.state.facets, newFacet)
      });
    };

    handleToggle = collection => {
      this.setState({ collection });
    };

    handleChildUnmount = () => {
      this.setState({ renderChild: false });
    };

    render() {
      return (
        <div>
          {this.state.renderChild ? (
            <div className="rui search-modal js-search-modal">
              <Comp
                handleChange={this.handleChange}
                handleClick={this.handleClick}
                handleToggle={this.handleToggle}
                handleAccountClick={this.handleAccountClick}
                handleTagClick={this.handleTagClick}
                handleFilter={this.handleFilter}
                value={this.state.value}
                unmountMe={this.handleChildUnmount}
                searchCollection={this.state.collection}
                facets={this.state.facets}
                filterKey={this.state.filterKey}
              />
            </div>
          ) : null}
        </div>
      );
    }
  };

registerComponent("SearchSubscription", SearchSubscription, [wrapComponent]);

export default compose(wrapComponent)(SearchSubscription);
