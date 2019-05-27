import React, { Component } from "react";
import { Table, Form, Modal, Icon, Breadcrumb } from "antd";
import axios from "axios";
import DropOption from "../components/DropOption";
import OrderSearch from "../components/OrderSearch";
import Auth from "../modules/Auth";
import Page from "../components/Page";
let headers = { "Content-Type": "application/json" };
if (Auth.getToken()) {
  headers["Authorization"] = `Bearer ${Auth.getToken()}`;
}

class OrderPage extends Component {
  state = {
    orders: [],
    selectedRowKeys: [],
    loading: true,
    loadingApproval: false,
    loadingApproved: false,
    modalVisible: false,
    modalType: "create",
    currentItem: {}
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 }
  };

  componentDidMount() {
    this.getOrders();
  }

  getOrders = () => {
    fetch("/orders", { headers })
      .then(res => res.json())
      .then(async data => {
        for (const order of data.content) {
          await axios
            .get(`/customers/${order.customer.id}`)
            .then(res => {
              order.customer = res.data.content;
            })
            .catch(err => console.error(err));
        }
        this.setState({ orders: data.content, loading: false });
      });
  };

  showModal = () => {
    this.setState({ modalVisible: true });
  };

  handleRefresh = () => {
    this.getOrders();
  };

  handleDelete = id => {
    axios.delete("/orders/" + id, { headers }).then(() => {
      this.handleRefresh();
    });
  };

  deleteItem = item => {
    Modal.confirm({
      title: "Delete order",
      content: "Do you want to delete this order?",
      onOk: () => this.handleDelete(item._id)
    });
  };

  handleMenuClick = (record, e) => {
    if (e.key === "view") {
      this.props.history.push(`/orders/view?orderId=${record.id}`);
    } else if (e.key === "delete") {
      //this.deleteItem(record);
    }
  };

  showSearchLoading = flag => {
    this.setState({ loading: flag });
  };

  handleSearchResults = results => {
    this.setState({ orders: results, loading: false });
  };

  handleApproval = () => {
    this.setState({ loadingApproved: true });
    axios
      .post(
        "/orders/bulk-update",
        {
          idList: this.state.selectedRowKeys,
          data: { status: "PO_APPROVED" }
        },
        { headers }
      )
      .then(res => {
        if (res.data) {
          this.setState({
            selectedRowKeys: [],
            loadingApproved: false
          });
          this.handleRefresh();
        }
      });
  };

  render() {
    const { orders, loading } = this.state;

    const columns = [
      {
        title: "Order Id",
        dataIndex: "id",
        key: "id"
      },
      {
        title: "Customer",
        dataIndex: "customer.name",
        key: "customer.name"
      },
      {
        title: "Return Hangers",
        dataIndex: "returnHanger",
        key: "returnHanger"
      },
      {
        title: "Total Amount",
        dataIndex: "totalAmount",
        key: "totalAmount"
      },
      {
        title: "Total Payments",
        key: "totalPayments",
        render: (text, record) =>
          record.payments
            .map(payment => payment.amount)
            .reduce((prev, curr) => prev + curr, 0)
      },
      {
        title: "# of Items",
        dataIndex: "orderItems.length",
        key: "orderItems.length"
      },
      {
        title: "Created Date",
        dataIndex: "createdDate",
        key: "createdDate"
      },
      {
        title: "Operation",
        key: "operation",
        render: (text, record) => (
          <DropOption
            onMenuClick={e => this.handleMenuClick(record, e)}
            menuOptions={[{ key: "view", name: "View" }]}
          />
        )
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
            <span>Order List</span>
          </Breadcrumb.Item>
        </Breadcrumb>
        <Page inner>
          <OrderSearch
            showSearchLoading={this.showSearchLoading}
            onSearchResults={this.handleSearchResults}
          />
          {/* <div style={{ marginBottom: 16, marginTop: 16 }}>
          <Button
            type="primary"
            onClick={this.handlePOApprovalStatusUpdate}
            disabled={!hasSelected}
            loading={loadingApproval}
          >
            Send For Approval
          </Button>
          <span style={{ marginLeft: 8 }} />
          <Button
            type="primary"
            onClick={this.handleApproval}
            disabled={!hasSelected}
            loading={loadingApproved}
          >
            Approve
          </Button>
          <span style={{ marginLeft: 8 }}>
            {hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}
          </span>
        </div> */}
          <Table
            loading={loading}
            rowKey="id"
            columns={columns}
            dataSource={orders}
          />
        </Page>
      </div>
    );
  }
}

export default Form.create()(OrderPage);
