import React, { Component } from "react";
import PropTypes from "prop-types";
import { Reaction } from "/client/api";
import _ from "lodash";
import * as Collections from "/lib/collections";
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
  /**
   * Renders Filter component
   *
   * @returns {object} JSX DOM
   * @memberof SearchModal
   */
  renderFilter() {
    let vendors = [];
    this.props.products.forEach(product => vendors.push(product.vendor));
    vendors = _.uniq(vendors);

    return (
      <div className="nazgul-rc-filter" style={{ display: "inline-block", margin: "10px" }}>
        <span>Filter By</span>
        <select onChange={event => this.props.handleFilter(event, "price")} style={{ margin: "5px" }}>
          <option value="0">Price</option>
          <option value="0-99">0 - &#x20a6;99</option>
          <option value="100-999">&#x20a6;100 - &#x20a6;999</option>
          <option value="1000-9999">&#x20a6;1000 - &#x20a6;9999</option>
        </select>
        <select onChange={event => this.props.handleFilter(event, "vendor")} style={{ margin: "5px" }}>
          <option value="0">All Vendors</option>
          {vendors.map(vendor => <option value={vendor}>{vendor}</option>)}
        </select>
      </div>
    );
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
        <select onChange={event => this.props.handleFilter(event, "price")} style={{ margin: "5px" }}>
          <option value="0">Price</option>
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
          <div className="nazgul-sort-filter" style={{ fontSize: "2em" }}>
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
