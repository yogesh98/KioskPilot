import React from "react";
import _ from "lodash";
import RGL, { WidthProvider } from "react-grid-layout";
import 'react-grid-layout/css/styles.css' 
import 'react-resizable/css/styles.css' 
import { Box } from "@chakra-ui/react";
const ReactGridLayout = WidthProvider(RGL);

export default class ScaledLayout extends React.PureComponent {
  static defaultProps = {
    className: "layout",
    items: 20,
    rowHeight: 30,
    onLayoutChange: function() {},
    cols: 12,
    transformScale: 0.5
  };

  constructor(props) {
    super(props);

    const layout = this.generateLayout();
    this.state = { layout };
  }

  generateDOM() {
    return _.map(_.range(this.props.items), function(i) {
      return (
        <Box key={i} borderWidth={12}>
          <span className="text">{i}</span>
        </Box>
      );
    });
  }

  generateLayout() {
    const p = this.props;
    return _.map(new Array(p.items), function(item, i) {
      const y = _.result(p, "y") || Math.ceil(Math.random() * 4) + 1;
      return {
        x: (i * 2) % 12,
        y: Math.floor(i / 6) * y,
        w: 2,
        h: y,
        i: i.toString()
      };
    });
  }

  onLayoutChange(layout) {
    this.props.onLayoutChange(layout);
  }

  render() {
    return (
        <Box h="1920px" w="1080px">
            <div style={{transform: 'scale(0.5) translate(-50%, -50%)'}}>
                <ReactGridLayout
                layout={this.state.layout}
                onLayoutChange={this.onLayoutChange}
                {...this.props}
                >
                    {this.generateDOM()}
                </ReactGridLayout>
            </div>
        </Box>
    );
  }
}