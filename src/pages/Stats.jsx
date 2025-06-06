import React, { useContext } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { ExpenseContext } from "../App";
import "../css/Stats.css";

const CATEGORY_COLORS = [
  "#A9BCD0",
  "#FFBB28",
  "#FF8042",
  "#AA336A",
  "#0088FE",
  "#00C49F",
];

export default function Stats() {
  const { expenses } = useContext(ExpenseContext);

  // 카테고리별 합계
  const categoryData = Object.entries(
    expenses.reduce((acc, cur) => {
      acc[cur.category] = (acc[cur.category] || 0) + cur.amount;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  // 날짜별 합계
  const dateData = Object.entries(
    expenses.reduce((acc, cur) => {
      acc[cur.date] = (acc[cur.date] || 0) + cur.amount;
      return acc;
    }, {})
  )
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // 최다 소비 카테고리
  const maxCategory = categoryData.reduce(
    (max, cur) => (cur.value > (max?.value || 0) ? cur : max),
    null
  );

  // 이번 달 총합/평균
  const now = new Date();
  const monthStr = now.toISOString().slice(0, 7);
  const expensesThisMonth = expenses.filter(
    (e) => e.date.slice(0, 7) === monthStr
  );
  const totalMonth = expensesThisMonth.reduce(
    (sum, cur) => sum + cur.amount,
    0
  );
  const daysInMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0
  ).getDate();
  const avgPerDay = daysInMonth ? (totalMonth / daysInMonth).toFixed(0) : 0;

  return (
    <div className="container-main">
      <h2>소비 분석</h2>
      <div
        style={{
          background: "#DCE3EA",
          borderRadius: 14,
          padding: 16,
          margin: "16px 0",
          maxWidth: 380,
        }}
      >
        <div>
          이번 달 총 지출: <b>{totalMonth.toLocaleString()}원</b>
        </div>
        <div>
          일 평균 소비: <b>{avgPerDay}원</b>
        </div>
      </div>
      <div style={{ display: "flex", gap: 36, flexWrap: "wrap" }}>
        <div>
          <div style={{ marginBottom: 8, fontWeight: "bold" }}>
            카테고리별 소비 (PieChart)
          </div>
          <PieChart width={340} height={250}>
            <Pie
              dataKey="value"
              data={categoryData}
              cx={160}
              cy={110}
              outerRadius={70}
              fill="#A9BCD0"
              label
            >
              {categoryData.map((entry, idx) => (
                <Cell
                  key={entry.name}
                  fill={CATEGORY_COLORS[idx % CATEGORY_COLORS.length]}
                  stroke={
                    maxCategory && maxCategory.name === entry.name
                      ? "#FF8080"
                      : "#fff"
                  }
                  strokeWidth={
                    maxCategory && maxCategory.name === entry.name ? 3 : 1
                  }
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
          {maxCategory && (
            <div
              style={{
                background: "#FFE066",
                fontWeight: "bold",
                borderRadius: "8px",
                padding: "2px 12px",
                marginTop: 6,
                display: "inline-block",
              }}
            >
              최다 소비 카테고리: {maxCategory.name} (
              {maxCategory.value.toLocaleString()}원)
            </div>
          )}
        </div>
        <div>
          <div style={{ marginBottom: 8, fontWeight: "bold" }}>
            날짜별 소비 (BarChart)
          </div>
          <BarChart width={340} height={250} data={dateData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#A9BCD0" />
          </BarChart>
        </div>
      </div>
    </div>
  );
}
