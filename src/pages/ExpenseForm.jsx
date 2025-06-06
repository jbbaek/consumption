import React, { useState, useContext, useEffect } from "react";
import { ExpenseContext } from "../App";
import "../css/ExpenseForm.css";

const CATEGORY_OPTIONS = [
  "식비",
  "교통",
  "주거/관리비",
  "의료/건강",
  "교육",
  "문화/여가",
  "쇼핑",
  "카페/간식",
  "통신",
  "생활용품",
  "기타",
];

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

export default function ExpenseForm() {
  const { expenses, setExpenses, editId, setEditId } =
    useContext(ExpenseContext);
  const [date, setDate] = useState(getToday());
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0]);
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");

  // editId가 바뀔 때 해당 항목으로 값 채우기
  useEffect(() => {
    if (editId) {
      const item = expenses.find((e) => e.id === editId);
      if (item) {
        setDate(item.date);
        setCategory(item.category);
        setAmount(item.amount.toString());
        setMemo(item.memo);
      }
    }
  }, [editId, expenses]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date || !category || !amount)
      return alert("모든 필수 항목을 입력하세요!");
    if (editId) {
      setExpenses(
        expenses.map((item) =>
          item.id === editId
            ? { ...item, date, category, amount: +amount, memo }
            : item
        )
      );
      setEditId(null); // 수정 모드 종료
    } else {
      const id = Date.now() + Math.random();
      setExpenses([...expenses, { id, date, category, amount: +amount, memo }]);
    }
    setDate(getToday());
    setCategory(CATEGORY_OPTIONS[0]);
    setAmount("");
    setMemo("");
  };

  // 취소 버튼(수정 중일 때만)
  const handleCancel = () => {
    setEditId(null);
    setDate(getToday());
    setCategory(CATEGORY_OPTIONS[0]);
    setAmount("");
    setMemo("");
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      >
        {CATEGORY_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <input
        type="number"
        placeholder="금액"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="메모(선택)"
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
      />
      <button type="submit">{editId ? "수정" : "저장"}</button>
      {editId && (
        <button
          type="button"
          onClick={handleCancel}
          style={{ marginLeft: "8px" }}
        >
          취소
        </button>
      )}
    </form>
  );
}
