import "./home.css";

export default function Home() {
  return (
    <>
      {/* SPLASH SCREEN */}
      <div className="splash-screen">
        <div className="splash-content">

          {/* Mandala Corners */}
          <svg className="mandala-corner top-left" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" stroke="#ff6b35" fill="none" />
            <circle cx="50" cy="50" r="30" stroke="#fdc500" fill="none" />
            <circle cx="50" cy="50" r="20" stroke="#0066b3" fill="none" />
          </svg>

          <svg className="mandala-corner top-right" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" stroke="#ff6b35" fill="none" />
            <circle cx="50" cy="50" r="30" stroke="#fdc500" fill="none" />
            <circle cx="50" cy="50" r="20" stroke="#0066b3" fill="none" />
          </svg>

          <svg className="mandala-corner bottom-left" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" stroke="#ff6b35" fill="none" />
            <circle cx="50" cy="50" r="30" stroke="#fdc500" fill="none" />
            <circle cx="50" cy="50" r="20" stroke="#0066b3" fill="none" />
          </svg>

          <svg className="mandala-corner bottom-right" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" stroke="#ff6b35" fill="none" />
            <circle cx="50" cy="50" r="30" stroke="#fdc500" fill="none" />
            <circle cx="50" cy="50" r="20" stroke="#0066b3" fill="none" />
          </svg>

          {/* Splash Window */}
          <div className="window-container">
            <div className="window-frame">
              <div className="window-view">
                <div className="hills"></div>
                <div className="water"></div>
                <div className="palm-trees">🌴</div>
              </div>

              <div className="window-door left">
                <div className="door-pattern"></div>
              </div>

              <div className="window-door right">
                <div className="door-pattern"></div>
              </div>
            </div>

            <div className="people-icons person1">👷‍♂️</div>
            <div className="people-icons person2">👨‍🎓</div>
            <div className="people-icons person3">👵</div>
            <div className="people-icons person4">👩‍🏫</div>
          </div>

          <div className="splash-title">Jana-La</div>
          <div className="splash-tagline">window for everything</div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="main-content">

        {/* HERO */}
        {/* HERO */}
        <section className="hero">
          <div className="kerala-realistic-window">

            <div className="janala-clean hero-window">
              <div className="frame">
                <div className="glass-grid">
                  <div className="glass"></div>
                  <div className="glass"></div>
                  <div className="glass"></div>
                  <div className="glass"></div>
                </div>
              </div>

              {/* SHUTTERS */}
              <div className="shutter left-shutter"></div>
              <div className="shutter right-shutter"></div>
            </div>

            {/* PEOPLE AROUND WINDOW */}
            <div className="people-4side big-emojis">

              {/* TOP */}
              <div className="top">
                <span>👨‍🌾</span>   {/* Farmer */}
                <span>🧑‍🔧</span>   {/* Electrician */}
              </div>

              {/* RIGHT */}
              <div className="right">
                <span>👮‍♂️</span>   {/* Police */}
                <span>👩‍⚕️</span>   {/* Nurse */}
              </div>

              {/* BOTTOM */}
              <div className="bottom">
                <span>🛵</span>     {/* Delivery / Courier */}
                <span>👴</span>     {/* Elder caretaker */}
              </div>

              {/* LEFT */}
              <div className="left">
                <span>🧹</span>     {/* Cleaning services */}
                <span>👨‍🍳</span>   {/* Cook / Catering */}
              </div>

            </div>


            {/* OPEN JANALA BUTTON (CSS Controlled) */}
            <div className="open-janala-wrapper">
              <div className="arrow-down">👇</div>
              <a href="/register" className="open-janala-btn css-controlled">
                <span className="key-icon">🔑</span>
                <span className="ml-text"> തുറക്കുക</span>
              </a>
            </div>
          </div>
        </section>
        {/* CATEGORIES */}
        <section className="categories">
          <div className="categories-title">Popular Categories</div>

          <div className="grid">
            {[
              ["🧑‍🔧", "Plumbing & Electrical"],
              ["🏗️", "Construction"],
              ["👩‍🏫", "Tutoring"],
              ["👵", "Caregiving"],
              ["👨‍🍳", "Catering"],
              ["🚗", "Local Transport"],
              ["🧹", "Cleaning Services"],
              ["🌱", "Gardening"]
            ].map(([icon, title]) => (
              <div className="card" key={title}>
                <span>{icon}</span>
                {title}
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          Made with ❤️ for Kerala — <b>© 2025 Jana-La</b>
        </footer>

      </div>
    </>
  );
}
