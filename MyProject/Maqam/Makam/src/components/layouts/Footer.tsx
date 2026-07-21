import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
                MH
              </div>
              <span className="font-bold">Maquam Holidays</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your trusted partner for Hajj and Umrah pilgrimages
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/flights" className="text-muted-foreground hover:text-primary">Flights</Link></li>
              <li><Link to="/hotels" className="text-muted-foreground hover:text-primary">Hotels</Link></li>
              <li><Link to="/packages" className="text-muted-foreground hover:text-primary">Packages</Link></li>
              <li><Link to="/ai-package-generator" className="text-muted-foreground hover:text-primary">AI Generator</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/resources" className="text-muted-foreground hover:text-primary">Travel Guides</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary">Contact Us</Link></li>
              <li><Link to="/customer-portal" className="text-muted-foreground hover:text-primary">My Account</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>+1 (555) 123-4567</li>
              <li>info@maquamholidays.com</li>
              <li>123 Travel Street</li>
              <li>New York, NY 10001</li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Maquam Holidays Pvt Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
