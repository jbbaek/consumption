import React from "react";
import ExpenseForm from "./ExpenseForm";
import ExpenseTable from "./ExpenseTable";
import "../css/FixedExpense.css";

export default function FixedExpenses() {
  return (
    <div className="container-main">
      <h2>고정지출 목록</h2>
      <ExpenseForm />
      <ExpenseTable showFixedOnly />
    </div>
  );
}
