import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiHeart, FiShoppingBag, FiCalendar, FiStar } from 'react-icons/fi';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';

const SERVICES = [
  { icon: FiHeart, title: 'Pet Care', desc: 'Track vaccinations, medicines and health history in one place.' },
  { icon: FiCalendar, title: 'Vet Booking', desc: 'Book trusted veterinarians near you in a few taps.' },
  { icon: FiShoppingBag, title: 'Marketplace', desc: 'Shop food, toys and essentials curated for your pet.' },
];

const TESTIMONIALS = [
  { name: 'Aditi Sharma', text: 'PAWLX made managing my dog\u2019s vaccinations effortless.', role: 'Dog Parent' },
  { name: 'Rohan Mehta', text: 'Booked a vet appointment in minutes. Genuinely useful app.', role: 'Cat Parent' },
  { name: 'Priya Nair', text: 'The marketplace has everything, and the AI tips are handy.', role: 'Pet Owner' },
];

const FAQS = [
  { q: 'Is PAWLX free to use?', a: 'Yes, creating an account and browsing services is completely free.' },
  { q: 'Can I book multiple pets?', a: 'Absolutely — add as many pets as you like and manage them all from one dashboard.' },
  { q: 'How do I become a listed vet or sitter?', a: 'Register with a professional role and complete your profile for admin approval.' },
];

const LandingPage = () => {
  return (
    <div>
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-5 lg:px-8 pt-16 pb-20 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="inline-block px-3 py-1 rounded-full bg-primary-light text-primary text-xs font-medium mb-4">
            Trusted by 50,000+ pet parents
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-ink leading-tight mb-5">
            Everything your pet needs, all in one place
          </h1>
          <p className="text-ink-muted text-base leading-relaxed mb-8 max-w-md">
            From vet visits to vaccination reminders and a curated marketplace — PAWLX brings the entire pet
            care journey together.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/register">
              <Button size="lg" icon={<FiArrowRight />}>Get Started Free</Button>
            </Link>
            <Link to="/marketplace">
              <Button size="lg" variant="outline">Browse Marketplace</Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-card overflow-hidden shadow-cardHover"
        >
          <img
            src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=900&q=80"
            alt="Happy dog"
            className="w-full h-[380px] object-cover"
          />
        </motion.div>
      </section>

      {/* Services */}
      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-ink mb-2 text-center">Browse our services</h2>
        <p className="text-ink-muted text-center mb-10">Built around the everyday needs of pet parents</p>
        <div className="grid md:grid-cols-3 gap-6">
          {SERVICES.map(({ icon: Icon, title, desc }) => (
            <Card key={title} hoverable className="text-center py-8">
              <div className="h-12 w-12 rounded-lg bg-primary-light text-primary flex items-center justify-center mx-auto mb-4">
                <Icon size={20} />
              </div>
              <h3 className="font-semibold text-ink mb-1.5">{title}</h3>
              <p className="text-sm text-ink-muted">{desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Adoption Banner */}
      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-10">
        <div className="rounded-card bg-secondary-light p-10 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl font-bold text-ink mb-3">Give a pet a loving home</h3>
            <p className="text-ink-muted mb-5">
              Browse verified adoption listings and find your new best friend today.
            </p>
            <Link to="/adoption">
              <Button variant="secondary">Explore Adoptions</Button>
            </Link>
          </div>
          <img
            src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=700&q=80"
            alt="Adoptable pet"
            className="rounded-card h-56 w-full object-cover"
          />
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-ink mb-10 text-center">What pet parents say</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <Card key={t.name}>
              <div className="flex gap-1 mb-3 text-accent">
                {[...Array(5)].map((_, i) => <FiStar key={i} size={14} className="fill-accent" />)}
              </div>
              <p className="text-sm text-ink-muted mb-4">&ldquo;{t.text}&rdquo;</p>
              <p className="text-sm font-semibold text-ink">{t.name}</p>
              <p className="text-xs text-ink-muted">{t.role}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-5 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-ink mb-10 text-center">Frequently asked questions</h2>
        <div className="space-y-4">
          {FAQS.map((faq) => (
            <Card key={faq.q}>
              <h4 className="font-semibold text-ink mb-1.5">{faq.q}</h4>
              <p className="text-sm text-ink-muted">{faq.a}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
