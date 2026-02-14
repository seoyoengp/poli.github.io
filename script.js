function getUsers() {
  try {
    const raw = localStorage.getItem("users");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function getCurrentUser() {
  try {
    const raw = localStorage.getItem("currentUser");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setCurrentUser(user) {
  localStorage.setItem("currentUser", JSON.stringify(user));
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}

function attachAuthHandlers() {
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", e => {
      e.preventDefault();
      const email = loginForm.querySelector("input[name='email']").value.trim();
      const password = loginForm.querySelector("input[name='password']").value;
      const users = getUsers();
      const found = users.find(u => u.email === email && u.password === password);
      const errorEl = document.getElementById("login-error");
      if (!found) {
        if (errorEl) errorEl.textContent = "이메일 또는 비밀번호가 올바르지 않습니다";
        return;
      }
      setCurrentUser({ name: found.name, email: found.email });
      window.location.href = "board.html";
    });
  }

  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", e => {
      e.preventDefault();
      const name = registerForm.querySelector("input[name='name']").value.trim();
      const email = registerForm.querySelector("input[name='email']").value.trim();
      const password = registerForm.querySelector("input[name='password']").value;
      const users = getUsers();
      const errorEl = document.getElementById("register-error");
      if (users.some(u => u.email === email)) {
        if (errorEl) errorEl.textContent = "이미 가입된 이메일입니다";
        return;
      }
      users.push({ name, email, password });
      saveUsers(users);
      setCurrentUser({ name, email });
      window.location.href = "board.html";
    });
  }

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      logout();
    });
  }
}

function getPosts() {
  try {
    const raw = localStorage.getItem("posts");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function savePosts(posts) {
  localStorage.setItem("posts", JSON.stringify(posts));
}

function renderBoard() {
  const board = document.getElementById("board-list");
  if (!board) return;
  const user = getCurrentUser();
  if (!user) {
    window.location.href = "login.html";
    return;
  }
  const welcome = document.getElementById("board-welcome");
  if (welcome) {
    welcome.textContent = `${user.name}님 환영합니다`;
  }
  const posts = getPosts().sort((a, b) => b.createdAt - a.createdAt);
  board.innerHTML = "";
  posts.forEach((p, idx) => {
    const item = document.createElement("div");
    item.className = "card";
    const date = new Date(p.createdAt);
    item.innerHTML = `
      <h3>${p.title}</h3>
      <p>${date.toLocaleString()}</p>
      <p>${p.content}</p>
      <div class="board-actions">
        <button class="btn-outline" data-idx="${idx}">삭제</button>
      </div>
    `;
    const delBtn = item.querySelector("button");
    delBtn.onclick = () => {
      const all = getPosts();
      const target = all[idx];
      if (target.email !== user.email) return;
      all.splice(idx, 1);
      savePosts(all);
      renderBoard();
    };
    board.appendChild(item);
  });

  const form = document.getElementById("post-form");
  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const title = form.querySelector("input[name='title']").value.trim();
      const content = form.querySelector("textarea[name='content']").value.trim();
      if (!title || !content) return;
      const posts = getPosts();
      posts.push({
        title,
        content,
        email: user.email,
        author: user.name,
        createdAt: Date.now()
      });
      savePosts(posts);
      form.reset();
      renderBoard();
    });
  }
}

function init() {
  attachAuthHandlers();
  renderBoard();
  applyThemeFromStorage();
  attachThemeToggle();
}

init();

function applyThemeFromStorage() {
  const saved = localStorage.getItem("theme");
  const theme = saved || (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  document.documentElement.setAttribute("data-theme", theme);
  const btn = document.getElementById("theme-toggle");
  if (btn) setThemeButtonIcon(btn, theme);
}

function attachThemeToggle() {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    const next = current === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    setThemeButtonIcon(btn, next);
  });
}

function setThemeButtonIcon(btn, theme) {
  btn.textContent = theme === "light" ? "🌙" : "☀️";
  btn.setAttribute("aria-label", theme === "light" ? "다크모드" : "라이트모드");
}
