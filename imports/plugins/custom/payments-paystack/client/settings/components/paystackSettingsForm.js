import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { TextField, Translation, Checkbox } from "/imports/plugins/core/ui/client/components";

const authorize = "Authorize";
const deAuthorize = "De-authorize";
const capture = "Capture";
const refund = "Refund";


class PaystackSettingsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      settings: {
        publicKey: props.settings.publicKey,
        secretKey: props.settings.secretKey,
        support: props.settings.support
      },
      checkbox: {
        "Authorize": _.includes(props.settings.support, authorize),
        "De-authorize": _.includes(props.settings.support, deAuthorize),
        "Capture": _.includes(props.settings.support, capture),
        "Refund": _.includes(props.settings.support, refund)
      }
    };
  }

  handleStateChange = (e) => {
    const { settings } = this.state;
    settings[e.target.name] = e.target.value;
    this.setState({ settings });
  }

  handleCheckBox = (event, isInputChecked, name) => {
    const { checkbox, settings } = this.state;
    checkbox[name] = isInputChecked;
    this.setState({ checkbox });
    if (!_.includes(settings.support, name) && isInputChecked) {
      settings.support.push(name);
      return this.setState({ settings });
    }
    const index = settings.support.indexOf(name);
    settings.support.splice(index, 1);
    return this.setState({ settings });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    return this.props.onSubmit(this.state.settings);
  }


  render() {
    const { settings } = this.props;
    const setting = this.state.settings;

    return (
      <div>
        { (!settings.secretKey && !settings.publicKey) &&
          <div className="alert alert-info">
            <Translation defaultValue="Paystack Credentials" i18nKey="admin.paymentSettings.paystackCredentials"/>
          </div>
        }
        <form onSubmit={this.handleSubmit}>
          <TextField
            label="SECRET Key"
            name="secretKey"
            type="text"
            onChange={this.handleStateChange}
            value={setting.secretKey}
          />
          <TextField
            label="PUBLIC Key"
            name="publicKey"
            type="text"
            onChange={this.handleStateChange}
            value={setting.publicKey}
          />

          <label className="control-label">
            <Translation defaultValue="Payment provider supported methods" i18nKey="reaction-payments.paymentSettings.supportedMethodsLabel"/>
          </label>
          <br/>

          <div>
            <Checkbox
              label = {authorize}
              onChange = {this.handleCheckBox}
              name = {authorize}
              checked = {this.state.checkbox.Authorize}
            />
          </div>

          <div>
            <Checkbox
              label={deAuthorize}
              onChange={this.handleCheckBox}
              name={deAuthorize}
              checked={this.state.checkbox["De-authorize"]}
            />
          </div>

          <div>
            <Checkbox
              label={capture}
              onChange={this.handleCheckBox}
              name={capture}
              checked={this.state.checkbox.Capture}
            />
          </div>

          <div>
            <Checkbox
              label={refund}
              onChange={this.handleCheckBox}
              name={refund}
              checked={this.state.checkbox.Refund}
            />
          </div>


          <button className="btn btn-primary pull-right" type="submit">
            <Translation defaultValue="Save Changes" i18nKey="app.saveChanges"/>
          </button>
        </form>

      </div>
    );
  }
}

PaystackSettingsForm.propTypes = {
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  settings: PropTypes.object
};

export default PaystackSettingsForm;
