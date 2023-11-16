import React from "react";

const LoadingSkeleton = ({ height = 15 }) => {
  return (
    <div
      className="skeleton"
      style={{
        width: "100%",
        height: height,
      }}
    ></div>
  );
};

export default LoadingSkeleton;
