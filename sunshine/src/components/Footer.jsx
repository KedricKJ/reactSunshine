import React from "react";

const Footer = ({ className, copyright }) => {
  return (
    <footer className={className}>
      <div>{copyright}</div>
    </footer>
  );
};

export default Footer;
