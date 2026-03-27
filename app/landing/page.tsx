"use client"

import "@/app/styles/landing.css"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LandingPage() {
  const router = useRouter();
  return (
    <div className="landing-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <div className="logo-icon">⚕️</div>
            <span className="logo-text">Smart Health Care</span>
          </div>

          <nav className="nav">
            <a href="#home" className="nav-link">
              Home
            </a>
            <a href="#about" className="nav-link">
              About Us
            </a>
            <a href="#doctors" className="nav-link">
              Doctors
            </a>
            <a href="#contact" className="nav-link">
              Contact Us
            </a>
          </nav>

          <div className="header-actions">
            <button
              className="btn-secondary"
              onClick={() => router.push("/login")}
            >
              Login
            </button>
            <button 
            className="btn-primary"
            onClick={()=> router.push("/signup")}
            >
              SignUp</button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
<section className="hero">
  <div className="hero-content">
    <div className="hero-text">
      <h1 className="hero-title">Elite Health Services</h1>

      <div className="hero-badges">
        <div className="badge">
          <span className="badge-icon">✓</span>
          <span>Reduce HbA1c</span>
        </div>
        <div className="badge">
          <span className="badge-icon">✓</span>
          <span>No more medications</span>
        </div>
      </div>

      <p className="hero-description">
        Providing the highest level of medical expertise and care, tailored to support your wellness journey.
      </p>

      <Link href="/login">
  <button className="btn-hero">
    Schedule An Appointment
  </button>
</Link>
    </div>
  </div>
</section>

      {/* Features Section */}
      <section className="features">
        <div className="feature-card feature-card-cream">
          <div className="feature-icon"></div>
          <h3 className="feature-title">Expert Doctors</h3>
          <p className="feature-description">
            Book your health consultation with top Medicare doctors for exceptional and personalized care today
          </p>
          <button className="btn-feature">Scheduling Now →</button>
        </div>

        <div className="feature-card feature-card-purple">
          <div className="feature-icon"></div>
          <h3 className="feature-title">Appointment</h3>
          <p className="feature-description">
            Schedule your appointment with the best Medicare doctors for expert healthcare and personalized service
          </p>
          <button className="btn-feature">Scheduling Now →</button>
        </div>

        <div className="feature-card feature-card-blue">
          <div className="feature-icon"></div>
          <h3 className="feature-title">Constant Support</h3>
          <p className="feature-description">
            Reserve your consultation with leading Medicare doctors for trusted, high-quality care and treatment
          </p>
          <button className="btn-feature">Scheduling Now →</button>
        </div>
      </section>
    </div>
  )
}
