import React from "react";

const LoginLayout = ({ children, ...rest }) => {
  return (
    <div className="page page-login">
      <div className="main">{children}</div>
    </div>
  );
};

export default LoginLayout;
