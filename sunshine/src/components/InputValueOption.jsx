import React, { Component } from "react";
import { Input, Select } from "antd";

const { Option } = Select;

class InputValueOption extends Component {
  static getDerivedStateFromProps(nextProps) {
    // Should be a controlled component.
    if ("value" in nextProps) {
      return {
        ...(nextProps.value || {})
      };
    }
    return null;
  }

  constructor(props) {
    super(props);

    const value = props.value || {};
    this.state = {
      value: value.value || 0,
      percentage: value.percentage || "true"
    };
  }

  handleNumberChange = e => {
    const value = parseInt(e.target.value || 0, 10);
    if (Number.isNaN(value)) {
      return;
    }
    if (!("value" in this.props)) {
      this.setState({ value });
    }
    this.triggerChange({ value });
  };

  handlePercentageChange = percentage => {
    if (!("value" in this.props)) {
      this.setState({ percentage });
    }
    this.triggerChange({ percentage });
  };

  triggerChange = changedValue => {
    // Should provide an event to pass value to Form.
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue));
    }
  };

  render() {
    const { size } = this.props;
    const state = this.state;
    return (
      <span>
        <Input
          type="text"
          size={size}
          value={state.value}
          onChange={this.handleNumberChange}
          style={{ width: "24%", marginRight: "3%" }}
        />
        <Select
          value={state.percentage}
          size={size}
          style={{ width: "23%" }}
          onChange={this.handlePercentageChange}
        >
          <Option value="true">(%)</Option>
          <Option value="false">Rs:</Option>
        </Select>
      </span>
    );
  }
}

export default InputValueOption;
