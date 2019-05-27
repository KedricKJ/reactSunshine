import React, { Component } from "react";
import { Form, Drawer, Row, Col, Select, InputNumber, Button } from "antd";
import Auth from "../modules/Auth";
import { PaymentTypes, PaymentOptions } from "../utils/Utils";
let headers = { "Content-Type": "application/json" };
if (Auth.getToken()) {
  headers["Authorization"] = `Bearer ${Auth.getToken()}`;
}

const Option = Select.Option;

class PaymentAddForm extends Component {
  handleSubmit = e => {
    e.preventDefault();
    e.stopPropagation();
    const { onAddPayment } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.id = values.paymentType + values.paymentOption;
        onAddPayment(values);
        this.props.form.resetFields();
      }
    });
  };

  render() {
    const { form, onClose, visible } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Drawer
        title="Add Payment"
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
          <Row gutter={8}>
            <Col>
              <Form.Item label="Payment Type" hasFeedback>
                {getFieldDecorator(`paymentType`, {
                  rules: [
                    { required: true, message: "Please select payment type" }
                  ]
                })(
                  <Select placeholder="Please select">
                    {PaymentTypes.map(d => (
                      <Option key={d.value} value={d.value}>
                        {d.name}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col>
              <Form.Item label="Payment Option" hasFeedback>
                {getFieldDecorator(`paymentOption`, {
                  rules: [
                    { required: true, message: "Please select payment option" }
                  ]
                })(
                  <Select
                    placeholder="Please select"
                    onChange={this.handleOrderTypeChange}
                  >
                    {PaymentOptions.map(d => (
                      <Option key={d.value} value={d.value}>
                        {d.name}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col>
              <Form.Item label="Amount" hasFeedback>
                {getFieldDecorator(`amount`, {
                  rules: [{ required: true, message: "Please enter amount" }]
                })(<InputNumber placeholder="Amount" />)}
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
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button onClick={this.handleSubmit} type="primary">
            Add Payment
          </Button>
        </div>
      </Drawer>
    );
  }
}

export default Form.create()(PaymentAddForm);
