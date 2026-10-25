# PropSure AI

AI-powered property discovery, location intelligence and smart home buying platform.

**Status: Phase 1 complete** (project structure + professional frontend, sample data only).

## Folder structure
```
propsure-ai/
├─ README.md
├─ .gitignore
├─ server/                  (Phase 5: Express + MongoDB)
└─ client/
   ├─ package.json, vite.config.js, tailwind.config.js, postcss.config.js
   ├─ index.html, .env.example
   └─ src/
      ├─ main.jsx, App.jsx, index.css
      ├─ components/  Navbar, Footer, SearchBar, PropertyCard
      ├─ pages/       Home, Search, Placeholder
      ├─ data/        demoProperties.js  (SAMPLE DATA)
      └─ utils/       format.js
```

## Run on Windows (VS Code terminal)
```powershell
node -v          # needs Node 18 or newer
cd client
copy .env.example .env
npm install
npm run dev
```
Open http://localhost:5173

## Verify Phase 1
1. Home page shows hero, featured properties, property types, facilities, how it works, benefits, footer.
2. Switch Buy/Rent, pick budget, click Search: results page filters sample data.
3. Search "Salem" (Buy): 2 results. Search "zzz": empty state appears.
4. Click a property type tile: results filtered by type.
5. Shrink the window: mobile menu (☰) works.
6. Nav links to later pages show "Planned for Phase N".

## Notes
- All listings are SAMPLE data and shown as "Unverified". No verification badge exists until a real process is built.
- Price per sq ft is calculated from sample price and area.

## Roadmap
Phase 2 details page + advanced filters · 3 maps/facilities · 4 calculator + compare · 5 backend/MongoDB · 6 auth + saved · 7 recommendations + commute · 8 testing.
