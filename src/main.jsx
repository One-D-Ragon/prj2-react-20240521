import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  // 개발 때만 react 컴포넌트를 붙였다 떼었다 붙이는 일을 한다
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
