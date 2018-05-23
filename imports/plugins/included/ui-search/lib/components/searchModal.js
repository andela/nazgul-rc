import React, { Component } from "react";
import PropTypes from "prop-types";
import { Reaction } from "/client/api";
import _ from "lodash";
import { ProductSearch } from "/lib/collections";
import { TextField, Button, IconButton, SortableTableLegacy } from "@reactioncommerce/reaction-ui";
import ProductGridContainer from "/imports/plugins/included/product-variant/containers/productGridContainer";
import { accountsTable } from "../helpers";

class SearchModal extends Component {
  static propTypes = {
    accounts: PropTypes.array,
    handleAccountClick: PropTypes.func,
    handleChange: PropTypes.func,
    handleClick: PropTypes.func,
    handleFilter: PropTypes.func,
    handleSort: PropTypes.func,
    handleTagClick: PropTypes.func,
    handleToggle: PropTypes.func,
    products: PropTypes.array,
    siteName: PropTypes.string,
    tags: PropTypes.array,
    unmountMe: PropTypes.func,
    value: PropTypes.string
  };
  constructor(props) {
    super(props);
    this.state = {
      vendors: [],
      isFilterAction: false,
      sortOrder: "asc",
      sortType: "newest"
    };
  }

  componentWillMount() {
    let vendors = [];
    this.props.products.forEach(product => vendors.push(product.vendor));
    vendors = _.uniq(vendors);
    return this.setState({ vendors });
  }

  componentWillReceiveProps(props) {
    if (localStorage.getItem("FilterAction")) {
      localStorage.removeItem("FilterAction");
      return;
    }

    let vendors = [];
    props.products.forEach(product => vendors.push(product.vendor));
    vendors = _.uniq(vendors);
    return this.setState({ vendors });
  }

  renderSearchInput() {
    return (
      <div className="rui search-modal-input">
        <label data-i18n="search.searchInputLabel">Search {this.props.siteName}</label>
        <i className="fa fa-search search-icon" />
        <TextField className="search-input" textFieldStyle={{ marginBottom: 0 }} onChange={this.props.handleChange} value={this.props.value} />
        <Button
          className="search-clear"
          i18nKeyLabel="search.clearSearch"
          label="Clear"
          containerStyle={{ fontWeight: "normal" }}
          onClick={this.props.handleClick}
        />
      </div>
    );
  }

  renderSearchTypeToggle() {
    if (Reaction.hasPermission("admin")) {
      return (
        <div className="rui search-type-toggle">
          <div
            className="search-type-option search-type-active"
            data-i18n="search.searchTypeProducts"
            data-event-action="searchCollection"
            data-event-value="products"
            onClick={() => this.props.handleToggle("products")}
          >
            Products
          </div>
          {Reaction.hasPermission("accounts") && (
            <div
              className="search-type-option"
              data-i18n="search.searchTypeAccounts"
              data-event-action="searchCollection"
              data-event-value="accounts"
              onClick={() => this.props.handleToggle("accounts")}
            >
              Accounts
            </div>
          )}
        </div>
      );
    }
  }

  renderProductSearchTags() {
    return (
      <div className="rui search-modal-tags-container">
        <p className="rui suggested-tags" data-i18n="search.suggestedTags">
          Suggested tags
        </p>
        <div className="rui search-tags">
          {this.props.tags.map(tag => (
            <span className="rui search-tag" id={tag._id} key={tag._id} onClick={() => this.props.handleTagClick(tag._id)}>
              {tag.name}
            </span>
          ))}
        </div>
      </div>
    );
  }

  handleFilter(event, type) {
    localStorage.setItem("FilterAction", true);
    this.props.handleFilter(event, type);
  }
  /**
   * Renders Filter component
   *
   * @returns {object} JSX DOM
   * @memberof SearchModal
   */
  renderFilter() {
    return (
      <div className="nazgul-rc-filter" style={{ display: "inline-block", margin: "10px" }}>
        <span>Filter By</span>
        <select id="price" onChange={event => this.handleFilter(event, "price")} style={{ margin: "5px" }}>
          <option value="0">All Price</option>
          <option value="0-99">0 - &#x20a6;99</option>
          <option value="100-999">&#x20a6;100 - &#x20a6;999</option>
          <option value="1000-9999">&#x20a6;1000 - &#x20a6;9999</option>
          <option value="10000-99999">&#x20a6;10000 - &#x20a6;99999</option>
          <option value="100000-999999">&#x20a6;100000 - &#x20a6;999999</option>
        </select>
        <select id="vendor" onChange={event => this.handleFilter(event, "vendor")} style={{ margin: "5px" }}>
          <option value="0">All Vendors</option>
          {this.state.vendors.map(vendor => <option value={vendor}>{vendor}</option>)}
        </select>
      </div>
    );
  }
  handleSort(sortType, sortOrder) {
    this.props.handleSort(sortType, sortOrder);
  }

  /**
   * Renders Sort Component
   *
   * @returns {object} JSX DOM
   * @memberof SearchModal
   */
  renderSort() {
    if (!this.props.products.length) return null;

    return (
      <div className="nazgul-rc-sort" style={{ display: "inline-block", margin: "10px" }}>
        <span>Sort By</span>
        <select
          onChange={event => {
            this.setState({ sortType: event.target.value });
            this.handleSort(event.target.value, this.state.sortOrder);
          }}
          style={{ margin: "5px" }}
        >
          <option value="newest">Newest Product</option>
          <option value="price">Price</option>
          <option value="vendor">Vendor</option>
        </select>
        <select
          onChange={event => {
            this.setState({ sortOrder: event.target.value });
            this.handleSort(this.state.sortType, event.target.value);
          }}
          style={{ margin: "5px" }}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    );
  }

  render() {
    return (
      <div>
        <div className="rui search-modal-close">
          <IconButton icon="fa fa-times" onClick={this.props.unmountMe} />
        </div>
        <div className="rui search-modal-header">
          {this.renderSearchInput()}
          {this.renderSearchTypeToggle()}
          {this.props.tags.length > 0 && this.renderProductSearchTags()}
        </div>
        <div className="rui search-modal-results-container">
          <div className="nazgul-sort-filter" style={{ fontSize: "2em", textAlign: "center" }}>
            {this.renderFilter()}
            {this.renderSort()}
          </div>
          {this.props.products.length > 0 && <ProductGridContainer products={this.props.products} unmountMe={this.props.unmountMe} isSearch={true} />}
          {this.props.accounts.length > 0 && (
            <div className="data-table">
              <div className="table-responsive">
                <SortableTableLegacy data={this.props.accounts} columns={accountsTable()} onRowClick={this.props.handleAccountClick} />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default SearchModal;
