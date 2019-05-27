import React from "react";
import { Chart, Tooltip, Geom } from "bizcharts";
import "../index.scss";

class MiniBar extends React.PureComponent {
  render() {
    const {
      height,
      forceFit = true,
      color = "#1890FF",
      data = []
    } = this.props;
    const scale = {
      sales: {
        type: "cat"
      },
      year: {
        min: 0
      }
    };
    const cols = {
      sales: {
        tickInterval: 20
      }
    };
    const padding = [35, 5, 30, 5];
    const tooltip = [
      "x*y",
      (x, y) => ({
        name: x,
        value: y
      })
    ];
    // for tooltip not to be hide
    const chartHeight = height + 54;

    return (
      <div className="miniChart" style={{ height }}>
        <div className="chartContent">
          <Chart
            scale={cols}
            height={chartHeight}
            forceFit={forceFit}
            data={data}
            padding={padding}
          >
            <Tooltip
              crosshairs={{
                type: "y"
              }}
            />
            <Geom type="interval" position="year*sales" color={color} />
          </Chart>
          {/* <Chart height={400} data={data} scale={scale} forceFit>
            <Tooltip
              crosshairs={{
                type: "y"
              }}
            />
            <Geom type="interval" position="year*sales" />
          </Chart> */}
        </div>
      </div>
    );
  }
}

export default MiniBar;
