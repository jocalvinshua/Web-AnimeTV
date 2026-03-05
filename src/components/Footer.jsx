import { Github, Twitter, Instagram, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-white/5 pt-12 pb-8 px-4 md:px-12 lg:px-24 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10">
        
        {/* Brand Section */}
        <div className="space-y-4 max-w-sm">
          <Link to="/" className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold tracking-tight text-bright">
              Anime<span className="text-primary">TV</span>
            </h1>
          </Link>
          <p className="text-sm text-muted leading-relaxed">
            The ultimate destination for anime enthusiasts. Track, discover, and explore thousands of titles with our high-performance database.
          </p>
          <div className="flex gap-4 text-muted">
            <Github size={20} className="hover:text-primary cursor-pointer transition-colors" />
            <Twitter size={20} className="hover:text-primary cursor-pointer transition-colors" />
            <Instagram size={20} className="hover:text-primary cursor-pointer transition-colors" />
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-12 sm:gap-20">
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-bright">Explore</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li className="hover:text-primary transition-colors cursor-pointer">Top Anime</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Seasonal</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Upcoming</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-bright">Resources</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li className="hover:text-primary transition-colors cursor-pointer">Jikan API</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Privacy Policy</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Contact</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted font-medium">
        <p>© {currentYear} AnimeTV. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Made with <Heart size={14} className="text-primary fill-primary" /> by YourName
        </p>
      </div>
    </footer>
  );
}