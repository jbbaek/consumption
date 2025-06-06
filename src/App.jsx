import { library } from "@fortawesome/fontawesome-svg-core";
import { faStar } from "@fortawesome/free-solid-svg-icons";
library.add(faStar);

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Stats from "./pages/Stats";
import Favorite from "./pages/Favorite";
import NavBar from "./components/navbar"; // NavBar 별도 파일
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
  const [favoriteIds, setFavoriteIds] = useState(() => {
    const fav = localStorage.getItem("favorites");
    return fav ? JSON.parse(fav) : [];
  });
  const [editId, setEditId] = useState(null); // ⬅️ 수정 항목 ID

  useEffect(() => {
    saveExpenses(expenses);
  }, [expenses]);
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        setExpenses,
        favoriteIds,
        setFavoriteIds,
        editId,
        setEditId,
      }}
    >
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/favorite" element={<Favorite />} />
        </Routes>
      </Router>
    </ExpenseContext.Provider>
  );
}
export default App;
