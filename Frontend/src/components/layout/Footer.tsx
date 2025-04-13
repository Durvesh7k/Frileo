
import { Link } from "react-router-dom";
import { Github, Twitter, Facebook, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-brand-blue">Freelance<span className="text-brand-orange">Flow</span></span>
            </Link>
            <p className="mt-2 text-sm text-gray-500">
              Connect with top-quality freelancers for your business needs.
            </p>
            <div className="flex mt-4 space-x-4">
              <a href="#" className="text-gray-500 hover:text-brand-blue">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-gray-500 hover:text-brand-blue">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-gray-500 hover:text-brand-blue">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-gray-500 hover:text-brand-blue">
                <Github size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase">For Clients</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/gigs" className="text-gray-500 hover:text-brand-blue">
                  Find Freelancers
                </Link>
              </li>
              <li>
                <Link to="/#categories" className="text-gray-500 hover:text-brand-blue">
                  Browse Categories
                </Link>
              </li>
              <li>
                <Link to="/my-orders" className="text-gray-500 hover:text-brand-blue">
                  Manage Orders
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase">For Freelancers</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/create-gig" className="text-gray-500 hover:text-brand-blue">
                  Create a Gig
                </Link>
              </li>
              <li>
                <Link to="/my-orders" className="text-gray-500 hover:text-brand-blue">
                  Manage Orders
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-500 hover:text-brand-blue">
                  Profile Settings
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase">Support</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="text-gray-500 hover:text-brand-blue">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-brand-blue">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-brand-blue">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-400 text-sm text-center">
            © {new Date().getFullYear()} FreelanceFlow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
