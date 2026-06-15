import { useCart } from "@/contexts/CartContext";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { AnimatePresence, motion } from "framer-motion";

export default function Navbar() {
  const { itemCount, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Início", href: "/" },
    { label: "Pacotes", href: "/#catalogo" },
    { label: "FAQ", href: "/#faq" },
    { label: "Contato", href: "/#contato" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        scrolled
          ? "bg-[oklch(0.08_0.01_60/0.96)] backdrop-blur-xl border-b border-[oklch(0.22_0.02_60)] shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-[oklch(0.78_0.12_75)] flex items-center justify-center shadow-md shadow-[oklch(0.78_0.12_75/0.3)] group-hover:shadow-[oklch(0.78_0.12_75/0.5)] transition-shadow duration-300">
              <span className="text-[oklch(0.08_0.01_60)] font-bold text-sm font-serif">E</span>
            </div>
            <span className="text-lg font-semibold tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
              <span className="text-gold-gradient">Empreende</span>
              <span className="text-foreground/80">Pack</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative text-sm text-muted-foreground hover:text-[oklch(0.78_0.12_75)] transition-colors duration-200 tracking-wide group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[oklch(0.78_0.12_75)] group-hover:w-full transition-all duration-300 ease-out" />
              </a>
            ))}
          </nav>

          {/* Cart + Mobile toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => openCart()}
              className="relative p-2.5 rounded-xl hover:bg-[oklch(0.15_0.01_60)] transition-all duration-200 active:scale-95"
              aria-label="Abrir carrinho"
            >
              <ShoppingBag className="w-5 h-5 text-foreground" />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[oklch(0.78_0.12_75)] text-[oklch(0.08_0.01_60)] text-xs font-bold flex items-center justify-center"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Mobile toggle */}
            <button
              className="md:hidden p-2.5 rounded-xl hover:bg-[oklch(0.15_0.01_60)] transition-all duration-200 active:scale-95"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <X className="w-5 h-5" />
                  </motion.span>
                ) : (
                  <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Menu className="w-5 h-5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              className="md:hidden overflow-hidden border-t border-[oklch(0.22_0.02_60)]"
            >
              <div className="py-3 space-y-1">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.2 }}
                    className="flex items-center px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-[oklch(0.78_0.12_75)] hover:bg-[oklch(0.13_0.01_60)] transition-all duration-200"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
