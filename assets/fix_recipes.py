import json
from pathlib import Path

IN_FILE = Path("recipes.json")
OUT_FILE = Path("recipes.updated.json")

# 1) Alias: ret “rod” i kategorier uden at miste noget
ALIAS = {
    "tilbehør": "tilbehor",
    "tilbehoer": "tilbehor",

    "sund": "sund-airfryer",

    "snack": "snacks-tilbehor",
    "snacks": "snacks-tilbehor",

    "grøntsager": "groentsager",

    "oksekød": "oksekoed",
}

POPULAR = {
    "sproede-kartofler",
    "kyllingefavoritter",
    "nem-aftensmad",
    "snacks-tilbehor",
    "sund-airfryer",
    "morgenmad",
    "bagvaerk",
}

def norm(s: str) -> str:
    return str(s).strip().lower()

def normalize_categories(cats):
    out = []
    for c in (cats or []):
        c2 = ALIAS.get(norm(c), norm(c))
        if c2:
            out.append(c2)
    # dedupe, keep order
    seen = set()
    deduped = []
    for c in out:
        if c not in seen:
            deduped.append(c)
            seen.add(c)
    return deduped

def add_popular_categories(cats):
    # Vi sletter intet. Vi tilføjer kun populære kategorier, hvor det giver mening.
    s = set(cats)

    # Hvis opskriften allerede har sproede-kartofler → den er ok
    # Hvis den har "kartofler" eller ligner kartoffelret, kan vi hjælpe:
    if "kartofler" in s or "tilbehor" in s:
        # Mange kartoffel-tilbehør bør med i sproede-kartofler
        # (du kan stramme/udvide denne regel senere)
        s.add("sproede-kartofler")

    # Sund
    if "sund-airfryer" in s:
        pass
    elif "protein" in s or "sund" in s:
        # 'sund' bliver allerede aliaset → men bare for safety
        s.add("sund-airfryer")

    # Snacks & tilbehør
    if "snacks-tilbehor" not in s:
        if "snack" in s or "snacks" in s or "tilbehor" in s:
            s.add("snacks-tilbehor")

    # Morgenmad
    if "morgenmad" in s:
        s.add("morgenmad")

    # Bagværk
    if "bagvaerk" in s:
        s.add("bagvaerk")

    # Kyllingefavoritter: hvis den har kylling, så tilføj også kyllingefavoritter
    if "kylling" in s or "fjerkrae" in s:
        s.add("kyllingefavoritter")

    # Nem aftensmad: hvis den allerede har nem-aftensmad → behold
    # (Vi gætter ikke for meget her – kun hvis den allerede er markeret)
    if "nem-aftensmad" in s:
        s.add("nem-aftensmad")

    # Returnér i stabil sortering: populære først for konsistens, resten bagefter
    popular_first = [c for c in POPULAR if c in s]
    rest = [c for c in cats if c in s and c not in POPULAR] + [c for c in s if c not in POPULAR and c not in cats]
    # dedupe igen
    seen = set()
    out = []
    for c in popular_first + rest:
        if c not in seen:
            out.append(c)
            seen.add(c)
    return out

def main():
    data = json.loads(IN_FILE.read_text(encoding="utf-8"))
    recipes = data.get("recipes", [])

    for r in recipes:
        cats = r.get("categories", [])
        cats = normalize_categories(cats)
        cats = add_popular_categories(cats)
        r["categories"] = cats

    data["recipes"] = recipes
    OUT_FILE.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Skrev: {OUT_FILE}")

if __name__ == "__main__":
    main()
