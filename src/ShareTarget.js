import React from "react";

function ShareTarget(props) {
  return (
    <div>
      <h2>Received Shared Content</h2>
      <p>
        <strong>URL:</strong> {props.sharedUrl}
      </p>
      {/* Display other shared content if needed */}
    </div>
  );
}

export default ShareTarget;
