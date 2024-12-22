"use client";

interface InputBoxProps {
  value: string;
  onChange: (newValue: string) => void;
}

export default function InputBox({ value, onChange }: InputBoxProps) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: "5%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "80%",
      }}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your message here..."
        style={{
          width: "100%",
          padding: "10px 20px",
          borderRadius: "50px", // Fully rounded corners
          border: "1px solid #ccc",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          fontSize: "16px",
          color: "#000", // Black font color
          outline: "none",
        }}
      />
    </div>
  );
}
