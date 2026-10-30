import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Truck, Clock, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Ultra-Fast Delivery</h4>
              <p className="text-xs text-slate-400">Piping hot food in 30 minutes</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100% Hygienic Food</h4>
              <p className="text-xs text-slate-400">Certified culinary partners</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Live Real-time Tracking</h4>
              <p className="text-xs text-slate-400">Follow your order step by step</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Daily Exclusive Deals</h4>
              <p className="text-xs text-slate-400">Save up to 40% with coupons</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12">
          {/* Brand info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-orange-500 flex items-center justify-center text-white text-xl">
                🍔
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                Bite<span className="text-orange-500">Rush</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              BiteRush is your premier food delivery destination connecting food lovers to exceptional culinary creations from world-class restaurants.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>using React, Tailwind & Vite</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Quick Navigation
            </h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/" className="hover:text-orange-400 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-orange-400 transition">
                  Explore Full Menu
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-orange-400 transition">
                  My Orders & Tracking
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-orange-400 transition">
                  Account Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Cuisines */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Popular Cuisines
            </h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/menu?cuisine=Italian" className="hover:text-orange-400 transition">
                  Authentic Italian Pizza & Pasta
                </Link>
              </li>
              <li>
                <Link to="/menu?cuisine=Asian" className="hover:text-orange-400 transition">
                  Asian Ramen & Stir Fry
                </Link>
              </li>
              <li>
                <Link to="/menu?cuisine=American" className="hover:text-orange-400 transition">
                  Gourmet Wagyu Burgers
                </Link>
              </li>
              <li>
                <Link to="/menu?cuisine=Mexican" className="hover:text-orange-400 transition">
                  Crispy Mexican Street Tacos
                </Link>
              </li>
            </ul>
          </div>

          {/* Promo newsletter */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Stay Hungry For Deals
            </h5>
            <p className="text-xs text-slate-400 mb-3">
              Subscribe to get instant alerts on chef specials and discounts.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full text-xs px-3 py-2 bg-slate-800 rounded-xl border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500"
              />
              <button
                type="button"
                className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-3 py-2 rounded-xl transition"
              >
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} BiteRush Food Delivery. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Cookie Settings</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
