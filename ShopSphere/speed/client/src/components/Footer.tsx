import { Link } from "wouter";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <span className="text-lg font-bold font-heading">S</span>
              </div>
              <span className="text-xl font-bold font-heading">Sppeeds</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Your trusted partner for quality engineering tools and equipment. Fast delivery, COD available.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover-elevate p-2 rounded-md" data-testid="link-facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover-elevate p-2 rounded-md" data-testid="link-instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover-elevate p-2 rounded-md" data-testid="link-twitter">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about">
                  <a className="text-muted-foreground hover:text-foreground hover-elevate px-2 py-1 rounded-md inline-block" data-testid="link-about">
                    About Us
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/categories">
                  <a className="text-muted-foreground hover:text-foreground hover-elevate px-2 py-1 rounded-md inline-block" data-testid="link-categories">
                    All Categories
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/track-order">
                  <a className="text-muted-foreground hover:text-foreground hover-elevate px-2 py-1 rounded-md inline-block" data-testid="link-track">
                    Track Order
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/loyalty">
                  <a className="text-muted-foreground hover:text-foreground hover-elevate px-2 py-1 rounded-md inline-block" data-testid="link-loyalty">
                    Loyalty Program
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help">
                  <a className="text-muted-foreground hover:text-foreground hover-elevate px-2 py-1 rounded-md inline-block" data-testid="link-help">
                    Help Center
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/shipping">
                  <a className="text-muted-foreground hover:text-foreground hover-elevate px-2 py-1 rounded-md inline-block" data-testid="link-shipping">
                    Shipping Info
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/returns">
                  <a className="text-muted-foreground hover:text-foreground hover-elevate px-2 py-1 rounded-md inline-block" data-testid="link-returns">
                    Returns & Refunds
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/terms">
                  <a className="text-muted-foreground hover:text-foreground hover-elevate px-2 py-1 rounded-md inline-block" data-testid="link-terms">
                    Terms & Conditions
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 text-primary" />
                <div>
                  <p className="text-muted-foreground">+91 1234567890</p>
                  <p className="text-xs text-muted-foreground">Mon-Sat, 9AM-6PM</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 text-primary" />
                <p className="text-muted-foreground">support@Sppeeds.com</p>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-primary" />
                <p className="text-muted-foreground">
                  Vais Engineering Pvt Ltd<br />
                  Bangalore, India
                </p>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 Sppeeds by Vais Engineering Pvt Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
