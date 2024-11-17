import React from "react";

interface SwitchProps {
  checked: boolean;
  onChange: () => void;
  id: string;
}

export const Switch: React.FC<SwitchProps> = ({ checked, onChange, id }) => {
  return (
    <div
      style={{
        position: "relative",
        width: "40px",
        height: "20px",
        backgroundColor: checked ? "#4CAF50" : "#ccc",
        borderRadius: "10px",
        cursor: "pointer",
        transition: "background-color 0.3s",
      }}
      onClick={onChange}
      id={id}
    >
      <div
        style={{
          position: "absolute",
          left: checked ? "20px" : "0",
          top: "0",
          width: "20px",
          height: "20px",
          backgroundColor: "white",
          borderRadius: "50%",
          transition: "left 0.3s",
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        }}
      />
    </div>
  );
};
