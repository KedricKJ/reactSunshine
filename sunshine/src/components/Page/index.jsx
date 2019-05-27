import React, { Component } from "react";
import classnames from "classnames";
import "./index.scss";

class Page extends Component {
  render() {
    const { className, children, loading = false, inner = false } = this.props;
    const loadingStyle = {
      height: "calc(100vh - 184px)",
      overflow: "hidden"
    };
    return (
      <div
        className={classnames(className, {
          contentInner: inner
        })}
        style={loading ? loadingStyle : null}
      >
        {children}
      </div>
    );
  }
}

export default Page;
