import { library } from "@fortawesome/fontawesome-svg-core";
import { faAnchor } from "@fortawesome/free-solid-svg-icons"; // 고정지출 아이콘!
library.add(faAnchor);

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Stats from "./pages/Stats";
import FixedExpense from "./pages/FixedExpense";
import NavBar from "./components/navbar";
import "./App.css";

export const ExpenseContext = React.createContext();

function loadExpenses() {
  const data = localStorage.getItem("expenses");
  return data ? JSON.parse(data) : [];
}
function saveExpenses(expenses) {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

function App() {
  const [expenses, setExpenses] = useState(loadExpenses());
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    saveExpenses(expenses);
  }, [expenses]);

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        setExpenses,
        editId,
        setEditId,
      }}
    >
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/fixed" element={<FixedExpense />} />
        </Routes>
      </Router>
    </ExpenseContext.Provider>
  );
}
export default App;
