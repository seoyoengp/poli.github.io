const statements = [
  {
    id: 1,
    title: "청소년 노동권 보장을 촉구한다",
    date: "2026-02-14",
    content: "우리는 청소년 노동자에 대한 차별을 중단할 것을 요구한다..."
  },
  {
    id: 2,
    title: "성소수자 차별금지법 제정을 환영한다",
    date: "2026-01-20",
    content: "차별 없는 사회로 나아가기 위한 첫걸음을 지지한다..."
  }
];

function sortByDateDesc(arr) {
  return [...arr].sort((a, b) => new Date(b.date) - new Date(a.date));
}

function renderList() {
  const container = document.getElementById("statement-list");
  if (!container) return;

  container.innerHTML = "";
  const sorted = sortByDateDesc(statements);
  sorted.forEach(s => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${s.title}</h3>
      <p>${s.date}</p>
    `;
    card.onclick = () => {
      window.location.href = `statement.html?id=${s.id}`;
    };
    container.appendChild(card);
  });
}

function renderLatest() {
  const container = document.getElementById("latest-list");
  if (!container) return;

  const latest = sortByDateDesc(statements).slice(0, 2);
  latest.forEach(s => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<h3>${s.title}</h3>`;
    card.onclick = () => {
      window.location.href = `statement.html?id=${s.id}`;
    };
    container.appendChild(card);
  });
}

function renderDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"));
  const statement = statements.find(s => s.id === id);

  if (!statement) {
    const t = document.getElementById("title");
    const d = document.getElementById("date");
    const c = document.getElementById("content");
    if (t) t.textContent = "성명서를 찾을 수 없습니다";
    if (d) d.textContent = "";
    if (c) c.textContent = "";
    return;
  }

  document.getElementById("title").textContent = statement.title;
  document.getElementById("date").textContent = statement.date;
  document.getElementById("content").textContent = statement.content;
}

renderList();
renderLatest();
renderDetail();
