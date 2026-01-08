<script>
document.addEventListener("DOMContentLoaded", () => {
  // kun kør på anmeldelsessider
  if (!location.pathname.includes("/anmeldelser/")) return;

  const h1 = document.querySelector("h1");
  const title = (h1?.textContent || document.title || "").trim();

  const imgEl = document.querySelector(".product-thumb");
  const imageUrl = imgEl?.src ? new URL(imgEl.src, location.href).href : null;

  const ratingText = document.querySelector(".rating-text")?.textContent?.trim() || "";
  // matcher "4 ud af 5" eller "4,5 ud af 5"
  const match = ratingText.match(/([\d.,]+)\s*ud\s*af\s*([\d.,]+)/i);
  const ratingValue = match ? match[1].replace(",", ".") : null;
  const bestRating = match ? match[2].replace(",", ".") : "5";

  // prøv at udlede produktnavn fra H1 ved at fjerne "anmeldelse"
  let productName = title.replace(/\s*anmeldelse.*$/i, "").trim();
  if (!productName) productName = title;

  // forsøger at læse dato fra eksisterende schema hvis der findes (fallback = i dag)
  const existingLd = document.querySelector('script[type="application/ld+json"]');
  let datePublished = null;
  if (existingLd) {
    try {
      const obj = JSON.parse(existingLd.textContent);
      if (obj?.datePublished) datePublished = obj.datePublished;
    } catch (e) {}
  }
  if (!datePublished) {
    const d = new Date();
    datePublished = d.toISOString().slice(0,10);
  }

  // hvis vi ikke kan finde rating, så lad være (hellere ingen schema end fejl)
  if (!ratingValue) return;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Review",
    "name": title,
    "datePublished": datePublished,
    "inLanguage": "da-DK",
    "author": {
      "@type": "Organization",
      "name": "Opskrift-Airfryer",
      "url": "https://www.opskrift-airfryer.dk/"
    },
    "itemReviewed": {
      "@type": "Product",
      "name": productName,
      ...(imageUrl ? { "image": [imageUrl] } : {}),
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": String(ratingValue),
        "bestRating": String(bestRating),
        "ratingCount": "1"
      }
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": String(ratingValue),
      "bestRating": String(bestRating),
      "worstRating": "1"
    }
  };

  // inject JSON-LD som rigtig ld+json script
  const s = document.createElement("script");
  s.type = "application/ld+json";
  s.textContent = JSON.stringify(jsonLd);
  document.head.appendChild(s);
});
</script>
