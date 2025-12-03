// /assets/include.js
(async function injectIncludes(){
  const nodes = Array.from(document.querySelectorAll("[data-include]"));

  async function loadInto(el){
    const url = el.getAttribute("data-include");
    if (!url) return;
    try {
      const res = await fetch(url, { cache: "no-cache" });
      if (!res.ok) throw new Error("http "+res.status);
      const html = await res.text();

      const range = document.createRange();
      range.selectNode(el);
      const fragment = range.createContextualFragment(html);
      el.replaceWith(fragment);

      // kør scripts inde i fragmentet (header/footer)
      fragment.querySelectorAll("script").forEach(old => {
        const s = document.createElement("script");
        for (const {name, value} of Array.from(old.attributes)) {
          if (name === "src") continue;
          s.setAttribute(name, value);
        }
        if (old.src) {
          s.src = old.src;
          s.async = old.async;
        } else {
          s.textContent = old.textContent || "";
        }
        old.replaceWith(s);
      });
    } catch(e){
      console.warn("include fail", url, e);
    }
  }

  await Promise.all(nodes.map(loadInto));

  // markér aktiv nav
  const path = location.pathname.replace(/\/index\.html$/, "/");
  document.querySelectorAll(".nav a[href]").forEach(a => {
    const href = a.getAttribute("href");
    if (!href || href.startsWith("#")) return;
    if (path === href || path === href.replace(/\/index\.html$/, "/")) {
      a.classList.add("active");
    }
  });
})();
