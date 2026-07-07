import { Link } from 'react-router-dom';
import { FaLinkedin, FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-primary text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div>
            <h3 className="text-xl font-bold mb-3">Markiit</h3>
            <p className="text-white/70 text-sm">
              Your local marketplace for products, services, and bookings. Connect with your community.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Marketplace</h4>
            <ul className="space-y-1.5 text-sm text-white/70 list-none p-0 m-0">
              <li><Link to="/products" className="hover:text-white no-underline text-white/70">Browse Products</Link></li>
              <li><Link to="/services" className="hover:text-white no-underline text-white/70">Browse Services</Link></li>
              <li><Link to="/nearby" className="hover:text-white no-underline text-white/70">Nearby</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Account</h4>
            <ul className="space-y-1.5 text-sm text-white/70 list-none p-0 m-0">
              <li><Link to="/dashboard" className="hover:text-white no-underline text-white/70">Dashboard</Link></li>
              <li><Link to="/my-listings" className="hover:text-white no-underline text-white/70">My Listings</Link></li>
              <li><Link to="/bookings" className="hover:text-white no-underline text-white/70">My Bookings</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Support</h4>
            <ul className="space-y-1.5 text-sm text-white/70 list-none p-0 m-0">
              <li><span className="text-white/70">support@markiit.com</span></li>
              <li><span className="text-white/70">Help Center</span></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Connect</h4>
            <div className="flex items-center gap-3">
              <a href="https://www.linkedin.com/in/muhammadkhuzaima25" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white transition-colors">
                <FaLinkedin size={20} />
              </a>
              <a href="https://github.com/muhammadkhuzaima25" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white transition-colors">
                <FaGithub size={20} />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/20 mt-6 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/50">
          <p>&copy; 2026 Markiit. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span>Built by Muhammad Khuzaima</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
