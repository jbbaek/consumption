import React from "react";
import ExpenseTable from "./ExpenseTable";
import "../css/Favorite.css";

export default function Favorite() {
  return (
    <div className="container-main">
      <h2>즐겨찾기 지출 목록</h2>
      <ExpenseTable showFavorite />
    </div>
  );
}
