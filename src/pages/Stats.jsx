import React, { useContext, useState } from "react";
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
  "#ffb3ba",
  "#2bf211",
  "#1120f2",
  "#f2c911",
  "#ffdfba",
  "#cba6ff",
  "#ffd6e0",
  "#a6e3e9",
];

const BAR_COLORS = [
  "#f1712c",
  "#f3e629",
  "#2af2c4",
  "#e4c1f9",
  "#ffb7b2",
  "#b5ead7",
  "#fff1c1",
  "#c4fae8",
];

export default function Stats() {
  const { expenses } = useContext(ExpenseContext);

  // 월별 목록 만들기 (중복 제거)
  const monthList = [
    ...new Set(expenses.map((e) => e.date?.slice(0, 7)).filter(Boolean)),
  ].sort((a, b) => b.localeCompare(a));

  // 드롭다운 상태 (기본: 최신월)
  const [selectedMonth, setSelectedMonth] = useState(
    monthList[0] || new Date().toISOString().slice(0, 7)
  );

  // 월별 필터
  const filtered = expenses.filter(
    (e) => e.date?.slice(0, 7) === selectedMonth
  );

  // 카테고리별 합계 데이터
  const categoryData = Object.entries(
    filtered.reduce((acc, cur) => {
      acc[cur.category] = (acc[cur.category] || 0) + Number(cur.amount);
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  // 날짜별 합계 데이터
  const dateData = Object.entries(
    filtered.reduce((acc, cur) => {
      acc[cur.date] = (acc[cur.date] || 0) + Number(cur.amount);
      return acc;
    }, {})
  )
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // 최다 소비 카테고리
  const maxCategory =
    categoryData.length > 0
      ? categoryData.reduce((max, cur) => (cur.value > max.value ? cur : max))
      : null;

  // 이번 달 총 지출
  const totalMonth = filtered.reduce((sum, cur) => sum + Number(cur.amount), 0);

  const fixedExpenses = filtered.filter((e) => e.isFixed);
  // 고정지출 카테고리별 합계
  const fixedCategoryData = Object.entries(
    fixedExpenses.reduce((acc, cur) => {
      acc[cur.category] = (acc[cur.category] || 0) + Number(cur.amount);
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  return (
    <div className="container-main">
      <h2>소비 분석</h2>
      {/* 월별 드롭다운 */}
      <div className="stats-month-filter stylish-dropdown">
        <label htmlFor="month-select">월별 선택:</label>
        <select
          id="month-select"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          {monthList.map((month) => (
            <option key={month} value={month}>
              {month}월
            </option>
          ))}
        </select>
      </div>
      {/* 카드형 합계 */}
      <div className="stats-header-card card">
        이번 달 총 지출:{" "}
        <span className="stat-number-animate">
          {totalMonth.toLocaleString()}원
        </span>
      </div>
      <div className="stats-charts-group">
        {/* Pie Chart */}
        <div>
          <div className="stats-highlight">카테고리별 소비 (PieChart)</div>
          <PieChart width={340} height={250}>
            <Pie
              dataKey="value"
              data={categoryData}
              cx={160}
              cy={110}
              outerRadius={70}
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
            <div className="stats-best-category stat-number-animate">
              최다 소비 카테고리: {maxCategory.name} (
              {maxCategory.value.toLocaleString()}원)
            </div>
          )}
        </div>
        {/* Bar Chart */}
        <div>
          <div className="stats-highlight">날짜별 소비 (BarChart)</div>
          <BarChart width={340} height={250} data={dateData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value">
              {dateData.map((entry, idx) => (
                <Cell
                  key={entry.date}
                  fill={BAR_COLORS[idx % BAR_COLORS.length]}
                />
              ))}
            </Bar>
            <Legend />
          </BarChart>
        </div>
        <div>
          <div className="stats-highlight" style={{ marginTop: 18 }}>
            고정지출 카테고리별 (PieChart)
          </div>
          <PieChart width={340} height={250}>
            <Pie
              dataKey="value"
              data={fixedCategoryData}
              cx={160}
              cy={110}
              outerRadius={70}
              label
            >
              {fixedCategoryData.map((entry, idx) => (
                <Cell
                  key={entry.name}
                  fill={CATEGORY_COLORS[idx % CATEGORY_COLORS.length]}
                  stroke="#fff"
                  strokeWidth={1}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
          {fixedCategoryData.length === 0 && (
            <div
              style={{
                color: "#bbb",
                textAlign: "center",
                fontSize: "1.03rem",
                marginTop: 15,
              }}
            >
              이번 달 고정지출 내역이 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
