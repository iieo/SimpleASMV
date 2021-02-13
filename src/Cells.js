import "./App.css";
import React from "react";

class CellsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.cells = [];
    this.createCells();
  }
  createCells = () => {};
  render() {
    if (this.props.asmcells) {
      this.cells = [];
      for (let i = 0; i < this.props.asmcells.length; i++) {
        this.cells.push(<Cell value={this.props.asmcells[i]} id={i}></Cell>);
      }
    }
    return (
      <div className="cellContainer">
        <Cell id="acc" value={this.props.asmacc} />
        {this.cells}
      </div>
    );
  }
}

class Cell extends React.Component {
  render() {
    return (
      <div className="cell">
        <p className="cellTextNo">R #{this.props.id}</p>
        <p className="cellText">{this.props.value ? this.props.value : 0}</p>
      </div>
    );
  }
}

export default CellsContainer;
