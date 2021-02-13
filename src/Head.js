import React from "react";
import {
  IoBugOutline,
  IoPlayOutline,
  IoPlayForwardOutline,
} from "react-icons/io5";

export default function Head(props) {
  let iconSize = "80%";
  return (
    <header className="header">
      <h1 className="heading">Simple ASMR</h1>
      <div className="runButtonContainer">
        <button className="runButton startButton" onClick={props.run}>
          <IoPlayOutline size={iconSize} />
        </button>
        <button className="runButton debugButton" onClick={props.debug}>
          {props.debugModus ? (
            <IoPlayForwardOutline size={iconSize} />
          ) : (
            <IoBugOutline size={iconSize} />
          )}
        </button>
      </div>
    </header>
  );
}
