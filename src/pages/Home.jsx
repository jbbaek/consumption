import React from "react";
import ExpenseForm from "./ExpenseForm";
import ExpenseTable from "./ExpenseTable";

export default function Home() {
  return (
    <div className="container-main">
      <h2>지출 등록 & 목록</h2>
      <ExpenseForm />
      <ExpenseTable showAll />
    </div>
  );
}
