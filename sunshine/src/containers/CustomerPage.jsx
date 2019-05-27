import React, { Component } from "react";
import {
  Table,
  Button,
  Form,
  Input,
  Modal,
  Icon,
  Select,
  Row,
  Col,
  Drawer,
  Breadcrumb
} from "antd";
import axios from "axios";
import DropOption from "../components/DropOption";
import { CustomerTypes, PaymentTypes, DeliveryTypes } from "../utils/Utils";
import Auth from "../modules/Auth";
import CustomerSearch from "../components/CustomerSearch";
import Page from "../components/Page";
let headers = { "Content-Type": "application/json" };
if (Auth.getToken()) {
  headers["Authorization"] = `Bearer ${Auth.getToken()}`;
}

const FormItem = Form.Item;
const Option = Select.Option;

class CustomerPage extends Component {
  state = {
    items: [],
    loading: true,
    modalVisible: false,
    modalType: "create",
    currentItem: {},
    branches: []
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 }
  };

  componentDidMount() {
    fetch("/customers", { headers })
      .then(res => res.json())
      .then(data => this.setState({ items: data.content, loading: false }))
      .catch(err => console.error(err));

    fetch("/branches", { headers })
      .then(res => res.json())
      .then(data => this.setState({ branches: data.content }))
      .catch(error => console.error(error));

    /* fetch("delivery-types", { headers })
      .then(res => res.json())
      .then(data => this.setState({ deliveryTypes: data.data }))
      .catch(error => console.error(error));

    fetch("payment-types", { headers })
      .then(res => res.json())
      .then(data => this.setState({ paymentTypes: data.data }))
      .catch(error => console.error(error)); */
  }

  showModal = () => {
    this.setState({ modalVisible: true });
  };

  showEditModal = item => {
    this.setState({
      modalVisible: true,
      currentItem: item,
      modalType: "update"
    });
  };

  handleRefresh = () => {
    this.setState({ loading: true });
    axios
      .get("/customers", { headers })
      .then(res => {
        if (res.data) {
          this.setState({ items: res.data.content, loading: false });
        }
      })
      .catch(err => console.log(err));
  };

  handleCancel = () => {
    this.setState({
      modalVisible: false,
      currentItem: {},
      modalType: "create"
    });
    this.props.form.resetFields();
  };

  handleModalSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    const { currentItem } = this.state;
    const id = currentItem ? currentItem._id : "";

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      fieldsValue.branches = fieldsValue.branches.map(value => {
        var newObj = {};
        newObj["id"] = value;
        return newObj;
      });
      //console.log("Values: ", fieldsValue);
      if (!id) {
        axios.post("/customers", fieldsValue, { headers }).then(() => {
          form.resetFields();
          this.setState({ modalVisible: false });
          this.handleRefresh();
        });
      } else {
        axios.put("/customers/" + id, fieldsValue, { headers }).then(() => {
          form.resetFields();
          this.setState({ modalVisible: false });
          this.handleRefresh();
        });
      }
    });
  };

  handleDelete = id => {
    axios.delete("/customers/" + id, { headers }).then(() => {
      this.handleRefresh();
    });
  };

  deleteItem = item => {
    Modal.confirm({
      title: "Delete Customer",
      content: "Do you want to delete this customer?",
      onOk: () => this.handleDelete(item._id)
    });
  };

  handleMenuClick = (record, e) => {
    if (e.key === "edit") {
      this.setState({ currentItem: record });
      this.showEditModal(record);
    } else if (e.key === "delete") {
      this.deleteItem(record);
    } else if (e.key === "createOrder") {
      this.props.history.push(`/orders/add/${record.id}`);
    }
  };

  showSearchLoading = flag => {
    this.setState({ loading: flag });
  };

  handleSearchResults = results => {
    this.setState({ items: results, loading: false });
  };

  handleAddItem = () => {
    this.setState({ modalVisible: true });
  };

  render() {
    const columns = [
      {
        title: "NIC",
        dataIndex: "nic",
        key: "nic"
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name"
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email"
      },
      {
        title: "Mobile",
        dataIndex: "mobile",
        key: "mobile"
      },
      {
        title: "Telephone",
        dataIndex: "telephone",
        key: "telephone"
      },
      {
        title: "Address",
        dataIndex: "address",
        key: "address"
      },
      {
        title: "Operation",
        key: "operation",
        render: (text, record) => (
          <DropOption
            onMenuClick={e => this.handleMenuClick(record, e)}
            menuOptions={[
              { key: "edit", name: "Edit" },
              { key: "delete", name: "Delete" },
              { key: "createOrder", name: "Create an Order" }
            ]}
          />
        )
      }
    ];
    const { getFieldDecorator } = this.props.form;
    const { currentItem = {}, branches } = this.state;
    const modalProps = {
      //item: this.state.modalType === "create" ? {} : currentItem,
      visible: this.state.modalVisible,
      //maskClosable: false,
      title:
        this.state.modalType === "create"
          ? "Create Customer"
          : "Update Customer"
      //centered: true
    };
    const getModalContent = () => {
      return (
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label="NIC" hasFeedback>
                {getFieldDecorator("nic", {
                  initialValue: currentItem.nic,
                  rules: [{ required: true }]
                })(<Input placeholder="NIC" />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Name" hasFeedback>
                {getFieldDecorator("name", {
                  initialValue: currentItem.name,
                  rules: [{ required: true }]
                })(<Input placeholder="Name" />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label="Email" hasFeedback>
                {getFieldDecorator("email", {
                  initialValue: currentItem.email,
                  rules: [{ required: true }]
                })(<Input placeholder="Email" />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Customer Type" hasFeedback>
                {getFieldDecorator("customerType", {
                  initialValue: currentItem.customerType,
                  rules: [{ required: true }]
                })(
                  <Select placeholder="Select customer type">
                    {CustomerTypes.map(d => (
                      <Option key={d.value} value={d.value}>
                        {d.name}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label="Mobile" hasFeedback>
                {getFieldDecorator("mobile", {
                  initialValue: currentItem.mobile
                })(<Input placeholder="Mobile" />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Payment Type" hasFeedback>
                {getFieldDecorator("paymentType", {
                  initialValue: currentItem.paymentType,
                  rules: [{ required: true }]
                })(
                  <Select placeholder="Select payment type">
                    {PaymentTypes.map(d => (
                      <Option key={d.value} value={d.value}>
                        {d.name}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label="Telephone" hasFeedback>
                {getFieldDecorator("telephone", {
                  initialValue: currentItem.telephone
                })(<Input placeholder="Telephone" />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Delivery Type" hasFeedback>
                {getFieldDecorator("delivertyType", {
                  initialValue: currentItem.delivertyType,
                  rules: [{ required: true }]
                })(
                  <Select placeholder="Select delivery type">
                    {DeliveryTypes.map(d => (
                      <Option key={d.value} value={d.value}>
                        {d.name}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label="Branches" hasFeedback>
                {getFieldDecorator("branches", {
                  initialValue: currentItem.branches,
                  rules: [{ required: true }]
                })(
                  <Select placeholder="Select branches" mode="multiple">
                    {branches.map(d => (
                      <Option key={d.id} value={d.id}>
                        {d.name}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={12} />
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label="Address" hasFeedback {...this.formLayout}>
                {getFieldDecorator("address", {
                  initialValue: currentItem.address
                })(<Input.TextArea rows={4} placeholder="Address" />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Other" hasFeedback {...this.formLayout}>
                {getFieldDecorator("other", {
                  initialValue: currentItem.other
                })(<Input.TextArea rows={4} placeholder="Other details" />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      );
    };

    return (
      <div>
        <Breadcrumb style={{ marginBottom: 24 }}>
          <Breadcrumb.Item href="/dashboard">
            <Icon type="dashboard" />
            <span>Dashboard</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Icon type="wechat" />
            <span>Customers</span>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Page inner>
          <CustomerSearch
            showSearchLoading={this.showSearchLoading}
            onSearchResults={this.handleSearchResults}
            onAddItem={this.handleAddItem}
          />
          <Table
            loading={this.state.loading}
            rowKey="id"
            columns={columns}
            dataSource={this.state.items}
          />
          <Drawer {...modalProps} width={720} onClose={this.handleCancel}>
            {getModalContent()}
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
              <Button onClick={this.handleCancel} style={{ marginRight: 8 }}>
                Cancel
              </Button>
              <Button onClick={this.handleModalSubmit} type="primary">
                Submit
              </Button>
            </div>
          </Drawer>
        </Page>
      </div>
    );
  }
}

export default Form.create()(CustomerPage);
