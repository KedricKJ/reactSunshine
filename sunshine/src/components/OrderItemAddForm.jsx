import React, { Component } from "react";
import {
  Form,
  Drawer,
  Row,
  Col,
  Select,
  InputNumber,
  DatePicker,
  Button
} from "antd";
import axios from "axios";
import moment from "moment";
import Auth from "../modules/Auth";
import {
  ServiceTypes,
  ReturnTypes,
  OrderTypes,
  DeliveryTypes
} from "../utils/Utils";
let headers = { "Content-Type": "application/json" };
if (Auth.getToken()) {
  headers["Authorization"] = `Bearer ${Auth.getToken()}`;
}

const Option = Select.Option;

let selectedItemId = null;
let selectedServiceType = null;
let selectedOrderType = null;
let selectedReturnType = null;
let selectedDeliveryType = null;

class OrderItemAddForm extends Component {
  state = {
    orderTypes: [],
    serviceTypes: [],
    returnTypes: [],
    items: [],
    unitPrice: null,
    totalPrice: null,
    quantity: null
  };

  componentDidMount() {
    this.getItems();
  }

  handleItemChange = selectedValue => {
    selectedItemId = selectedValue;
    this.getUnitPrice();
  };

  handleServiceTypeChange = selectedValue => {
    selectedServiceType = selectedValue;
    this.getUnitPrice();
  };

  handleOrderTypeChange = selectedValue => {
    selectedOrderType = selectedValue;
    this.getUnitPrice();
  };

  handleReturnTypeChange = selectedValue => {
    selectedReturnType = selectedValue;
    this.getUnitPrice();
  };

  handleDeliveryTypeChange = selectedValue => {
    selectedDeliveryType = selectedValue;
    this.getUnitPrice();
  };

  handleQtyChange = quantity => {
    let totalPrice = this.state.unitPrice * quantity;
    this.setState({ totalPrice: totalPrice, quantity });
    this.props.form.setFieldsValue({
      totalPrice: totalPrice
    });
  };

  getUnitPrice = () => {
    console.log(
      "Price: ",
      selectedItemId,
      ", ST:",
      selectedServiceType,
      ", OT:",
      selectedOrderType,
      ",RT:",
      selectedReturnType,
      ",DT:",
      selectedDeliveryType
    );
    if (
      selectedItemId &&
      selectedServiceType &&
      selectedOrderType &&
      selectedReturnType &&
      selectedDeliveryType
    ) {
      const payload = {
        item: { id: selectedItemId },
        serviceType: selectedServiceType,
        orderType: selectedOrderType,
        returnType: selectedReturnType,
        deliveryType: selectedDeliveryType
      };
      console.log("payload: ", payload);
      axios
        .post("/unitPrices/order", payload, { headers })
        .then(res => {
          if (res.data) {
            console.log("Unit price: ", res.data.content.unitPrice);
            this.setState({ unitPrice: res.data.content.unitPrice });
            this.props.form.setFieldsValue({
              unitPrice: res.data.content.unitPrice
            });
            if (this.state.quantity != null) {
              let totalPrice = res.data.content.unitPrice * this.state.quantity;
              this.setState({ totalPrice });
            }
          }
        })
        .catch(err => {
          console.log(err);
          this.setState({ unitPrice: null, totalPrice: null });
        });
    }
  };

  getItems = () => {
    axios.get("/items", { headers }).then(res => {
      if (res.data) {
        this.setState({ items: res.data.content });
      }
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    e.stopPropagation();
    const { onAddItem } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.item = this.state.items.find(item => item.id === values.item);
        values.id =
          values.item.id +
          values.serviceType +
          values.orderType +
          values.returnType +
          values.deliveryType;
        values.deliveryTime = moment(values.deliveryTime).format("YYYY-MM-DD");
        onAddItem(values);
        this.props.form.resetFields();
        this.setState({ unitPrice: null, totalPrice: null });
        this.clearUnitPriceCalculationValues();
      }
    });
  };

  clearUnitPriceCalculationValues = () => {
    selectedItemId = null;
    selectedServiceType = null;
    selectedOrderType = null;
    selectedReturnType = null;
    selectedDeliveryType = null;
  };

  handleOnClose = () => {
    this.props.form.resetFields();
    this.props.onClose();
  };

  render() {
    const { form, onClose, visible } = this.props;
    const { getFieldDecorator } = form;
    const { items, unitPrice, totalPrice } = this.state;

    return (
      <Drawer
        title="Add New Order Item"
        width={720}
        visible={visible}
        onClose={onClose}
        style={{
          overflow: "auto",
          height: "calc(100% - 108px)",
          paddingBottom: "108px"
        }}
      >
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Item" hasFeedback>
                {getFieldDecorator(`item`, {
                  rules: [{ required: true, message: "Please select item" }]
                })(
                  <Select
                    placeholder="Please select"
                    onChange={this.handleItemChange}
                  >
                    {items.map(d => (
                      <Option key={d.id} value={d.id}>
                        {d.name}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Service Type" hasFeedback>
                {getFieldDecorator(`serviceType`, {
                  rules: [
                    { required: true, message: "Please select service type" }
                  ]
                })(
                  <Select
                    placeholder="Please select"
                    onChange={this.handleServiceTypeChange}
                  >
                    {ServiceTypes.map(d => (
                      <Option key={d.value} value={d.value}>
                        {d.name}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Order Type" hasFeedback>
                {getFieldDecorator(`orderType`, {
                  rules: [
                    { required: true, message: "Please select order type" }
                  ]
                })(
                  <Select
                    placeholder="Please select"
                    onChange={this.handleOrderTypeChange}
                  >
                    {OrderTypes.map(d => (
                      <Option key={d.value} value={d.value}>
                        {d.name}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Return Type" hasFeedback>
                {getFieldDecorator(`returnType`, {
                  rules: [{ required: true, message: "Select return type" }]
                })(
                  <Select
                    placeholder="Please select"
                    onChange={this.handleReturnTypeChange}
                  >
                    {ReturnTypes.map(d => (
                      <Option key={d.value} value={d.value}>
                        {d.name}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Delivery Type" hasFeedback>
                {getFieldDecorator(`deliveryType`, {
                  rules: [{ required: true, message: "Select delivery type" }]
                })(
                  <Select
                    placeholder="Please select"
                    onChange={this.handleDeliveryTypeChange}
                  >
                    {DeliveryTypes.map(d => (
                      <Option key={d.value} value={d.value}>
                        {d.name}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Unit Price" hasFeedback>
                {getFieldDecorator(`unitPrice`, {
                  initialValue: unitPrice,
                  rules: [
                    { required: true, message: "Please enter unit price" }
                  ]
                })(<InputNumber placeholder="Unit Price" readOnly />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Delivery Date" hasFeedback>
                {getFieldDecorator("deliveryTime", {
                  rules: [
                    { required: true, message: "Please enter valid date" }
                  ]
                })(
                  <DatePicker placeholder="Delivery date" format="YYYY-MM-DD" />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Quantity" hasFeedback>
                {getFieldDecorator(`quantity`, {
                  rules: [{ required: true, message: "Please enter quantity" }]
                })(
                  <InputNumber
                    placeholder="Quantity"
                    onChange={this.handleQtyChange}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="No of hangers" hasFeedback>
                {getFieldDecorator(`numberOfHanger`, {
                  rules: [
                    { required: true, message: "Please enter #of hangers" }
                  ]
                })(<InputNumber placeholder="#of hangers" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Total Price" hasFeedback>
                {getFieldDecorator(`totalPrice`, {
                  initialValue: totalPrice,
                  rules: [
                    { required: true, message: "Please enter unit price" }
                  ]
                })(<InputNumber placeholder="Total" readOnly />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            width: "100%",
            borderTop: "1px solid #e9e9e9",
            padding: "10px 16px",
            background: "#fff",
            textAlign: "right"
          }}
        >
          <Button onClick={this.handleOnClose} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button onClick={this.handleSubmit} type="primary">
            Add Item
          </Button>
        </div>
      </Drawer>
    );
  }
}

export default Form.create()(OrderItemAddForm);
