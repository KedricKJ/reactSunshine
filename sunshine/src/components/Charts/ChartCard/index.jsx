import React from "react";
import { Card } from "antd";
import classNames from "classnames";

import "./index.scss";

class ChartCard extends React.PureComponent {
  renderContent = () => {
    const {
      contentHeight,
      title,
      avatar,
      action,
      total,
      footer,
      children,
      loading
    } = this.props;
    if (loading) {
      return false;
    }
    return (
      <div className="chartCard">
        <div className="chartTop">
          <div className="avatar">{avatar}</div>
          <div className="metaWrap">
            <div className="meta">
              <span className="title">{title}</span>
              <span className="action">{action}</span>
            </div>
            {total}
          </div>
        </div>
        {children && (
          <div className="content" style={{ height: contentHeight || "auto" }}>
            <div className="contentHeight">{children}</div>
          </div>
        )}
        {footer && <div className="footer">{footer}</div>}
      </div>
    );
  };
  render() {
    const {
      loading = false,
      contentHeight,
      title,
      avatar,
      action,
      total,
      footer,
      children,
      ...rest
    } = this.props;
    return (
      <Card
        loading={loading}
        bodyStyle={{ padding: "20px 24px 8px 24px" }}
        {...rest}
      >
        {this.renderContent()}
      </Card>
    );
  }
}

export default ChartCard;
