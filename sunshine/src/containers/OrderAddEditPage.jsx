import React, { Component } from "react";
import {
  Form,
  InputNumber,
  Button,
  Card,
  Select,
  Table,
  Divider,
  Icon,
  Breadcrumb
} from "antd";
import axios from "axios";
import OrderItemAddForm from "../components/OrderItemAddForm";
import PaymentAddForm from "../components/PaymentAddForm";
import InputValueOption from "../components/InputValueOption";
import {
  ServiceTypes,
  ReturnTypes,
  OrderTypes,
  DeliveryTypes,
  PaymentOptions,
  PaymentTypes
} from "../utils/Utils";
import Auth from "../modules/Auth";
import Page from "../components/Page";
let headers = { "Content-Type": "application/json" };
if (Auth.getToken()) {
  headers["Authorization"] = `Bearer ${Auth.getToken()}`;
}

const { Option } = Select;
let itemCount = 1;

class OrderAddEditPage extends Component {
  state = {
    itemCreateFormVisible: false,
    customers: [],
    washingFactories: [],
    orderTypes: [],
    serviceTypes: [],
    returnTypes: [],
    itemList: [],
    removedOrderItems: [],
    intervalIsSet: false,
    order: null,
    orders: [],
    searchResults: [],
    addOrderItemVisible: false,
    addPaymentVisible: false,
    modalType: "Create",
    totalQuantity: null,
    totalAmount: null,
    netAmount: null,
    customer: null,
    payments: []
  };

  componentDidMount() {
    this.getCustomers();
    this.getWashingFactories();
    if (this.props.match.params.customerId) {
      this.getCustomer(this.props.match.params.customerId);
    }
  }

  getCustomers = () => {
    axios
      .get("/customers", { headers })
      .then(res => {
        if (res.data) {
          this.setState({
            customers: res.data.content
          });
        }
      })
      .catch(err => console.log(err));
  };

  getCustomer = customerId => {
    axios
      .get(`/customers/${customerId}`, { headers })
      .then(res => {
        if (res.data) {
          this.setState({ customer: res.data.content });
        }
      })
      .catch(err => console.error("Customer retrieve error: ", err));
  };

  getWashingFactories = () => {
    axios
      .get("/factories", { headers })
      .then(res => {
        if (res.data) {
          this.setState({ washingFactories: res.data.content });
        }
      })
      .catch(err => console.log(err));
  };

  getOrder = id => {
    axios.get(`/orders/${id}`, { headers }).then(res => {
      if (res.data) {
        let order = res.data.content;
        let stockItems = [];
        let orderUnitWeight = {};
        let orderMeasuringType = {};
        let orderUnits = {};
        this.setState({ order: res.data.data });
        res.data.data.items.forEach(orderItem => {
          stockItems.push(orderItem.item);

          orderUnitWeight[orderItem.item._id] = orderItem.orderUnitWeight;
          orderMeasuringType[orderItem.item._id] = orderItem.orderMeasuringType;
          orderUnits[orderItem.item._id] = orderItem.orderUnits;
        });
        order.orderUnitWeight = orderUnitWeight;
        order.orderMeasuringType = orderMeasuringType;
        order.orderUnits = orderUnits;
        this.setState({
          order: order,
          itemList: stockItems,
          modalType: "Edit"
        });
      }
    });
  };

  getorders = () => {
    axios
      .get("/orders", { headers })
      .then(res => {
        if (res.data) {
          this.setState({ orders: res.data.content });
        }
      })
      .catch(err => console.log(err));
  };

  createOrder = order => {
    axios.post("/orders", order, { headers });
  };

  showItemCreateFormModal = () => {
    this.setState({ itemCreateFormVisible: true });
  };

  handleFormChange = changedFields => {
    this.setState(({ order }) => ({
      order: { ...order, ...changedFields }
    }));
  };

  handleCancel = () => {
    this.setState({ itemCreateFormVisible: false });
  };

  handleCreate = () => {
    const form = this.formRef.props.form;
    form.validateFields((err, item) => {
      if (err) {
        return;
      }
      item.key = itemCount++;
      item.item.packingTypeName = "";
      const packingType = this.state.packingTypeList.find(
        type => type._id === item.item.packingType
      );
      if (packingType) {
        item.item.packingTypeName = packingType.name;
      }

      form.resetFields();
      this.setState({
        itemList: [...this.state.itemList, item],
        itemCreateFormVisible: false
      });
    });
  };

  handleAddItem = item => {
    console.log("Item Added: ", item);
    if (!this.state.itemList.find(orderItem => orderItem.id === item.id)) {
      const totalQuantity = this.state.totalQuantity + item.quantity;
      const totalAmount = this.state.totalAmount + item.totalPrice;
      this.setState({
        itemList: [...this.state.itemList, item],
        addOrderItemVisible: false,
        totalQuantity,
        totalAmount
      });
    }
  };

  handleAddPayment = payment => {
    if (!this.state.payments.find(pay => pay.id === payment.id)) {
      this.setState({
        payments: [...this.state.payments, payment],
        addPaymentVisible: false
      });
    }
  };

  handleRemoveItem = item => {
    const { itemList } = this.state;
    if (itemList.includes(item)) {
      itemList.splice(itemList.indexOf(item), 1);
      const totalQuantity = this.state.totalQuantity - item.quantity;
      const totalAmount = this.state.totalAmount - item.totalPrice;
      this.setState({
        itemList: itemList,
        removedOrderItems: [...this.state.removedOrderItems, item.id],
        totalQuantity,
        totalAmount
      });
    }
  };

  /* handleSearchResults = results => {
    console.log("Search call back..", results);
    this.setState({ searchResults: results });
  };

  handleReset = () => {
    this.setState({ searchResults: [] });
  }; */

  showAddOrderItemDrawer = () => {
    this.setState({ addOrderItemVisible: true });
  };

  showAddPaymentDrawer = () => {
    this.setState({ addPaymentVisible: true });
  };

  handleOnClose = () => {
    this.setState({ addOrderItemVisible: false, addPaymentVisible: false });
  };

  handleDiscountOnChange = value => {
    let netAmount = null;
    console.log(
      "Val: ",
      value.value,
      ", TotalAmount: ",
      this.state.totalAmount
    );
    if (value.percentage === "true") {
      netAmount =
        this.state.totalAmount - this.state.totalAmount * (value.value * 0.01);
    } else {
      netAmount = this.state.totalAmount - value.value;
    }
    this.setState({ netAmount });
  };

  handleExtraChargeOnChange = value => {
    let netAmount = null;
    if (value.percentage === "true") {
      netAmount = netAmount =
        this.state.totalAmount + this.state.totalAmount * (value.value * 0.01);
    } else {
      netAmount = this.state.totalAmount + value.value;
    }
    this.setState({ netAmount });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((error, order) => {
      if (!error) {
        order.orderItems = this.state.itemList;
        order.payments = this.state.payments;
        console.log("Received Order: ", JSON.stringify(order));
        if (!this.state.order) {
          axios
            .post(`/orders/${order.customer}`, order, { headers })
            .then(res => {
              if (res.data) {
                this.props.history.push("/orders/list");
              }
            })
            .catch(err =>
              console.error("Error while creating an order: ", err)
            );
        }
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { customers, customer } = this.state;

    const itemTableColumns = [
      {
        title: "Item",
        dataIndex: "item.name",
        key: "item.name"
      },
      {
        title: "Order Type",
        dataIndex: "orderType",
        key: "orderType",
        render: text => OrderTypes.find(type => type.value === text).name
      },
      {
        title: "Service Type",
        dataIndex: "serviceType",
        key: "serviceType",
        render: text => ServiceTypes.find(type => type.value === text).name
      },
      {
        title: "#of Hangers",
        dataIndex: "numberOfHanger",
        key: "numberOfHanger"
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
        title: "Delivery Date",
        dataIndex: "deliveryTime",
        key: "deliveryTime"
      },
      {
        title: "Operation",
        key: "operation",
        render: (text, record) => (
          <Button
            type="dashed"
            onClick={e => {
              e.stopPropagation();
              this.handleRemoveItem(record);
            }}
          >
            Remove
          </Button>
        )
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

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      }
    };

    return (
      <React.Fragment>
        <Breadcrumb style={{ marginBottom: 24 }}>
          <Breadcrumb.Item href="/dashboard">
            <Icon type="dashboard" />
            <span>Dashboard</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Icon type="shopping-cart" />
            <span>Create Order</span>
          </Breadcrumb.Item>
        </Breadcrumb>
        <Page inner>
          <Card title="Order Details" bordered={false}>
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
              <Form.Item
                label="Customer"
                hasFeedback
                style={{ marginBottom: 0 }}
              >
                {getFieldDecorator("customer", {
                  initialValue: customer && customer.id,
                  rules: [
                    {
                      required: true,
                      message: "Please select a customer"
                    }
                  ]
                })(
                  <Select placeholder="Please select a customer">
                    {customers.map(d => (
                      <Option value={d.id} key={d.id}>
                        {d.name}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
              <Form.Item
                label="Return Hangers"
                hasFeedback
                style={{ marginBottom: 0 }}
              >
                {getFieldDecorator("returnHanger")(<InputNumber />)}
              </Form.Item>
              <Form.Item
                label="Total Quantity"
                hasFeedback
                style={{ marginBottom: 0 }}
              >
                {getFieldDecorator("totalQuantity", {
                  initialValue: this.state.totalQuantity
                })(<InputNumber readOnly />)}
              </Form.Item>
              <Form.Item
                label="Total Amount"
                hasFeedback
                style={{ marginBottom: 0 }}
              >
                {getFieldDecorator("totalAmount", {
                  initialValue: this.state.totalAmount
                })(<InputNumber readOnly />)}
              </Form.Item>
              <Form.Item
                label="Additional Charges"
                hasFeedback
                style={{ marginBottom: 0 }}
              >
                {getFieldDecorator("extraCharge", {
                  initialValue: { value: 0, percentage: "true" }
                })(
                  <InputValueOption onChange={this.handleExtraChargeOnChange} />
                )}
              </Form.Item>
              <Form.Item
                label="Discount"
                hasFeedback
                style={{ marginBottom: 0 }}
              >
                {getFieldDecorator("deduction", {
                  initialValue: { value: 0, percentage: "true" }
                })(<InputValueOption onChange={this.handleDiscountOnChange} />)}
              </Form.Item>
              <Form.Item
                label="Net Amount"
                hasFeedback
                style={{ marginBottom: 0 }}
              >
                {getFieldDecorator("netAmount", {
                  initialValue: this.state.netAmount
                })(<InputNumber readOnly />)}
              </Form.Item>

              {this.state.itemList.length > 0 && (
                <div>
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
                    visible={this.state.addPaymentVisible}
                  />
                </div>
              )}

              {this.state.itemList.length > 0 &&
                this.state.payments.length > 0 && (
                  <Table
                    rowKey="id"
                    pagination={false}
                    columns={paymentTableColumns}
                    dataSource={this.state.payments}
                  />
                )}
              <Divider orientation="left">
                Item Details -{" "}
                <Button type="primary" onClick={this.showAddOrderItemDrawer}>
                  <Icon type="plus" />
                  Add Item
                </Button>
              </Divider>
              <OrderItemAddForm
                onAddItem={this.handleAddItem}
                onClose={this.handleOnClose}
                visible={this.state.addOrderItemVisible}
              />
              {this.state.itemList.length > 0 && (
                <Table
                  rowKey="id"
                  pagination={false}
                  columns={itemTableColumns}
                  dataSource={this.state.itemList}
                />
              )}
              <Divider />
              <Button
                type="primary"
                htmlType="submit"
                disabled={this.state.itemList.length === 0}
              >
                {`${this.state.modalType} Order`}
              </Button>
            </Form>
          </Card>
        </Page>
      </React.Fragment>
    );
  }
}

export default Form.create()(OrderAddEditPage);
