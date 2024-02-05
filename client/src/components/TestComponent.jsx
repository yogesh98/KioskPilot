import React from "react";
import RGL, { WidthProvider } from "react-grid-layout";

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

    this.state = { "layout" : {} };
  }

  generateDOM() {
    return (
    <>
        <div key={1}>
          <span className="text">{1}</span>
        </div>
        <div key={2}>
            <span className="text">{2}</span>
        </div>
        <div key={3}>
            <span className="text">{3}</span>
        </div>
        <div key={4}>
            <span className="text">{4}</span>
        </div>
    </>
    );
  }

  onLayoutChange(layout) {
    this.props.onLayoutChange(layout);
  }

  render() {
    return (
      <div style={{transform: 'scale(0.5) translate(-50%, -50%)'}}>
        <ReactGridLayout
          layout={this.state.layout}
          onLayoutChange={this.onLayoutChange}
          {...this.props}
        >
          {this.generateDOM()}
        </ReactGridLayout>
      </div>
    );
  }
}