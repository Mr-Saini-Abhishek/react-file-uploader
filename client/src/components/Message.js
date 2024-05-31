import React from "react";

export default function Message(props) {
  const capital = (word) => {
    if (!word) return ''; // Check if word is undefined or null
    const lower = word.toLowerCase();
    let lower2 = lower.charAt(0).toUpperCase() + lower.slice(1);
    if (lower2 === "Danger") {
      return (lower2 = "Warning");
    } else {
      return (lower2 = "Success");
    }
  };
  
  return (
    <div  style={{ height: "35px", width: '100%'}}>
      {props.alert && (

        <div className={`alert alert-${props.alert.type} alert-dismissible fade show`} role="alert">
          <strong>{capital(props.alert.type)}</strong> : {props.alert.msg}
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
        </div>
      )}
    </div>
  );
}
