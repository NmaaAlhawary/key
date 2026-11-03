import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Apply from './pages/Apply.jsx'
import Partners from './pages/Partners.jsx'
import HowItWorks from './pages/HowItWorks.jsx'
import Application from './pages/Application.jsx'
import Challenges from './pages/Challenges.jsx'
import Vault from './pages/Vault.jsx'
import Parents from './pages/Parents.jsx'
import Faq from './pages/Faq.jsx'
import Contact from './pages/Contact.jsx'
import Status from './pages/Status.jsx'
import NotFound from './pages/NotFound.jsx'
import AdminApp from './admin/AdminApp.jsx'
import { useReveal } from './useReveal.js'

function ScrollTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function App() {
  const { pathname } = useLocation()
  useReveal()
  if (pathname.startsWith('/admin')) return <AdminApp />
  return (
    <div className="site">
      <ScrollTop />
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/application" element={<Application />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/vault" element={<Vault />} />
          <Route path="/parents" element={<Parents />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/status" element={<Status />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
