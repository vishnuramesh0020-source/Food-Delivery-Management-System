import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Utensils } from 'lucide-react';
import Button from '../components/common/Button';

const NotFoundPage = () => {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="w-28 h-28 bg-orange-100 text-orange-500 rounded-3xl flex items-center justify-center text-5xl mb-6 shadow-inner animate-bounce">
        🍕
      </div>
      <span className="text-xs font-black uppercase tracking-widest text-orange-600 bg-orange-50 px-3 py-1 rounded-full mb-3">
        Error 404
      </span>
      <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-2">
        Page Not Found
      </h1>
      <p className="text-sm text-slate-500 max-w-md mb-8">
        Oops! The page you were looking for doesn&apos;t exist or was moved to another table.
      </p>
      <div className="flex gap-3">
        <Link to="/">
          <Button variant="primary" icon={Home}>
            Back to Home
          </Button>
        </Link>
        <Link to="/menu">
          <Button variant="outline" icon={Utensils}>
            Explore Menu
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
