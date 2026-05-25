(() => {
  const isSubPath = location.pathname.includes("/resources/");
  const prefix = isSubPath ? "../" : "";

  const navItems = [
    ["index.html", "首页"],
    ["system.html", "先看清"],
    ["cases.html", "真实家庭"],
    ["about.html", "认识做法"],
    ["contact.html", "带问题来"]
  ];

  const current = location.pathname.split("/").pop() || "index.html";

  const header = document.querySelector("[data-site-header]");
  if (header) {
    header.innerHTML = `
      <a class="skip-link" href="#main">跳到正文</a>
      <header class="site-header">
        <div class="site-header-inner">
          <a class="brand" href="${prefix}index.html" aria-label="回到首页">
            <span class="brand-mark" aria-hidden="true"></span>
            <span class="brand-text">
              <strong>月明 · 向未来家庭教育</strong>
              <span>先安静，再看清</span>
            </span>
          </a>

          <button class="nav-toggle" type="button" aria-label="打开导航" aria-expanded="false" data-nav-toggle>
            <span aria-hidden="true"></span>
          </button>

          <nav class="site-nav" aria-label="主导航">
            ${navItems.map(([href, label]) => {
              const active = current === href ? "is-active" : "";
              return `<a class="${active}" href="${prefix}${href}">${label}</a>`;
            }).join("")}
          </nav>
        </div>
      </header>
    `;
  }

  const footer = document.querySelector("[data-site-footer]");
  if (footer) {
    footer.innerHTML = `
      <footer class="site-footer">
        <div class="site-footer-inner">
          <p>© ${new Date().getFullYear()} 月明 · 向未来家庭教育。慢一点，也是在往前走。</p>
          <div class="footer-links">
            <a href="${prefix}value.html">为什么走向未来</a>
            <a href="${prefix}engine.html">背后支撑</a>
            <a href="${prefix}resources/parent-checklist.html">家长自检句卡</a>
          </div>
        </div>
      </footer>
    `;
  }
})();
