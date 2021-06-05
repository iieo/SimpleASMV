import React, { Component } from "react";
import "./App.css";

class ToggleButton extends Component {
  constructor(props) {
    super(props);
    this.state = { active: false };
  }
  clickButton = () => {
    this.props.onClick(this.state.active);
    this.setState({ active: !this.state.active });
  };
  render() {
    return (
      <button className="toggleButton" onClick={this.clickButton}>
        {this.state.active ? this.props.activeText : this.props.inactiveText}
      </button>
    );
  }
}

export default ToggleButton;
