import { Meteor } from "meteor/meteor";
import { expect } from "meteor/practicalmeteor:chai";
import { sinon, stubs, spies } from "meteor/practicalmeteor:sinon";
import { StaticPages } from "../../../lib/collections";

const pageData = {
  _id: '1',
  pageName: 'My Demo Page',
  pageAddress: 'demo-page',
  pageContent: 'the content of this page',
  userId: '12',
  shopId: '12345',
  isEnabled: true,
  createdAt: new Date(),
  updatedAt: new Date()
};

describe("Static Page Mangement Methods", function () {
  let sandbox;

  before(function () {
    sandbox = sinon.sandbox.create();
  });

  after(function () {
    sandbox.restore();
  });

  // testing for edge cases 
  it("should throw an error when pageName is undefined", function () {
    pageData.pageName = 1;
    let { pageName, pageAddress, pageContent, userId, shopId, isEnabled, createdAt } = pageData;
    let insertPage = function(){
      Meteor.call("insertPage", pageName, pageAddress, pageContent, userId, shopId, isEnabled, createdAt);
    };
    expect(insertPage).to.throw('Match error: Expected string, got number');
  });

  // testing for edge cases 
  it("should throw an error when pageData has an undefined field", function () {
    pageData.pageName = undefined;
    let { pageName, pageAddress, pageContent, userId, shopId, isEnabled, createdAt } = pageData;
    let insertPage = function(){
      Meteor.call("insertPage", pageName, pageAddress, pageContent, userId, shopId, isEnabled, createdAt);
    };
    expect(insertPage).to.throw('Match error: Expected string, got undefined');
  });

  // Inserting data into the database 
  it("should not throw an error when data successfully insert page data", function () {
    pageData.pageName = 'My Demo Page';
    let { pageName, pageAddress, pageContent, userId, shopId, isEnabled, createdAt } = pageData;
    let insertPage = function(){
      Meteor.call("insertPage", pageName, pageAddress, pageContent, userId, shopId, isEnabled, createdAt);
    };
    expect(insertPage).to.not.throw();
  });

  // Update a record in the database
  it("should update a record from database", function () {
    pageData.pageAddress = 'demo';
    pageData.pageContent = 'this is a demo content of this page';
    let { _id, pageName, pageAddress, pageContent, userId, shopId, isEnabled, createdAt, updatedAt } = pageData;
    let insertPage = function(){
      Meteor.call("updatePage", _id, pageName, pageAddress, pageContent, userId, shopId, isEnabled, createdAt, updatedAt);
    };
    expect(insertPage).to.not.throw();
  });

  // Get all records in the database
  it("should get all data records from database", function () {
    let { _id, pageName, pageAddress, pageContent, userId, shopId, isEnabled, createdAt } = pageData;
    const pageDetails = StaticPages.find({ _id }).fetch();
    expect(pageDetails).to.be.deep.equal([]);
  });
});
