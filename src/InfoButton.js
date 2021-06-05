import React, { useState } from "react";
function InfoButton(props) {
  let [visible, setVisible] = useState(false);
  let toggleInfoBox = () => {
    setVisible(!visible);
  };
  return (
    <button className="infoButton" onClick={toggleInfoBox}>
      Command list
    </button>
  );
}

export default InfoButton;
