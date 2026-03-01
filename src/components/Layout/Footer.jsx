import { Link } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/booking', label: 'Book Now' },
]

const HOURS = [
  { day: 'Monday', time: '9am – 7pm' },
  { day: 'Tuesday', time: 'Closed' },
  { day: 'Wednesday', time: '9am – 7pm' },
  { day: 'Thursday', time: '9am – 7pm' },
  { day: 'Friday', time: '9am – 7pm' },
  { day: 'Saturday', time: '9am – 7pm' },
  { day: 'Sunday', time: '10am – 6pm' },
]

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground border-t border-primary-foreground/10">

      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand col */}
          <div className="space-y-4">
            <Link
              to="/"
              className="text-xl font-bold tracking-tight text-primary-foreground hover:text-primary-foreground/70 transition-colors duration-200 inline-block"
            >
              Edward Cut Studio
            </Link>
            <p className="text-sm text-primary-foreground/60 leading-relaxed max-w-xs">
              Professional barbering and grooming services in a modern, relaxing environment.
            </p>
            {/* Nav links */}
            <ul className="flex flex-col gap-1 pt-2">
              {NAV_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-primary-foreground/50 hover:text-primary-foreground transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours col */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-primary-foreground/40">
              Hours
            </h3>
            <ul className="space-y-2">
              {HOURS.map(({ day, time }) => (
                <li key={day} className="flex justify-between text-sm">
                  <span className={`${time === 'Closed' ? 'text-primary-foreground/30' : 'text-primary-foreground/60'}`}>
                    {day}
                  </span>
                  <span className={`font-medium ${time === 'Closed' ? 'text-primary-foreground/25' : 'text-primary-foreground/80'}`}>
                    {time}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact col */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-primary-foreground/40">
              Contact
            </h3>
            <ul className="space-y-2 text-sm text-primary-foreground/60">
              <li>123 Barber Street</li>
              <li>New York, NY 10001</li>
              <li>
                <a
                  href="tel:+15551234567"
                  className="hover:text-primary-foreground transition-colors duration-200"
                >
                  (555) 123-4567
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@edwardcutstudio.com"
                  className="hover:text-primary-foreground transition-colors duration-200"
                >
                  info@edwardcutstudio.com
                </a>
              </li>
            </ul>

            {/* Book CTA */}
            <div className="pt-4">
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 text-sm font-semibold bg-primary-foreground text-primary px-5 py-2.5 hover:bg-primary-foreground/90 transition-colors duration-200"
              >
                Book an Appointment →
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-primary-foreground/30">
            © {new Date().getFullYear()} Edward Cut Studio. All rights reserved.
          </p>
          <p className="text-xs text-primary-foreground/20">
            Premium Barbering · Est. 2024
          </p>
        </div>
      </div>

    </footer>
  )
}