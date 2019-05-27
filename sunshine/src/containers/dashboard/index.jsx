import React from "react";
import { Row, Col, Card, Breadcrumb, Icon } from "antd";
import "./index.scss";
import Page from "../../components/Page";
import NumberCard from "./components/numberCard";
import { Chart, Axis, Tooltip, Geom } from "bizcharts";
import Auth from "../../modules/Auth";
let headers = { "Content-Type": "application/json" };
if (Auth.getToken()) {
  headers["Authorization"] = `Bearer ${Auth.getToken()}`;
}

class DashboardPage extends React.PureComponent {
  state = { loading: false, paymentData: [] };

  componentDidMount() {
    this.setState({ loading: true });
    fetch("/payments/date", { headers })
      .then(res => res.json())
      .then(data =>
        this.setState({ paymentData: data.content, loading: false })
      )
      .catch(err => console.error(err));
  }

  render() {
    const { loading, paymentData } = this.state;
    const cols = {
      amount: {
        tickInterval: 5000
      },
      createdDate: {
        min: "2019-05-12",
        mask: "YYYY-MM-DD"
      }
    };
    return (
      <div>
        <Breadcrumb style={{ marginBottom: 24 }}>
          <Breadcrumb.Item href="/dashboard">
            <Icon type="dashboard" />
            <span>Dashboard</span>
          </Breadcrumb.Item>
        </Breadcrumb>
        <Page className="dashboard">
          <Row gutter={24}>
            {/* <Col {...topColResponsiveProps}>
          <ChartCard
            bordered={false}
            loading={loading}
            title="Payments"
            total="6560"
            footer={<Field label="Conversion Rate" value="60%" />}
            contentHeight={46}
          >
            <MiniBar data={visitData} height={54} />
          </ChartCard>
          <div>
            <Chart height={400} data={visitData} scale={cols} forceFit>
              <Axis name="year" />
              <Axis name="sales" />
              <Tooltip
                crosshairs={{
                  type: "y"
                }}
              />
              <Geom type="interval" position="year*sales" />
            </Chart>
          </div>
        </Col> */}
            <Col lg={6} md={12}>
              <NumberCard
                {...{
                  icon: "pay-circle-o",
                  color: "#64ea91",
                  title: "Online Review",
                  number: 2781
                }}
              />
            </Col>
            <Col lg={6} md={12}>
              <NumberCard
                {...{
                  icon: "team",
                  color: "#8fc9fb",
                  title: "New Customers",
                  number: 3241
                }}
              />
            </Col>
            <Col lg={6} md={12}>
              <NumberCard
                {...{
                  icon: "message",
                  color: "#d897eb",
                  title: "Active Projects",
                  number: 253
                }}
              />
            </Col>
            <Col lg={6} md={12}>
              <NumberCard
                {...{
                  icon: "shopping-cart",
                  color: "#f69899",
                  title: "Referrals",
                  number: 4324
                }}
              />
            </Col>
            <Col lg={24} md={24}>
              <Card
                title="Payments"
                bordered={false}
                bodyStyle={{
                  padding: "24px 36px 24px 0"
                }}
                loading={loading}
              >
                <Chart height={400} data={paymentData} scale={cols} forceFit>
                  <Axis name="createdDate" />
                  <Axis name="amount" />

                  <Tooltip
                    crosshairs={{
                      type: "y"
                    }}
                  />
                  <Geom type="interval" position="createdDate*amount" />
                </Chart>
              </Card>
            </Col>
          </Row>
        </Page>
      </div>
    );
  }
}

export default DashboardPage;
