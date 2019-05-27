import React, { Component } from "react";
import {
  Table,
  Form,
  Modal,
  Icon,
  Select,
  InputNumber,
  Breadcrumb
} from "antd";
import axios from "axios";
import DropOption from "../components/DropOption";
import UnitPriceSearch from "../components/UnitPriceSearch";
import Auth from "../modules/Auth";
import {
  ServiceTypes,
  OrderTypes,
  ReturnTypes,
  DeliveryTypes
} from "../utils/Utils";
import Page from "../components/Page";
let headers = { "Content-Type": "application/json" };
if (Auth.getToken()) {
  headers["Authorization"] = `Bearer ${Auth.getToken()}`;
}

const FormItem = Form.Item;
const Option = Select.Option;

class UnitPricePage extends Component {
  state = {
    items: [],
    unitPrices: [],
    loading: true,
    modalVisible: false,
    modalType: "create",
    currentItem: {}
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 }
  };

  componentDidMount() {
    fetch("/unitPrices", { headers })
      .then(res => res.json())
      .then(async data => {
        for await (const unitPrice of data.content) {
          await axios
            .get(`/items?id=${unitPrice.id}`)
            .then(res => {
              unitPrice.item = res.data.content;
            })
            .catch(err => {});
        }
        this.setState({ unitPrices: data.content, loading: false });
      })
      .catch(err => console.error(err));
    this.getItems();
  }

  getItems = () => {
    fetch("/items", { headers })
      .then(res => res.json())
      .then(data => {
        console.log("Items: ", data.content);
        this.setState({ items: data.content });
      })
      .catch(err => console.error(err));
  };

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
      .get("/unitPrices", { headers })
      .then(res => {
        if (res.data) {
          this.setState({ items: res.data.content, loading: false });
        }
      })
      .catch(err => console.log(err));
  };

  handleCancel = () => {
    this.setState({ modalVisible: false });
  };

  handleModalSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    const { currentItem } = this.state;
    const id = currentItem ? currentItem.id : "";

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      //console.log("Unit price :", fieldsValue);
      if (!id) {
        axios.post("/unitPrices", fieldsValue, { headers }).then(() => {
          form.resetFields();
          this.setState({ modalVisible: false });
          this.handleRefresh();
        });
      } else {
        axios.put("/unitPrices/" + id, fieldsValue, { headers }).then(() => {
          form.resetFields();
          this.setState({ modalVisible: false });
          this.handleRefresh();
        });
      }
    });
  };

  handleDelete = id => {
    axios.delete("/unitPrices/" + id, { headers }).then(() => {
      this.handleRefresh();
    });
  };

  deleteItem = item => {
    Modal.confirm({
      title: "Delete Item",
      content: "Do you want to delete this item?",
      onOk: () => this.handleDelete(item.id)
    });
  };

  handleMenuClick = (record, e) => {
    if (e.key === "edit") {
      this.setState({ currentItem: record });
      this.showEditModal(record);
    } else if (e.key === "delete") {
      this.deleteItem(record);
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
        title: "Item name",
        dataIndex: "item.name",
        key: "item.name"
      },
      {
        title: "Service Type",
        dataIndex: "serviceType",
        key: "serviceType"
      },
      {
        title: "Order Type",
        dataIndex: "orderType",
        key: "orderType"
      },
      {
        title: "Return Type",
        dataIndex: "returnType",
        key: "returnType"
      },
      {
        title: "Delivery Type",
        dataIndex: "deliveryType",
        key: "deliveryType"
      },
      {
        title: "Unit Price",
        dataIndex: "unitPrice",
        key: "unitPrice"
      },
      {
        title: "Operation",
        key: "operation",
        render: (text, record) => (
          <DropOption
            onMenuClick={e => this.handleMenuClick(record, e)}
            menuOptions={[
              { key: "edit", name: "Edit" },
              { key: "delete", name: "Delete" }
            ]}
          />
        )
      }
    ];
    const { getFieldDecorator } = this.props.form;
    const { currentItem = {} } = this.state;
    const modalProps = {
      item: this.state.modalType === "create" ? {} : currentItem,
      visible: this.state.modalVisible,
      maskClosable: false,
      title: this.state.modalType === "create" ? "Create Item" : "Update Item",
      centered: true
    };
    const getModalContent = () => {
      return (
        <Form>
          <FormItem label="Item" hasFeedback {...this.formLayout}>
            {getFieldDecorator("item.id", {
              rules: [{ required: true }]
            })(
              <Select placeholder="Please select">
                {this.state.items.map(d => (
                  <Option key={d.id} value={d.id}>
                    {d.name}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="Service Type" hasFeedback {...this.formLayout}>
            {getFieldDecorator("serviceType", {
              rules: [{ required: true }]
            })(
              <Select placeholder="Please select">
                {ServiceTypes.map(d => (
                  <Option key={d.value} value={d.value}>
                    {d.name}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="Order Type" hasFeedback {...this.formLayout}>
            {getFieldDecorator("orderType", {
              rules: [{ required: true }]
            })(
              <Select placeholder="Please select">
                {OrderTypes.map(d => (
                  <Option key={d.value} value={d.value}>
                    {d.name}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="Return Type" hasFeedback {...this.formLayout}>
            {getFieldDecorator("returnType", {
              rules: [{ required: true }]
            })(
              <Select placeholder="Please select">
                {ReturnTypes.map(d => (
                  <Option key={d.value} value={d.value}>
                    {d.name}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="Delivery Type" hasFeedback {...this.formLayout}>
            {getFieldDecorator("deliveryType", {
              rules: [{ required: true }]
            })(
              <Select placeholder="Please select">
                {DeliveryTypes.map(d => (
                  <Option key={d.value} value={d.value}>
                    {d.name}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="Unit Price" hasFeedback {...this.formLayout}>
            {getFieldDecorator("unitPrice", {
              rules: [{ required: true }]
            })(<InputNumber placeholder="Unit price" />)}
          </FormItem>
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
            <Icon type="pound" />
            <span>Unit Prices</span>
          </Breadcrumb.Item>
        </Breadcrumb>
        <Page inner>
          <UnitPriceSearch
            showSearchLoading={this.showSearchLoading}
            onSearchResults={this.handleSearchResults}
            onAddItem={this.handleAddItem}
          />
          <Table
            loading={this.state.loading}
            rowKey="id"
            columns={columns}
            dataSource={this.state.unitPrices}
          />
          <Modal
            {...modalProps}
            onCancel={this.handleCancel}
            onOk={this.handleModalSubmit}
          >
            {getModalContent()}
          </Modal>
        </Page>
      </div>
    );
  }
}

export default Form.create()(UnitPricePage);
