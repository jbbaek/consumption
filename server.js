const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const session = require("express-session");

const app = express();
const port = 5000;

// 미들웨어
app.use(
  cors({
    origin: "http://localhost:3000", // 리액트 개발 주소
    credentials: true, // 쿠키 세션 허용
  })
);
app.use(bodyParser.json());
app.use(
  session({
    secret: "supersecret",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 }, // 1시간
  })
);

// MySQL 연결
const db = mysql.createConnection({
  host: "localhost",
  user: "manager",
  password: "1234", // 본인 MySQL 비밀번호로!
  database: "consume_analyzer",
});

db.connect((err) => {
  if (err) {
    console.error("MySQL 연결 실패:", err);
    return;
  }
  console.log("MySQL 연결 성공!");
});

// 로그인 API
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  db.query(
    "SELECT * FROM user WHERE username = ? AND password = ?",
    [username, password], // *실무에선 비밀번호 암호화 필수!
    (err, results) => {
      if (err) return res.status(500).json({ error: "DB 오류" });
      if (results.length > 0) {
        req.session.user = { id: results[0].id, username };
        res.json({ success: true, username });
      } else {
        res.json({ success: false, message: "로그인 실패" });
      }
    }
  );
});

// 현재 로그인 상태 확인
app.get("/api/check", (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});

// 로그아웃
app.post("/api/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

// 회원가입 API
app.post("/api/register", (req, res) => {
  const { username, password, email } = req.body;
  db.query(
    "INSERT INTO user (username, password, email) VALUES (?, ?, ?)",
    [username, password, email],
    (err, result) => {
      if (err) return res.status(500).json({ error: "DB 입력 실패" });
      res.json({ success: true });
    }
  );
});

// 소비 내역 불러오기 (로그인한 사용자만)
app.get("/api/expenses", (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: "로그인 필요" });
  const user_id = req.session.user.id;
  db.query(
    "SELECT * FROM expense WHERE user_id = ? ORDER BY expense_date DESC, id DESC",
    [user_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: "DB 조회 오류" });
      res.json(results);
    }
  );
});

// 소비 내역 추가 (로그인한 사용자만)
app.post("/api/expenses", (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: "로그인 필요" });
  const user_id = req.session.user.id;
  const { expense_date, category, item, amount } = req.body;
  db.query(
    "INSERT INTO expense (user_id, expense_date, category, item, amount) VALUES (?, ?, ?, ?, ?)",
    [user_id, expense_date, category, item, amount],
    (err, result) => {
      if (err) return res.status(500).json({ error: "DB 입력 오류" });
      res.json({ success: true, id: result.insertId });
    }
  );
});

// 소비 내역 삭제
app.delete("/api/expenses/:id", (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: "로그인 필요" });
  const user_id = req.session.user.id;
  const expense_id = req.params.id;
  db.query(
    "DELETE FROM expense WHERE id = ? AND user_id = ?",
    [expense_id, user_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: "삭제 실패" });
      res.json({ success: true });
    }
  );
});

app.listen(port, () => {
  console.log(`서버 실행중! http://localhost:${port}`);
});
