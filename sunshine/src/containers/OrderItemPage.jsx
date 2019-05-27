import React, { Component } from "react";
import { Table, Form, Select, Button, Breadcrumb, Icon } from "antd";
import axios from "axios";
import {
  ServiceTypes,
  ReturnTypes,
  OrderTypes,
  DeliveryTypes,
  OrderStatus
} from "../utils/Utils";
import OrderItemSearch from "../components/OrderItemSearch";
import Auth from "../modules/Auth";
import Page from "../components/Page";
let headers = { "Content-Type": "application/json" };
if (Auth.getToken()) {
  headers["Authorization"] = `Bearer ${Auth.getToken()}`;
}

const Option = Select.Option;

class OrderItemPage extends Component {
  state = {
    orderItems: [],
    selectedRowKeys: [],
    loading: false,
    loadingStatusUpdate: false
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 }
  };

  componentDidMount() {
    this.getOrderItems();
  }

  getOrderItems = () => {
    this.setState({ loading: true });
    fetch("/orderItems", { headers })
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
        this.setState({ orderItems: data.content, loading: false });
      });
  };

  handleRefresh = () => {
    this.getOrderItems();
  };

  showSearchLoading = flag => {
    this.setState({ loading: flag });
  };

  handleSearchResults = results => {
    this.setState({ orderItems: results, loading: false });
  };

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys: selectedRowKeys });
  };

  hasErrors = fieldsError => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  };

  handleOrderItemStatusUpdate = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ loadingStatusUpdate: true });
        const payload = this.state.selectedRowKeys.map(value => ({
          id: value,
          orderStatus: values.orderStatus
        }));
        axios
          .put(
            "/orderItems",
            {
              orderItems: payload
            },
            { headers }
          )
          .then(res => {
            if (res.data) {
              this.setState({
                selectedRowKeys: [],
                loadingStatusUpdate: false
              });
              this.handleRefresh();
              this.props.form.resetFields();
            }
          });
      }
    });
  };

  render() {
    const { selectedRowKeys, loadingStatusUpdate } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };
    const { getFieldDecorator, getFieldsError } = this.props.form;
    const hasSelected = selectedRowKeys.length > 0;

    const columns = [
      {
        title: "Item",
        dataIndex: "item.name",
        key: "item.name"
      },
      {
        title: "Service Type",
        dataIndex: "serviceType",
        key: "serviceType",
        render: text => ServiceTypes.find(type => type.value === text).name
      },
      {
        title: "Order Type",
        dataIndex: "orderType",
        key: "orderType",
        render: text => OrderTypes.find(type => type.value === text).name
      },
      {
        title: "Return Type",
        dataIndex: "returnType",
        key: "returnType",
        render: text => ReturnTypes.find(type => type.value === text).name
      },
      {
        title: "Delivery Type",
        dataIndex: "deliveryType",
        key: "deliveryType",
        render: text => DeliveryTypes.find(type => type.value === text).name
      },
      {
        title: "Order Status",
        dataIndex: "orderStatus",
        key: "orderStatus",
        render: text => OrderStatus.find(type => type.value === text).name
      },
      {
        title: "Unit Price",
        dataIndex: "unitPrice",
        key: "unitPrice"
      },
      {
        title: "QTY",
        dataIndex: "quantity",
        key: "quantity"
      },
      {
        title: "Total Price",
        dataIndex: "totalPrice",
        key: "totalPrice"
      },
      {
        title: "Created Date",
        dataIndex: "createdDate",
        key: "createdDate"
      },
      {
        title: "Delivery Date",
        dataIndex: "deliveryTime",
        key: "deliveryTime"
      }
    ];

    return (
      <div>
        <Breadcrumb style={{ marginBottom: 24 }}>
          <Breadcrumb.Item href="/dashboard">
            <Icon type="dashboard" />
            <span>Dashboard</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Icon type="shopping-cart" />
            <span>Order Items</span>
          </Breadcrumb.Item>
        </Breadcrumb>
        <Page inner>
          <OrderItemSearch
            showSearchLoading={this.showSearchLoading}
            onSearchResults={this.handleSearchResults}
          />
          <Form layout="inline" onSubmit={this.handleOrderItemStatusUpdate}>
            <Form.Item hasFeedback>
              {getFieldDecorator(`orderStatus`, {
                rules: [
                  {
                    required: true,
                    message: "Please select status to update"
                  }
                ]
              })(
                <Select placeholder="Please select" style={{ width: "200px" }}>
                  {OrderStatus.map(d => (
                    <Option key={d.value} value={d.value}>
                      {d.name}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                disabled={!hasSelected || this.hasErrors(getFieldsError())}
                loading={loadingStatusUpdate}
              >
                Update Status
              </Button>
            </Form.Item>
          </Form>
          <Table
            loading={this.state.loading}
            rowKey="id"
            columns={columns}
            rowSelection={rowSelection}
            dataSource={this.state.orderItems}
          />
        </Page>
      </div>
    );
  }
}

export default Form.create()(OrderItemPage);
