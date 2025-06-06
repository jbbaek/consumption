import React, { useContext } from "react";
import { ExpenseContext } from "../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import "../css/ExpenseTable.css";

export default function ExpenseTable({ showFavorite }) {
  const { expenses, setExpenses, favoriteIds, setFavoriteIds, setEditId } =
    useContext(ExpenseContext);

  // 최다 소비 카테고리 찾기
  const categorySum = expenses.reduce((acc, cur) => {
    acc[cur.category] = (acc[cur.category] || 0) + cur.amount;
    return acc;
  }, {});
  const maxCategoryName = Object.keys(categorySum).reduce(
    (max, cur) => (categorySum[cur] > (categorySum[max] || 0) ? cur : max),
    ""
  );

  let list = expenses;
  if (showFavorite) list = expenses.filter((e) => favoriteIds.includes(e.id));

  return (
    <table className="expense-table">
      <thead>
        <tr>
          <th>날짜</th>
          <th>카테고리</th>
          <th>금액</th>
          <th>메모</th>
          <th>즐겨찾기</th>
          <th>수정</th>
          <th>삭제</th>
        </tr>
      </thead>
      <tbody>
        {list
          .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id)
          .map((item) => (
            <tr
              key={item.id}
              className={favoriteIds.includes(item.id) ? "favorite-row" : ""}
            >
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
                <button
                  className={`btn-favorite${
                    favoriteIds.includes(item.id) ? " active" : ""
                  }`}
                  onClick={() =>
                    setFavoriteIds(
                      favoriteIds.includes(item.id)
                        ? favoriteIds.filter((fid) => fid !== item.id)
                        : [...favoriteIds, item.id]
                    )
                  }
                  aria-label="즐겨찾기"
                  type="button"
                >
                  <FontAwesomeIcon icon={faStar} />
                </button>
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
                    setFavoriteIds(
                      favoriteIds.filter((fid) => fid !== item.id)
                    );
                  }}
                  type="button"
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}
