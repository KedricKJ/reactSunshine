import React from "react";
import "./index.scss";

const Field = ({ label, value, ...rest }) => (
  <div className="field" {...rest}>
    <span className="label">{label}</span>
    <span className="number">{value}</span>
  </div>
);

export default Field;
