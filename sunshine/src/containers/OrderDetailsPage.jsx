import React, { Component } from "react";
import {
  Table,
  Form,
  Spin,
  Card,
  Row,
  Divider,
  Col,
  Tabs,
  Button,
  Select,
  Icon,
  Breadcrumb
} from "antd";
import axios from "axios";
import queryString from "query-string";
import PaymentAddForm from "../components/PaymentAddForm";
import {
  ServiceTypes,
  ReturnTypes,
  OrderTypes,
  DeliveryTypes,
  OrderStatus,
  PaymentTypes,
  PaymentOptions
} from "../utils/Utils";
import Auth from "../modules/Auth";
import Page from "../components/Page";
let headers = { "Content-Type": "application/json" };
if (Auth.getToken()) {
  headers["Authorization"] = `Bearer ${Auth.getToken()}`;
}

const TabPane = Tabs.TabPane;
const Option = Select.Option;

class OrderDetailsPage extends Component {
  state = {
    selectedRowKeys: [],
    loading: true,
    loadingApproval: false,
    loadingApproved: false,
    addPaymentVisible: false,
    modalVisible: false,
    modalType: "create",
    currentItem: {},
    orderDetails: {
      orderNumber: "",
      customer: { id: "", name: "" },
      discount: "",
      additionalCharge: "",
      totalAmount: "",
      orderItems: [],
      payments: []
    },
    orderNumber: null
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 }
  };

  componentDidMount() {
    const queryStringValues = queryString.parse(this.props.location.search);
    if (queryStringValues.orderId) {
      this.setState({
        orderNumber: queryStringValues.orderId,
        loading: true
      });
      this.getOrderDetailsById(queryStringValues.orderId);
    }
  }

  getOrderDetailsById = orderId => {
    fetch(`/orders/${orderId}`, {
      headers
    })
      .then(res => res.json())
      .then(async data => {
        //for (const order of data.content) {
        const order = data.content;
        await axios
          .get(`/customers/${order.customer.id}`)
          .then(res => {
            order.customer = res.data.content;
          })
          .catch(err => console.error(err));

        for await (const orderItem of order.orderItems) {
          await axios
            .get(`/items/${orderItem.item.id}`)
            .then(res => {
              orderItem.item = res.data.content;
            })
            .catch(err => console.error(err));
        }
        //}
        this.setState({ orderDetails: data.content, loading: false });
      });
  };

  getCustomer = customerId => {
    axios
      .get(`/customers/${customerId}`)
      .then(res => {
        return res.data.content;
      })
      .catch(err => console.err("Customer retrieve error: ", err));
  };

  showModal = () => {
    this.setState({ modalVisible: true });
  };

  handleRefresh = () => {
    this.setState({ loading: true });
    this.getOrderDetailsById(this.state.orderDetails.id);
  };

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys: selectedRowKeys });
  };

  handleOrderStatusUpdate = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ loadingApproval: true });
        const payload = this.state.selectedRowKeys.map(value => ({
          id: value,
          orderStatus: values.orderStatus
        }));
        axios
          .post(
            "/orders/status",
            {
              orders: payload
            },
            { headers }
          )
          .then(res => {
            if (res.data) {
              this.setState({
                selectedRowKeys: [],
                loadingApproval: false
              });
              this.handleRefresh();
              this.props.form.resetFields();
            }
          });
      }
    });
  };

  hasErrors = fieldsError => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  };

  showAddPaymentDrawer = () => {
    this.setState({ addPaymentVisible: true });
  };

  handleAddPayment = payment => {
    this.setState({ addPaymentVisible: false });
    axios
      .put(
        `/orders/payment/${this.state.orderDetails.id}`,
        { payments: [payment] },
        {
          headers
        }
      )
      .then(res => {
        if (res.data) {
          this.handleRefresh();
          this.props.form.resetFields();
        }
      })
      .catch(err => console.error("Payment add error: ", err));
  };

  handleOnClose = () => {
    this.setState({ addPaymentVisible: false });
  };

  render() {
    const {
      orderDetails,
      selectedRowKeys,
      loadingApproval,
      loading,
      addPaymentVisible
    } = this.state;
    const orderStatusList = [
      ...new Set(
        orderDetails.orderItems.map(orderItem => orderItem.orderStatus)
      )
    ];
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };
    const hasSelected = selectedRowKeys.length > 0;
    const { getFieldDecorator, getFieldsError } = this.props.form;

    const columns = [
      {
        title: "Item",
        dataIndex: "item.name",
        key: "item.name"
      },
      {
        title: "QTY",
        dataIndex: "quantity",
        key: "quantity"
      },
      {
        title: "Service Type",
        dataIndex: "serviceType",
        key: "serviceType",
        render: text => ServiceTypes.find(type => type.value === text).name
      },
      {
        title: "Unit Price",
        dataIndex: "unitPrice",
        key: "unitPrice"
      },
      {
        title: "Order Type",
        dataIndex: "orderType",
        key: "orderType",
        render: text => OrderTypes.find(type => type.value === text).name
      },
      {
        title: "Total Price",
        dataIndex: "totalPrice",
        key: "totalPrice"
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

    const paymentTableColumns = [
      {
        title: "Payment Type",
        dataIndex: "paymentType",
        key: "paymentType",
        render: text => PaymentTypes.find(type => type.value === text).name
      },
      {
        title: "Payment Option",
        dataIndex: "paymentOption",
        key: "paymentOption",
        render: text => PaymentOptions.find(type => type.value === text).name
      },
      {
        title: "Amount",
        dataIndex: "amount",
        key: "amount"
      }
    ];

    return (
      <div>
        <Breadcrumb style={{ marginBottom: 24 }}>
          <Breadcrumb.Item href="/dashboard">
            <Icon type="dashboard" />
            <span>Dashboard</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item href="/orders/list">
            <Icon type="shopping-cart" />
            <span>Order List</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Order Details</Breadcrumb.Item>
        </Breadcrumb>
        <Page inner>
          <Spin tip="Loading..." spinning={loading}>
            <Card title="Order Details" bordered={false}>
              <div>
                <Row style={{ padding: 5 }}>
                  <Col span={6}>Order Id :</Col>
                  <Col span={18}>{orderDetails.id}</Col>
                </Row>

                <Row style={{ padding: 5 }}>
                  <Col span={6}>Customer :</Col>
                  <Col span={18}>{orderDetails.customer.name}</Col>
                </Row>
                <Row style={{ padding: 5 }}>
                  <Col span={6}>Discount :</Col>
                  <Col span={18}>{orderDetails.discount}</Col>
                </Row>
                <Row style={{ padding: 5 }}>
                  <Col span={6}>Additional Charges :</Col>
                  <Col span={18}>{orderDetails.additionalCharge}</Col>
                </Row>
                <Row style={{ padding: 5 }}>
                  <Col span={6}>Total Amount :</Col>
                  <Col span={18}>{orderDetails.totalAmount}</Col>
                </Row>
              </div>
              <Divider orientation="left">
                Payment Details -{" "}
                <Button type="primary" onClick={this.showAddPaymentDrawer}>
                  <Icon type="plus" />
                  Add Payment
                </Button>
              </Divider>
              <PaymentAddForm
                onAddPayment={this.handleAddPayment}
                onClose={this.handleOnClose}
                visible={addPaymentVisible}
              />
              <Table
                rowKey="id"
                pagination={false}
                columns={paymentTableColumns}
                dataSource={orderDetails.payments}
              />
              <Divider orientation="left">Order Items</Divider>
              <div>
                <Form layout="inline" onSubmit={this.handleOrderStatusUpdate}>
                  <Form.Item hasFeedback>
                    {getFieldDecorator(`orderStatus`, {
                      rules: [
                        {
                          required: true,
                          message: "Please select status to update"
                        }
                      ]
                    })(
                      <Select
                        placeholder="Please select"
                        style={{ width: "200px" }}
                      >
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
                      disabled={
                        !hasSelected || this.hasErrors(getFieldsError())
                      }
                      loading={loadingApproval}
                    >
                      Update Status
                    </Button>
                  </Form.Item>
                </Form>
              </div>
              <Tabs defaultActiveKey={orderStatusList[0]} loading={loading}>
                {orderStatusList.map(d => (
                  <TabPane
                    tab={OrderStatus.find(status => status.value === d).name}
                    key={d}
                  >
                    <Table
                      rowKey="id"
                      columns={columns}
                      rowSelection={rowSelection}
                      dataSource={orderDetails.orderItems.filter(
                        order => order.orderStatus === d
                      )}
                    />
                  </TabPane>
                ))}
              </Tabs>
            </Card>
          </Spin>
        </Page>
      </div>
    );
  }
}

export default Form.create()(OrderDetailsPage);
