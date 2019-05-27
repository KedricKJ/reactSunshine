import React from "react";
import "./numberCard.scss";
import { Card, Icon } from "antd";

export default function NumberCard({ icon, color, title, number }) {
  return (
    <Card className="numberCard" bodyStyle={{ padding: 10 }}>
      <Icon className="iconWarp" style={{ color }} type={icon} />
      <div className="info">
        <p className="title">{title || "No Title"}</p>
        <p className="number">{number}</p>
      </div>
    </Card>
  );
}
