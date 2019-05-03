import React, { PureComponent } from "react";
import "./footer.css";

class footer extends PureComponent {
  render() {
    return (
      <div className="footerWrapper">
        <h4>
          SHENG
          <i className="far fa-copyright" id="copyRightIcon" /> 2019
        </h4>
      </div>
    );
  }
}

export default footer;
