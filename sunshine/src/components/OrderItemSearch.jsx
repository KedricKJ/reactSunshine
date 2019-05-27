import React, { Component } from "react";
import { Form, Row, Col, DatePicker, Button, Select } from "antd";
import Auth from "../modules/Auth";
import { OrderTypes } from "../utils/Utils";
import axios from "axios";
import moment from "moment";
let headers = { "Content-Type": "application/json" };
if (Auth.getToken()) {
  headers["Authorization"] = `Bearer ${Auth.getToken()}`;
}

const Option = Select.Option;

const ColProps = {
  xs: 24,
  sm: 12,
  style: {
    marginBottom: 16
  }
};

const TwoColProps = {
  ...ColProps,
  xl: 96
};

class OrderItemSearch extends Component {
  state = {
    customers: []
  };

  handleSearch = e => {
    e.preventDefault();
    e.stopPropagation();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;

      this.props.showSearchLoading(true);
      let searchUrl = "/orderItems";
      if (fieldsValue.orderType) {
        searchUrl += searchUrl.indexOf("?") === -1 ? "?" : "&";
        searchUrl += `orderType=${encodeURIComponent(fieldsValue.orderType)}`;
      }
      if (fieldsValue.createdDate) {
        searchUrl += searchUrl.indexOf("?") === -1 ? "?" : "&";
        searchUrl += `createdDate=${encodeURIComponent(
          moment(fieldsValue.createdDate).format("YYYY-MM-DD")
        )}`;
      }
      fetch(searchUrl, {
        method: "GET",
        headers: headers
      })
        .then(res => res.json())
        .then(async data => {
          for (const orderItem of data.content) {
            await axios
              .get(`/items/${orderItem.item.id}`)
              .then(res => {
                orderItem.item = res.data.content;
              })
              .catch(err => console.error(err));
          }
          this.props.onSearchResults(data.content);
        })
        .catch(error => console.error(error));
    });
  };

  handleReset = e => {
    this.props.form.resetFields();
    this.handleSearch(e);
  };

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Form onSubmit={this.handleSearch}>
        <Row gutter={24}>
          <Col xl={{ span: 4 }} md={{ span: 18 }}>
            {getFieldDecorator("orderType")(
              <Select placeholder="Search Order Type">
                {OrderTypes.map(d => (
                  <Option key={d.value} value={d.value}>
                    {d.name}
                  </Option>
                ))}
              </Select>
            )}
          </Col>
          <Col xl={{ span: 4 }} md={{ span: 12 }}>
            {getFieldDecorator("createdDate")(
              <DatePicker placeholder="Search date" />
            )}
          </Col>
          <Col {...TwoColProps} xl={{ span: 12 }} md={{ span: 12 }}>
            <Row type="flex" align="middle" justify="space-between">
              <div>
                <Button
                  type="primary"
                  className="margin-right"
                  onClick={this.handleSearch}
                >
                  Search
                </Button>
                <Button onClick={this.handleReset}>Reset</Button>
              </div>
            </Row>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Form.create()(OrderItemSearch);
