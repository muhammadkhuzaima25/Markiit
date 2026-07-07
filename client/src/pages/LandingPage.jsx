import { Link } from 'react-router-dom';
import { FiSearch, FiPackage, FiTool, FiMapPin, FiStar, FiArrowRight, FiShield, FiMessageSquare, FiCalendar } from 'react-icons/fi';

const LandingPage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary text-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Your Local Marketplace for <span className="text-accent">Everything</span>
            </h1>
            <p className="text-white/80 text-lg md:text-xl mb-8">
              Buy & sell products, offer & book services, connect with your community. All in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="bg-accent text-primary px-8 py-3 rounded-xl font-semibold text-lg hover:bg-accent-dark no-underline transition-colors text-center">
                Get Started Free
              </Link>
              <Link to="/products" className="border-2 border-white/30 text-white px-8 py-3 rounded-xl font-semibold text-lg hover:bg-white/10 no-underline transition-colors text-center">
                Browse Listings
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-neutral">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-charcoal mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: FiSearch, title: 'Discover', desc: 'Browse products and services from your local community' },
              { icon: FiPackage, title: 'List', desc: 'Sell your products or offer your professional services' },
              { icon: FiCalendar, title: 'Book', desc: 'Schedule services and manage bookings easily' },
              { icon: FiMessageSquare, title: 'Connect', desc: 'Message sellers and service providers directly' },
            ].map((step, i) => (
              <div key={i} className="bg-white rounded-xl p-6 text-center border border-border hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <step.icon size={28} className="text-primary" />
                </div>
                <h3 className="font-semibold text-charcoal mb-2">{step.title}</h3>
                <p className="text-sm text-charcoal-light">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-charcoal mb-4">Explore Categories</h2>
          <p className="text-center text-charcoal-light mb-12">Find what you need or list what you offer</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Electronics', 'Furniture', 'Clothing', 'Vehicles', 'Graphic Design', 'Web Dev', 'Photography', 'Home Services'].map((cat) => (
              <Link
                key={cat}
                to={`/products?category=${encodeURIComponent(cat)}`}
                className="bg-white rounded-xl border border-border p-6 text-center hover:shadow-md hover:border-primary/30 transition-all no-underline group"
              >
                <span className="text-charcoal group-hover:text-primary font-medium transition-colors">{cat}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-neutral">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-charcoal mb-12">Why Choose Markiit</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: FiMapPin, title: 'Find Nearby', desc: 'Discover products and services in your local area with our map feature' },
              { icon: FiStar, title: 'Trusted Reviews', desc: 'Read and leave verified reviews to build community trust' },
              { icon: FiShield, title: 'Secure & Safe', desc: 'Secure messaging, verified profiles, and admin moderation' },
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-xl p-8 text-center border border-border">
                <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                  <feature.icon size={28} className="text-primary" />
                </div>
                <h3 className="font-semibold text-charcoal text-lg mb-2">{feature.title}</h3>
                <p className="text-charcoal-light text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-white/80 text-lg mb-8">Join your local community marketplace today. It's free to sign up.</p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-accent text-primary px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent-dark no-underline transition-colors">
            Create Your Account <FiArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
