document.addEventListener("DOMContentLoaded", () => {
  // Kør kun på anmeldelser
  if (!location.pathname.includes("/anmeldelser/")) return;

  // Find alle eksisterende JSON-LD scripts
  const ldScripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
  if (ldScripts.length === 0) return;

  // Hjælper: parse JSON-LD sikkert (nogle sider kan have flere objekter/arrays)
  const safeParse = (txt) => {
    try { return JSON.parse(txt); } catch (e) { return null; }
  };

  // Finder Review-objekt inde i et obj/array
  const findReviewObject = (data) => {
    if (!data) return null;

    // Hvis array, find første Review
    if (Array.isArray(data)) {
      return data.find(x => x && typeof x === "object" && x["@type"] === "Review") || null;
    }

    // Hvis direkte Review
    if (typeof data === "object" && data["@type"] === "Review") return data;

    // Hvis graph
    if (typeof data === "object" && Array.isArray(data["@graph"])) {
      return data["@graph"].find(x => x && typeof x === "object" && x["@type"] === "Review") || null;
    }

    return null;
  };

  // Forsøg at finde et Review-schema vi kan patch'e
  let targetScript = null;
  let rootData = null;
  let reviewObj = null;

  for (const s of ldScripts) {
    const parsed = safeParse(s.textContent.trim());
    const r = findReviewObject(parsed);
    if (r) {
      targetScript = s;
      rootData = parsed;
      reviewObj = r;
      break;
    }
  }

  if (!targetScript || !reviewObj) return;

  const item = reviewObj.itemReviewed;
  const rr = reviewObj.reviewRating;

  // Skal have Product som itemReviewed
  if (!item || typeof item !== "object" || item["@type"] !== "Product") return;

  // Hvis aggregateRating allerede findes, så gør ingenting
  if (item.aggregateRating) return;

  // ratingValue skal kunne findes
  let ratingValue = null;
  let bestRating = "5";
  let worstRating = "1";

  if (rr && typeof rr === "object") {
    if (rr.ratingValue != null) ratingValue = String(rr.ratingValue).replace(",", ".");
    if (rr.bestRating != null) bestRating = String(rr.bestRating).replace(",", ".");
    if (rr.worstRating != null) worstRating = String(rr.worstRating).replace(",", ".");
  }

  // fallback: prøv at læse fra tekst på siden (fx "4 ud af 5")
  if (!ratingValue) {
    const ratingText = document.querySelector(".rating-text")?.textContent?.trim() || "";
    const m = ratingText.match(/([\d.,]+)\s*ud\s*af\s*([\d.,]+)/i);
    if (m) {
      ratingValue = m[1].replace(",", ".");
      bestRating = m[2].replace(",", ".");
    }
  }

  // Hvis vi stadig ikke kan finde rating, så patcher vi ikke (hellere ingen end fejl)
  if (!ratingValue) return;

  // Patch: tilføj aggregateRating til Product
  item.aggregateRating = {
    "@type": "AggregateRating",
    "ratingValue": ratingValue,
    "bestRating": bestRating,
    "worstRating": worstRating,
    "ratingCount": "1"
  };

  // Hvis reviewObj ligger inde i array/@graph, er det samme reference – vi har allerede ændret det.
  // Skriv opdateret JSON tilbage i samme script, så der IKKE kommer dubletter.
  try {
    targetScript.textContent = JSON.stringify(rootData, null, 2);
  } catch (e) {
    // Hvis stringify fejler, gør ingenting.
  }
});
