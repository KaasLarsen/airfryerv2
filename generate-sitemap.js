// generate-sitemap.js

const fs = require("fs");
const path = require("path");

const SITE_URL = "https://opskrift-airfryer.dk";

function getAllHTMLFiles(dir, filelist = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filepath = path.join(dir, file);
    const stat = fs.statSync(filepath);

    if (stat.isDirectory()) {
      filelist = getAllHTMLFiles(filepath, filelist);
    } else if (file.endsWith(".html")) {
      filelist.push(filepath);
    }
  });

  return filelist;
}

function generateSitemap() {
  const htmlFiles = getAllHTMLFiles("./");

  // Fjern partials
  const publicPages = htmlFiles.filter(
    (f) => !f.includes("partials/") && !f.includes("node_modules/")
  );

  // Start sitemap
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  publicPages.forEach((file) => {
    const relativePath = file.replace("./", "");
    const url = `${SITE_URL}/${relativePath}`;
    sitemap += `
      <url>
        <loc>${url}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>
    `;
  });

  // Inkluder opskrifter fra recipes.json
  if (fs.existsSync("assets/recipes.json")) {
    const recipes = JSON.parse(fs.readFileSync("assets/recipes.json", "utf8"));
    recipes.forEach((r) => {
      sitemap += `
        <url>
          <loc>${SITE_URL}/${r.slug}.html</loc>
          <changefreq>weekly</changefreq>
          <priority>0.9</priority>
        </url>
      `;
    });
  }

  sitemap += `</urlset>`;

  fs.writeFileSync("sitemap.xml", sitemap);
  console.log("sitemap.xml genereret!");
}

generateSitemap();
