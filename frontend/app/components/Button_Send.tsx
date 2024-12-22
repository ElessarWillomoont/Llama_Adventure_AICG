"use client";

interface ButtonSendProps {
  value: string; // 输入框中的值
  onClear: () => void; // 清空输入框和页面内容的回调
}

export default function Button_Send({ value, onClear }: ButtonSendProps) {
  const handleClick = () => {
    console.log("Input value:", value); // 记录输入框的内容到日志中
    onClear(); // 清空输入框和页面内容
  };

  return (
    <button
      onClick={handleClick}
      style={{
        position: "absolute",
        bottom: "5%",
        right: "1%",
        width: "8%", // 宽度为父容器的 5%
        height: "50px",
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "25px", // 半圆角
        fontSize: "14px",
        cursor: "pointer",
        textAlign: "center",
      }}
    >
      Send
    </button>
  );
}
