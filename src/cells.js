import "./App.css";
import React from "react";

class CellsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.cells = [];
    this.createCells();
  }
  createCells = () => {
    for (let i = 0; i < this.props.cells.length; i++) {
      this.cells.push(<Cell value={this.props.cells[i]} id={i}></Cell>);
    }
  };
  render() {
    return <div className="cellContainer">{this.cells}</div>;
  }
}

class Cell extends React.Component {
  render() {
    return (
      <div className="cell">
        <p className="cellTextNo">R #{this.props.id}</p>
        <p className="cellText">{this.props.value}</p>
      </div>
    );
  }
}

export default CellsContainer;
