import React, { Component } from "react";
import {
  Table,
  Form,
  Select,
  Button,
  Breadcrumb,
  Icon,
  DatePicker,
  Row,
  Col
} from "antd";
import moment from "moment";
import Auth from "../modules/Auth";
import Page from "../components/Page";
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

class OutstandingsReportPage extends Component {
  state = {
    items: [],
    customers: [],
    loading: false
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 }
  };

  componentDidMount() {
    this.getCustomers();
    this.getItems();
  }

  getItems = () => {
    this.setState({ loading: true });
    fetch("/outstandings")
      .then(res => res.json())
      .then(data => {
        this.setState({ items: data.content, loading: false });
      });
  };

  getCustomers = () => {
    fetch("/customers")
      .then(res => res.json())
      .then(data => {
        this.setState({ customers: data.content, loading: false });
      });
  };

  handleSearch = e => {
    e.preventDefault();
    e.stopPropagation();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;

      this.setState({ loading: true });
      let searchUrl = "/outstandings";
      if (fieldsValue.customerId) {
        searchUrl += searchUrl.indexOf("?") === -1 ? "?" : "&";
        searchUrl += `customerId=${encodeURIComponent(fieldsValue.customerId)}`;
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
        .then(data => {
          this.setState({ items: data.content, loading: false });
        })
        .catch(error => console.error(error));
    });
  };

  handleReset = e => {
    this.props.form.resetFields();
    this.getItems();
  };

  showSearchLoading = flag => {
    this.setState({ loading: flag });
  };

  handleSearchResults = results => {
    this.setState({ orderItems: results, loading: false });
  };

  hasErrors = fieldsError => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  };

  render() {
    const { loading, customers } = this.state;
    const { getFieldDecorator } = this.props.form;

    const columns = [
      {
        title: "Remain Amount",
        dataIndex: "remainAmount",
        key: "remainAmount"
      },
      {
        title: "Date",
        dataIndex: "createdDate",
        key: "createdDate"
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
            <Icon type="profile" />
            <span>Reports</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <span>Outstandings</span>
          </Breadcrumb.Item>
        </Breadcrumb>
        <Form onSubmit={this.handleSearch}>
          <Row gutter={24}>
            <Col xl={{ span: 4 }} md={{ span: 18 }}>
              {getFieldDecorator("customerId")(
                <Select placeholder="Search Customer">
                  {customers.map(d => (
                    <Option key={d.id} value={d.id}>
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
        <Page inner>
          <Table
            loading={loading}
            rowKey="id"
            columns={columns}
            dataSource={this.state.items}
          />
        </Page>
      </div>
    );
  }
}

export default Form.create()(OutstandingsReportPage);
