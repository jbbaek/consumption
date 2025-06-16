import React, { useContext, useState } from "react";
import { ExpenseContext } from "../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import "../css/ExpenseTable.css";

export default function ExpenseTable({ showFixedOnly }) {
  const { expenses, setExpenses, setEditId } = useContext(ExpenseContext);

  // 드롭다운 날짜 필터 상태
  const [dateFilter, setDateFilter] = useState("");

  // 중복 없는 날짜 리스트(최신순)
  const dateList = [...new Set(expenses.map((e) => e.date))].sort((a, b) =>
    b.localeCompare(a)
  );

  // 드롭다운 적용된 필터링
  let list = expenses;
  if (showFixedOnly) list = list.filter((e) => e.isFixed);
  if (dateFilter) list = list.filter((e) => e.date === dateFilter);

  // 최다 소비 카테고리 강조용
  const categorySum = expenses.reduce((acc, cur) => {
    acc[cur.category] = (acc[cur.category] || 0) + cur.amount;
    return acc;
  }, {});
  const maxCategoryName = Object.keys(categorySum).reduce(
    (max, cur) => (categorySum[cur] > (categorySum[max] || 0) ? cur : max),
    ""
  );

  return (
    <div>
      {/* 날짜별 드롭다운 필터 */}
      <div className="expense-table-date-filter">
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          style={{
            padding: "7px 14px",
            borderRadius: 8,
            border: "1.2px solid #38b6ff",
            fontSize: "1rem",
          }}
        >
          <option value="">전체 날짜</option>
          {dateList.map((date) => (
            <option key={date} value={date}>
              {date}
            </option>
          ))}
        </select>
      </div>
      <table className="expense-table">
        <thead>
          <tr>
            <th>날짜</th>
            <th>카테고리</th>
            <th>금액</th>
            <th>메모</th>
            <th>고정비</th>
            <th>수정</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {list.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ textAlign: "center", color: "#bbb" }}>
                내역이 없습니다.
              </td>
            </tr>
          ) : (
            list
              .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id)
              .map((item) => (
                <tr key={item.id} className={item.isFixed ? "fixed-row" : ""}>
                  <td>{item.date}</td>
                  <td
                    className={
                      maxCategoryName === item.category ? "max-category" : ""
                    }
                  >
                    {item.category}
                  </td>
                  <td style={{ fontWeight: "bold" }}>
                    {item.amount.toLocaleString()}
                  </td>
                  <td>{item.memo}</td>
                  <td>
                    {item.isFixed && (
                      <span title="고정지출">
                        <FontAwesomeIcon
                          icon={faStar}
                          style={{ color: "#fbc02d" }}
                        />
                      </span>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => setEditId(item.id)}
                      type="button"
                    >
                      수정
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn-delete"
                      onClick={() => {
                        setExpenses(expenses.filter((e) => e.id !== item.id));
                      }}
                      type="button"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))
          )}
        </tbody>
      </table>
    </div>
  );
}
