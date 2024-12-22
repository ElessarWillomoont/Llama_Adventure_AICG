"use client";

export default function Button_LoadModel() {
  const handleClick = () => {
    console.log("Load model button clicked.");
  };

  return (
    <button
      onClick={handleClick}
      style={{
        position: "absolute",
        bottom: "5%",
        left: "1%", // 距离左边 3%
        width: "8%", // 按钮宽度为父容器的 10%
        height: "50px", // 按钮高度固定为 40px
        backgroundColor: "#1E90FF", // 按钮背景色为 DodgerBlue
        color: "white", // 字体颜色为白色
        border: "none", // 无边框
        borderRadius: "25px", // 半圆角
        fontSize: "14px", // 字体大小
        cursor: "pointer", // 鼠标悬停显示指针
        textAlign: "center", // 文字居中
      }}
    >
      Load Model
    </button>
  );
}
