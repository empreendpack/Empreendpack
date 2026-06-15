import { Mail, Instagram, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer id="contato" className="border-t border-[oklch(0.22_0.02_60)] bg-[oklch(0.07_0.01_60)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[oklch(0.78_0.12_75)] flex items-center justify-center">
                <span className="text-[oklch(0.08_0.01_60)] font-bold text-sm font-serif">E</span>
              </div>
              <span className="text-lg font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
                <span className="text-gold-gradient">Empreende</span>
                <span className="text-foreground/80">Pack</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Ferramentas digitais de qualidade para empreendedores que querem crescer sem gastar muito.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground tracking-wider uppercase">
              Navegação
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Início", href: "/" },
                { label: "Nossos Pacotes", href: "/#catalogo" },
                { label: "Perguntas Frequentes", href: "/#faq" },
                { label: "Contato", href: "/#contato" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-[oklch(0.78_0.12_75)] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground tracking-wider uppercase">
              Contato
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:empreendpack@gmail.com"
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-[oklch(0.78_0.12_75)] transition-colors"
                >
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  empreendpack@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/empreendpack"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-[oklch(0.78_0.12_75)] transition-colors"
                >
                  <Instagram className="w-4 h-4 flex-shrink-0" />
                  @empreendpack
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/5521970096813"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-[oklch(0.78_0.12_75)] transition-colors"
                >
                  <MessageCircle className="w-4 h-4 flex-shrink-0" />
                  (21) 97009-6813
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-[oklch(0.22_0.02_60)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} EmpreendePack. Todos os direitos reservados.
          </p>
          <p className="text-xs text-muted-foreground">
            Produtos digitais — entrega automática após o pagamento
          </p>
        </div>
      </div>
    </footer>
  );
}
