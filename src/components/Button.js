import React from "react";

import "components/Button.scss";
import classNames from "classnames";

export default function Button(props) {
  let buttonClass = classNames("button", {
    "button--confirm": props.confirm,
    "button--danger": props.danger,
  });
  // if (props.confirm) {
  //   buttonClass += " button--confirm";
  // }
  // if (props.danger) {
  //   buttonClass += " button--danger";
  // }

  return (
    <button
      disabled={props.disabled}
      onClick={props.onClick}
      className={buttonClass}
    >
      {props.children}
    </button>
  );
}
