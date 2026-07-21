import React from "react";

// --- Demo Data (replace with your API data later) ---
const products = [
  {
    id: 1,
    title: "Classic Cotton Tee",
    price: 799,
    compareAt: 999,
    rating: 4.5,
    reviews: 124,
    image:
      "https://m.media-amazon.com/images/I/717bKGVxltL._AC_UY1100_.jpg",
    badge: "Bestseller",
  },
  {
    id: 2,
    title: "Minimal Sneakers",
    price: 2999,
    compareAt: 3499,
    rating: 4.2,
    reviews: 310,
    image:
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1200&auto=format&fit=crop",
    badge: "-15%",
  },
  {
    id: 3,
    title: "Everyday Backpack",
    price: 1599,
    compareAt: 1999,
    rating: 4.8,
    reviews: 58,
    image:
      "https://www.nurepublic.co/cdn/shop/files/1_4bdcdc48-4ab4-43c8-8451-f3bf93f4c387.jpg?v=1746516165&width=2000",
    badge: "New",
  },
  {
    id: 4,
    title: "Wireless Headphones",
    price: 4499,
    compareAt: 4999,
    rating: 4.6,
    reviews: 212,
    image:
      "https://sony.scene7.com/is/image/sonyglobalsolutions/wh-ch720_Primary_image?$categorypdpnav$&fmt=png-alpha",
    badge: "Hot",
  },
  {
    id: 5,
    title: "Linen Shirt",
    price: 1299,
    compareAt: 1499,
    rating: 4.1,
    reviews: 90,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSHEQjO89EWqEV3ahPijI3vdyPLoVfO1QK6p2vYRay6gx39OpWrHlq_6JgjvZhBf7qW2E&usqp=CAU",
    badge: null,
  },
  {
    id: 6,
    title: "Analog Watch",
    price: 2199,
    compareAt: 2799,
    rating: 4.3,
    reviews: 74,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzD130dA_rPd9EFSx1kXRYgmFyOrkgOyEU6w&s",
    badge: "Limited",
  },
  {
    id: 7,
    title: "Leather Wallet",
    price: 999,
    compareAt: 1299,
    rating: 4.0,
    reviews: 41,
    image:
      "https://leatherhub.in/cdn/shop/products/7427384131.jpg?v=1670485047",
    badge: null,
  },
  {
    id: 8,
    title: "Sports Bottle",
    price: 499,
    compareAt: 699,
    rating: 4.4,
    reviews: 19,
    image:
      "https://nwscdn.com/media/catalog/product/cache/h400xw400/f/o/forzasportswaterbottle-main.jpg",
    badge: "Eco",
  },
];

// --- Small helpers ---
const Star = ({ filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    className={`h-4 w-4 ${filled ? "" : "opacity-50"}`}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M11.48 3.499a.562.562 0 011.04 0l2.063 4.183a.563.563 0 00.424.308l4.62.671c.513.074.718.705.346 1.066l-3.342 3.257a.563.563 0 00-.162.498l.789 4.602a.563.563 0 01-.817.593l-4.132-2.173a.563.563 0 00-.524 0l-4.132 2.173a.563.563 0 01-.817-.593l.79-4.602a.563.563 0 00-.162-.498L3.03 9.727a.563.563 0 01.346-1.066l4.62-.671a.563.563 0 00.424-.308l2.063-4.183z"
    />
  </svg>
);

const Rating = ({ value }) => {
  const full = Math.floor(value);
  const half = value % 1 >= 0.5; // visual only
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} filled={i < full || (i === full && half)} />
      ))}
      <span className="ml-1 text-xs text-muted-foreground">{value.toFixed(1)}</span>
    </div>
  );
};

const Badge = ({ children }) => (
  <span className="absolute left-2 top-2 rounded-full bg-black/80 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-white">
    {children}
  </span>
);

const ProductCard = ({ product }) => (
  <div className="group relative overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md">
    <div className="relative aspect-[4/3] w-full overflow-hidden">
      {product.badge && <Badge>{product.badge}</Badge>}
      <img
        src={product.image}
        alt={product.title}
        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        loading="lazy"
      />
      <button
        className="absolute bottom-2 right-2 rounded-xl bg-white/90 px-3 py-2 text-xs font-medium shadow backdrop-blur transition hover:bg-white"
        aria-label="Add to cart"
      >
        Add to Cart
      </button>
    </div>
    <div className="space-y-1 p-4">
      <h3 className="line-clamp-1 text-sm font-semibold text-gray-900">{product.title}</h3>
      <Rating value={product.rating} />
      <div className="flex items-baseline gap-2">
        <span className="text-lg font-bold">₹{product.price.toLocaleString("en-IN")}</span>
        {product.compareAt && (
          <span className="text-sm text-gray-500 line-through">₹{product.compareAt.toLocaleString("en-IN")}</span>
        )}
      </div>
      <p className="text-xs text-gray-500">{product.reviews} reviews</p>
    </div>
  </div>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-green-100 text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-gradient-to-r from-blue-100 via-pink-100 to-green-100 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:py-4">
          {/* Left: Logo + Nav */}
          <div className="flex items-center gap-6">
            <a href="#" className="flex items-center gap-2 font-extrabold tracking-tight">
              {/* Logo */}
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-black text-white">D</span>
              <span className="text-lg md:text-xl">DKM</span>
            </a>
            <nav className="hidden gap-5 text-sm text-gray-600 md:flex">
              <a href="#" className="transition hover:text-black">New</a>
              <a href="#" className="transition hover:text-black">Men</a>
              <a href="#" className="transition hover:text-black">Women</a>
              <a href="#" className="transition hover:text-black">Accessories</a>
              <a href="#" className="transition hover:text-black">Sale</a>
            </nav>
          </div>

          {/* Middle: Search */}
          <div className="hidden flex-1 items-center md:flex">
            <label className="relative block w-full max-w-lg">
              <span className="absolute inset-y-0 left-3 grid place-items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5 opacity-60">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" />
                </svg>
              </span>
              <input
                type="search"
                placeholder="Search for products"
                className="w-full rounded-xl border bg-white py-2.5 pl-10 pr-4 text-sm outline-none ring-0 placeholder:text-gray-500 focus:border-black"
              />
            </label>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            <button className="rounded-xl border px-3 py-2 text-sm transition hover:border-black">Sign in</button>
            <button className="relative rounded-xl border px-3 py-2 transition hover:border-black" aria-label="Cart">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437m0 0L6.75 14.25a1.125 1.125 0 001.088.835h8.65a1.125 1.125 0 001.088-.835l1.2-5.4a1.125 1.125 0 00-1.088-1.365H7.653m-1.847-2.213h13.089M7.5 20.25a.75.75 0 100-1.5.75.75 0 000 1.5zm9.75 0a.75.75 0 100-1.5.75.75 0 000 1.5z" />
              </svg>
              <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-black text-[10px] font-semibold text-white">2</span>
            </button>
            <button className="md:hidden rounded-xl border p-2" aria-label="Open menu">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 py-10 md:grid-cols-2 md:py-16">
        <div className="space-y-4">
          <span className="inline-block rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wide text-gray-700">New Season</span>
          <h1 className="text-3xl font-extrabold leading-tight md:text-5xl">
            Elevate your everyday style
          </h1>
          <p className="max-w-prose text-gray-600">
            Discover quality essentials crafted for comfort. Free shipping over ₹999 & easy returns.
          </p>
          <div className="flex gap-3 pt-2">
            <a href="#products" className="rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white shadow transition hover:opacity-90">Shop now</a>
            <a href="#categories" className="rounded-2xl border px-5 py-3 text-sm font-semibold transition hover:border-black">Browse categories</a>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-[4/3] overflow-hidden rounded-3xl border shadow-sm">
            <img
            //   src="https://www.pngfind.com/pngs/m/620-6205611_banner-image-objectives-of-e-commerce-hd-png.png"
              src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgwDdU458gJhuHrqpm6mVJxpzumG0P7PgpDvHAGAKAHyghcjb504_s6Dg2cZJFaDiSOlCMomTRRbPI_CqtEVPG-KOrFsA3xJ6ADqByGNiFG20yWRjr7ptV9h0NbeetcPIRJaDlUKWKFwU0/s1280/Product+Banner+Design.webp"
              alt="Hero banner"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="mx-auto max-w-7xl px-4 pb-2">
        <h2 className="mb-4 text-lg font-bold md:text-xl">Shop by category</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {["Men", "Women", "Accessories", "Gadgets"].map((c, i) => (
            <a
              key={c}
              href="#"
              className="group relative overflow-hidden rounded-2xl border bg-white"
            >
              <img
                src={
                  [
                    "https://theformalclub.in/cdn/shop/files/NEW-COLLECTION-BANNER-23_2.jpg?v=1721304243&width=3600",
                    "https://images.biba.in/on/demandware.static/-/Library-Sites-BibaSharedLibrary/default/dwca12645b/images/blog-image/Indian-Traditional-Suits-for-Women-Everything-You-Need-To-Know.jpg",
                    "https://7esl.com/wp-content/uploads/2017/12/Accessories-Vocabulary-1.jpg",
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJ-cIS72FfITgdX6ROcMQHlObYcXdZfakTEw&s",
                  ][i]
                }
                alt={c}
                className="h-40 w-full object-cover transition duration-300 group-hover:scale-105 md:h-48"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <span className="absolute bottom-3 left-3 rounded-xl bg-white/90 px-3 py-1 text-xs font-semibold backdrop-blur">
                {c}
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Toolbar */}
      <section className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex flex-col items-start justify-between gap-3 rounded-2xl border bg-white p-3 shadow-sm md:flex-row md:items-center">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="rounded-lg border px-2 py-1">Free Shipping</span>
            <span className="rounded-lg border px-2 py-1">7‑day Returns</span>
            <span className="rounded-lg border px-2 py-1">Secure Checkout</span>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Sort by</label>
            <select className="rounded-xl border bg-white px-3 py-2 text-sm outline-none">
              <option>Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Top Rated</option>
              <option>New Arrivals</option>
            </select>
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="mx-auto max-w-7xl px-4 pb-12">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-lg font-bold md:text-xl">Trending products</h2>
          <a href="#" className="text-sm font-medium text-gray-600 hover:text-black">View all</a>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="mx-auto max-w-7xl px-4 pb-12">
        <div className="grid gap-4 overflow-hidden rounded-3xl border bg-white p-6 shadow-sm md:grid-cols-2 md:p-10">
          <div>
            <h3 className="text-xl font-extrabold md:text-2xl">Get 10% off your first order</h3>
            <p className="mt-1 text-gray-600">Join our newsletter for exclusive deals and updates.</p>
          </div>
          <form className="flex w-full items-center gap-2">
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="h-11 w-full flex-1 rounded-2xl border px-4 text-sm outline-none focus:border-black"
            />
            <button className="h-11 rounded-2xl bg-black px-5 text-sm font-semibold text-white transition hover:opacity-90">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/60">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 text-sm text-gray-600 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <div className="mb-3 flex items-center gap-2 font-extrabold">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-black text-white">D</span>
              <span>DKM</span>
            </div>
            <p className="max-w-xs">Quality essentials for your everyday life. Designed to last and priced right.</p>
          </div>
          <div>
            <h4 className="mb-2 font-semibold text-gray-900">Shop</h4>
            <ul className="space-y-1">
              <li><a href="#" className="hover:text-black">New Arrivals</a></li>
              <li><a href="#" className="hover:text-black">Best Sellers</a></li>
              <li><a href="#" className="hover:text-black">Gift Cards</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-2 font-semibold text-gray-900">Support</h4>
            <ul className="space-y-1">
              <li><a href="#" className="hover:text-black">Help Center</a></li>
              <li><a href="#" className="hover:text-black">Shipping</a></li>
              <li><a href="#" className="hover:text-black">Returns</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-2 font-semibold text-gray-900">Company</h4>
            <ul className="space-y-1">
              <li><a href="#" className="hover:text-black">About</a></li>
              <li><a href="#" className="hover:text-black">Careers</a></li>
              <li><a href="#" className="hover:text-black">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-gray-500 md:flex-row">
            <p>© {new Date().getFullYear()} DKM. All rights reserved.</p>
            <div className="flex items-center gap-3">
              <a href="#" className="hover:text-black">Privacy</a>
              <span>•</span>
              <a href="#" className="hover:text-black">Terms</a>
              <span>•</span>
              <a href="#" className="hover:text-black">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
