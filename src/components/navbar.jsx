import React from "react";
import { NavLink } from "react-router-dom";
import "../App.css"; // nav 스타일이 App.css에 있다면 그대로 import

export default function NavBar() {
  return (
    <nav>
      <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
        홈
      </NavLink>
      <NavLink
        to="/stats"
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        소비분석
      </NavLink>
      <NavLink
        to="/Fixed"
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        고정지출
      </NavLink>
    </nav>
  );
}
