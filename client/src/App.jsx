import { Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Search from './pages/Search.jsx';
import PropertyDetails from './pages/PropertyDetails.jsx';
import { Login, Register } from './pages/Auth.jsx';
import Saved from './pages/Saved.jsx';
import Placeholder from './pages/Placeholder.jsx';

function Layout() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1"><Outlet /></main>
      <Footer />
    </div>
  );
}

const later = [
  ['map', 'Map & Facilities', 3, 'Interactive map with schools, hospitals, petrol stations, transport and more.'],
  ['compare', 'Compare Properties', 4, 'Compare at least three properties side by side.'],
  ['calculator', 'Cost Calculator', 4, 'Upfront cost, EMI, maintenance and commute estimates.'],
  ['recommendations', 'AI Recommendations', 7, 'Transparent, explainable property shortlist.'],
  ['dashboard', 'Dashboard', 6, 'Saved properties, searches and preferences.'],
  ['admin', 'Admin Dashboard', 6, 'Manage listings, reports and verification workflow.'],
  ['about', 'About', 2, 'About PropSure AI.'],
  ['contact', 'Contact', 2, 'Get in touch with the team.'],
  ['privacy', 'Privacy Policy', 2, 'How we handle your data.'],
  ['terms', 'Terms of Use', 2, 'Terms for using PropSure AI.']
];

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="search" element={<Search />} />
        <Route path="properties/:id" element={<PropertyDetails />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="saved" element={<Saved />} />
        {later.map(([path, title, phase, desc]) => (
          <Route key={path} path={path} element={<Placeholder title={title} phase={phase} description={desc} />} />
        ))}
        <Route path="*" element={<Placeholder title="Page not found" description="The page you are looking for does not exist." />} />
      </Route>
    </Routes>
  );
}