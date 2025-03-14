import React from "react";

const LoadingSpinner = () => {
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  };

  const spinnerContainerStyle = {
    position: "relative",
    width: "80px",
    height: "80px",
  };

  const outerRingStyle = {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    border: "4px solid transparent",
    borderTopColor: "#ec4899", // pink-500
    borderRightColor: "#f472b6", // pink-400
    borderBottomColor: "#f9a8d4", // pink-300
    animation: "spinClockwise 1.5s linear infinite",
  };

  const middleRingStyle = {
    position: "absolute",
    top: "10px",
    left: "10px",
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    border: "4px solid transparent",
    borderTopColor: "#f9a8d4", // pink-300
    borderRightColor: "#ec4899", // pink-500
    borderBottomColor: "#f472b6", // pink-400
    animation: "spinCounterClockwise 1.2s linear infinite",
  };

  const innerCircleStyle = {
    position: "absolute",
    top: "25px",
    left: "25px",
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    backgroundColor: "#fce7f3", // pink-100
    animation: "pulse 1s ease-in-out infinite alternate",
  };

  const dotStyle = {
    position: "absolute",
    top: "35px",
    left: "35px",
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: "#be185d", // pink-700
    animation: "pulse 1s ease-in-out infinite",
  };

  const textStyle = {
    marginTop: "20px",
    color: "#6b7280", // gray-600
    fontWeight: "500",
  };

  return (
    <div style={containerStyle}>
      <div style={spinnerContainerStyle}>
        <div style={outerRingStyle}></div>
        <div style={middleRingStyle}></div>
        <div style={innerCircleStyle}></div>
        <div style={dotStyle}></div>
      </div>
      <p style={textStyle}>Loading...</p>

      {/* Animations */}
      <style jsx>{`
        @keyframes spinClockwise {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes spinCounterClockwise {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(-360deg);
          }
        }

        @keyframes pulse {
          0% {
            opacity: 0.6;
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
