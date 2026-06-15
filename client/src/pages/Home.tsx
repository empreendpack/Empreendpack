import { trpc } from "@/lib/trpc";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  Zap,
  Shield,
  Download,
  Star,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { motion, useInView } from "framer-motion";
import type { Product } from "@shared/commerce/types";

function formatMoney(amount: string, currencyCode: string): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: currencyCode,
  }).format(parseFloat(amount));
}

// Reusable section reveal wrapper
function RevealSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.23, 1, 0.32, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const { addItem, loading } = useCart();
  const [adding, setAdding] = useState(false);
  const variant = product.variants[0];
  const image = product.images[0];
  const price = product.priceRange.min;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const handleAdd = async () => {
    if (!variant) return;
    setAdding(true);
    try { await addItem(variant.id, 1); } finally { setAdding(false); }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1], delay: index * 0.08 }}
      className="elegant-card rounded-2xl overflow-hidden flex flex-col group cursor-pointer"
    >
      <Link href={`/produto/${product.handle}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-[oklch(0.09_0.01_60)]">
          {image ? (
            <img
              src={image.url}
              alt={image.altText ?? product.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
              style={{ transformOrigin: "center" }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center"><span className="text-4xl">📦</span></div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.08_0.01_60/0.5)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[oklch(0.08_0.01_60/0.85)] backdrop-blur-sm border border-[oklch(0.78_0.12_75/0.4)] text-[oklch(0.78_0.12_75)] text-xs font-medium tracking-wide">
            Digital
          </div>
        </div>
      </Link>
      <div className="p-5 flex flex-col flex-1 gap-2.5">
        <Link href={`/produto/${product.handle}`}>
          <h3 className="text-base font-semibold text-foreground leading-snug hover:text-[oklch(0.78_0.12_75)] transition-colors duration-200" style={{ fontFamily: "'Playfair Display', serif" }}>
            {product.title}
          </h3>
        </Link>
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{product.description}</p>
        <div className="flex items-center gap-1 mt-auto pt-1">
          {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 fill-[oklch(0.78_0.12_75)] text-[oklch(0.78_0.12_75)]" />)}
          <span className="text-xs text-muted-foreground ml-1">5.0</span>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-[oklch(0.22_0.02_60)]">
          <span className="text-2xl font-bold text-[oklch(0.78_0.12_75)]" style={{ fontFamily: "'Playfair Display', serif" }}>
            {formatMoney(price.amount, price.currencyCode)}
          </span>
          <Button
            onClick={handleAdd}
            disabled={adding || loading}
            size="sm"
            className="bg-[oklch(0.78_0.12_75)] hover:bg-[oklch(0.85_0.1_78)] text-[oklch(0.08_0.01_60)] font-semibold rounded-xl px-5 transition-all duration-200 active:scale-95"
          >
            {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : "Comprar"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function FaqItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1], delay: index * 0.06 }}
      className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
        open
          ? "border-[oklch(0.78_0.12_75/0.4)] bg-[oklch(0.11_0.01_60)]"
          : "border-[oklch(0.22_0.02_60)] hover:border-[oklch(0.78_0.12_75/0.25)]"
      }`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left"
      >
        <span className="text-sm font-medium text-foreground pr-4">{question}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronDown className="w-4 h-4 text-[oklch(0.78_0.12_75)] flex-shrink-0" />
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        className="overflow-hidden"
      >
        <div className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-[oklch(0.22_0.02_60)] pt-4">
          {answer}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Home() {
  const { data: products, isLoading } = trpc.commerce.products.list.useQuery({ first: 10 });

  const faqs = [
    { question: "Como recebo meu produto após a compra?", answer: "A entrega é 100% digital e automática. Assim que o pagamento for confirmado, você receberá um e-mail com o link para download dos arquivos. Não há nenhuma espera ou intervenção manual." },
    { question: "Os produtos são em qual formato?", answer: "Todos os produtos são entregues em formato PDF de alta qualidade, compatível com qualquer dispositivo — computador, tablet ou celular. Alguns pacotes também incluem links para templates editáveis no Canva." },
    { question: "Posso usar os materiais no meu negócio?", answer: "Sim! Todos os materiais são para uso pessoal e profissional. Você pode usar os templates e guias no seu negócio à vontade. A revenda ou redistribuição dos arquivos originais não é permitida." },
    { question: "E se eu tiver dúvidas sobre o conteúdo?", answer: "Você pode entrar em contato pelo e-mail ou WhatsApp que estão no rodapé da página. Respondemos em até 24 horas úteis." },
    { question: "Os preços incluem impostos?", answer: "Sim, os preços exibidos são os valores finais que você pagará. Não há taxas ou cobranças adicionais." },
    { question: "Posso comprar mais de um pacote?", answer: "Claro! Você pode adicionar quantos pacotes quiser ao carrinho e finalizar tudo em uma única compra. Se quiser o melhor custo-benefício, o Mega Mix Combo já reúne todos os pacotes com desconto." },
  ];

  const testimonials = [
    {
      name: "Ana Beatriz S.",
      role: "Empreendedora Digital",
      initials: "AB",
      color: "oklch(0.55 0.18 30)",
      text: "O Starter Pack me ajudou a validar minha ideia antes de investir qualquer dinheiro. Valeu muito mais do que o preço!",
    },
    {
      name: "Carlos Eduardo M.",
      role: "Consultor Autônomo",
      initials: "CE",
      color: "oklch(0.5 0.15 200)",
      text: "O Kit de Produtividade mudou minha rotina. Agora consigo organizar minha semana em menos de 30 minutos.",
    },
    {
      name: "Fernanda Lima",
      role: "Dona de Pequeno Negócio",
      initials: "FL",
      color: "oklch(0.55 0.15 280)",
      text: "Comprei o Mega Mix Combo e foi a melhor decisão. Os templates de design são profissionais e fáceis de usar.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">

      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.08_0.01_60)] via-[oklch(0.1_0.02_70)] to-[oklch(0.08_0.01_60)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[oklch(0.78_0.12_75/0.06)] blur-3xl orb-pulse pointer-events-none" />
        <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-[oklch(0.65_0.1_200/0.03)] blur-3xl pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(oklch(0.78 0.12 75) 1px, transparent 1px), linear-gradient(90deg, oklch(0.78 0.12 75) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[oklch(0.78_0.12_75/0.3)] bg-[oklch(0.78_0.12_75/0.06)] mb-8"
          >
            <Sparkles className="w-3.5 h-3.5 text-[oklch(0.78_0.12_75)]" />
            <span className="text-xs text-[oklch(0.78_0.12_75)] font-medium tracking-wider uppercase">
              Ferramentas Digitais para Empreendedores
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1], delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.08] mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <span className="text-foreground">Tudo que você precisa</span>
            <br />
            <span className="gold-shimmer">para empreender.</span>
            <br />
            <span className="text-foreground">Por muito menos.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1], delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Pacotes de templates, guias e ferramentas práticas para você validar, organizar, vender e crescer — sem precisar gastar uma fortuna.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1], delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a href="#catalogo">
              <Button
                size="lg"
                className="h-14 px-8 bg-[oklch(0.78_0.12_75)] hover:bg-[oklch(0.85_0.1_78)] text-[oklch(0.08_0.01_60)] font-semibold text-base rounded-2xl shadow-lg shadow-[oklch(0.78_0.12_75/0.25)] transition-all duration-200 active:scale-[0.97]"
              >
                Ver Pacotes <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <a href="#faq">
              <Button
                variant="outline"
                size="lg"
                className="h-14 px-8 border-[oklch(0.28_0.02_60)] text-foreground hover:border-[oklch(0.78_0.12_75/0.5)] hover:bg-[oklch(0.13_0.01_60)] font-medium text-base rounded-2xl transition-all duration-200"
              >
                Saiba Mais
              </Button>
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1], delay: 0.45 }}
            className="flex flex-wrap items-center justify-center gap-10 mt-16"
          >
            {[
              { value: "5", label: "Pacotes Disponíveis" },
              { value: "R$ 22", label: "A partir de" },
              { value: "100%", label: "Digital" },
              { value: "Automático", label: "Entrega" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-[oklch(0.78_0.12_75)]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5 tracking-wide">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="w-5 h-5 text-muted-foreground/40" />
        </motion.div>
      </section>

      {/* ─── BENEFITS ─────────────────────────────────────────── */}
      <section className="py-20 border-t border-[oklch(0.22_0.02_60)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Download className="w-6 h-6 text-[oklch(0.78_0.12_75)]" />, title: "Entrega Imediata", desc: "Receba seus arquivos automaticamente por e-mail logo após a confirmação do pagamento." },
              { icon: <Shield className="w-6 h-6 text-[oklch(0.78_0.12_75)]" />, title: "Conteúdo de Qualidade", desc: "Materiais desenvolvidos com base em metodologias comprovadas e práticas de mercado." },
              { icon: <Zap className="w-6 h-6 text-[oklch(0.78_0.12_75)]" />, title: "Preço Acessível", desc: "Ferramentas profissionais por um valor que cabe no bolso de qualquer empreendedor." },
            ].map((b, i) => (
              <RevealSection key={b.title} delay={i * 0.1}>
                <div className="flex gap-4 p-6 rounded-2xl bg-[oklch(0.11_0.01_60)] border border-[oklch(0.22_0.02_60)] hover:border-[oklch(0.78_0.12_75/0.3)] transition-all duration-300 h-full gold-glow">
                  <div className="w-12 h-12 rounded-xl bg-[oklch(0.78_0.12_75/0.1)] flex items-center justify-center flex-shrink-0">
                    {b.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1.5" style={{ fontFamily: "'Playfair Display', serif" }}>{b.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CATALOG ──────────────────────────────────────────── */}
      <section id="catalogo" className="py-24 border-t border-[oklch(0.22_0.02_60)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <RevealSection className="text-center mb-16">
            <p className="text-[oklch(0.78_0.12_75)] text-sm font-medium tracking-widest uppercase mb-3">Nossos Pacotes</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Escolha sua ferramenta
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Cada pacote foi criado para resolver um desafio específico do empreendedor. Escolha o que mais faz sentido para o seu momento.
            </p>
          </RevealSection>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-[oklch(0.78_0.12_75)]" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products?.map((product: Product, i: number) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── WHAT'S INCLUDED ──────────────────────────────────── */}
      <section className="py-24 border-t border-[oklch(0.22_0.02_60)] bg-[oklch(0.09_0.01_60)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <RevealSection>
              <p className="text-[oklch(0.78_0.12_75)] text-sm font-medium tracking-widest uppercase mb-3">O que está incluído</p>
              <h2 className="text-4xl font-bold text-foreground mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                Mais do que você espera por esse preço
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Cada pacote foi cuidadosamente estruturado para entregar valor real. Não são apenas PDFs — são sistemas práticos que você pode aplicar imediatamente no seu negócio.
              </p>
              <ul className="space-y-3">
                {[
                  "Templates prontos para usar (sem precisar criar do zero)",
                  "Guias passo a passo com linguagem simples e direta",
                  "Bônus: materiais gratuitos de fontes confiáveis (Sebrae, EduCAPES)",
                  "Entrega digital automática — sem espera",
                  "Acesso vitalício aos arquivos baixados",
                  "Compatível com qualquer dispositivo",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[oklch(0.78_0.12_75)] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </RevealSection>

            <RevealSection delay={0.15}>
              <div className="relative">
                <div className="absolute inset-0 bg-[oklch(0.78_0.12_75/0.06)] rounded-3xl blur-2xl" />
                <div className="relative p-8 rounded-3xl bg-[oklch(0.11_0.01_60)] border border-[oklch(0.78_0.12_75/0.25)] gold-glow">
                  <div className="text-center mb-6">
                    <p className="text-[oklch(0.78_0.12_75)] text-xs font-medium tracking-widest uppercase mb-2">Melhor Custo-Benefício</p>
                    <h3 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Mega Mix Combo</h3>
                    <div className="flex items-end justify-center gap-2 mt-3">
                      <span className="text-4xl font-bold text-[oklch(0.78_0.12_75)]" style={{ fontFamily: "'Playfair Display', serif" }}>R$ 47</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">vs. R$ 102 comprando separado</p>
                  </div>
                  <ul className="space-y-2.5 mb-6">
                    {[
                      "✓ Starter Pack do Empreendedor",
                      "✓ Kit de Produtividade e Organização",
                      "✓ Guia de Marketing e Vendas",
                      "✓ Pack de Templates de Design",
                      "✓ Bônus: Biblioteca de Prompts de IA",
                      "✓ Fluxo de Trabalho Integrado",
                    ].map((item) => (
                      <li key={item} className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="text-[oklch(0.78_0.12_75)]">{item.slice(0, 1)}</span>
                        <span>{item.slice(2)}</span>
                      </li>
                    ))}
                  </ul>
                  <a href="#catalogo">
                    <Button className="w-full h-12 bg-[oklch(0.78_0.12_75)] hover:bg-[oklch(0.85_0.1_78)] text-[oklch(0.08_0.01_60)] font-semibold rounded-xl transition-all duration-200 active:scale-[0.97]">
                      Ver Mega Mix Combo
                    </Button>
                  </a>
                </div>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ─── BONUS BOOKS ──────────────────────────────────────── */}
      <section className="py-24 border-t border-[oklch(0.22_0.02_60)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <RevealSection className="text-center mb-12">
            <p className="text-[oklch(0.78_0.12_75)] text-sm font-medium tracking-widest uppercase mb-3">Bônus Exclusivo</p>
            <h2 className="text-4xl font-bold text-foreground mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Materiais Gratuitos Incluídos
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Cada pacote inclui links para materiais gratuitos e confiáveis de fontes como Sebrae e EduCAPES/MEC, curados especialmente para complementar o conteúdo.
            </p>
          </RevealSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { emoji: "🚀", title: "Starter Pack", bonus: "Plano de Negócios — Sebrae", url: "https://bibliotecas.sebrae.com.br/chronus/ARQUIVOS_CHRONUS/bds/bds.nsf/5f6dba19baaf17a98b4763d4327bfb6c/$File/2021.pdf" },
              { emoji: "⏰", title: "Kit Produtividade", bonus: "Gerenciamento do Tempo — EduCAPES/MEC", url: "https://educapes.capes.gov.br/bitstream/capes/599115/2/Cartilha%20Gerenciamento%20do%20tempo.pdf" },
              { emoji: "📣", title: "Guia Marketing", bonus: "Marketing Digital — Sebrae/PR", url: "https://sebraepr.com.br/ebooks/marketing-digital-gestao-de-midias/" },
              { emoji: "🎨", title: "Pack Templates", bonus: "Business Model Canvas — Sebrae", url: "https://bibliotecas.sebrae.com.br/chronus/ARQUIVOS_CHRONUS/bds/bds.nsf/e0d3bc581dc03903edd3f665709a7e20/$File/30601.pdf" },
            ].map((item, i) => (
              <RevealSection key={item.title} delay={i * 0.09}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-6 rounded-2xl bg-[oklch(0.11_0.01_60)] border border-[oklch(0.22_0.02_60)] hover:border-[oklch(0.78_0.12_75/0.4)] transition-all duration-300 block group gold-glow h-full"
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 inline-block">{item.emoji}</div>
                  <h4 className="font-semibold text-foreground mb-2 text-sm group-hover:text-[oklch(0.78_0.12_75)] transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {item.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.bonus}</p>
                  <p className="text-xs text-[oklch(0.78_0.12_75)] mt-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    Acessar material gratuito <ArrowRight className="w-3 h-3" />
                  </p>
                </a>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─────────────────────────────────────── */}
      <section className="py-24 border-t border-[oklch(0.22_0.02_60)] bg-[oklch(0.09_0.01_60)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <RevealSection className="text-center mb-12">
            <p className="text-[oklch(0.78_0.12_75)] text-sm font-medium tracking-widest uppercase mb-3">Prova Social</p>
            <h2 className="text-4xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
              O que dizem nossos clientes
            </h2>
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <RevealSection key={t.name} delay={i * 0.1}>
                <div className="testimonial-card p-6 rounded-2xl bg-[oklch(0.11_0.01_60)] border border-[oklch(0.22_0.02_60)] flex flex-col gap-4 h-full">
                  {/* Stars */}
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className="w-4 h-4 fill-[oklch(0.78_0.12_75)] text-[oklch(0.78_0.12_75)]" />
                    ))}
                  </div>
                  {/* Quote */}
                  <p className="text-sm text-muted-foreground leading-relaxed italic flex-1">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  {/* Author */}
                  <div className="flex items-center gap-3 pt-2 border-t border-[oklch(0.22_0.02_60)]">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, ${t.color}, oklch(0.78 0.12 75))` }}
                    >
                      {t.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ──────────────────────────────────────────────── */}
      <section id="faq" className="py-24 border-t border-[oklch(0.22_0.02_60)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <RevealSection className="text-center mb-12">
            <p className="text-[oklch(0.78_0.12_75)] text-sm font-medium tracking-widest uppercase mb-3">Dúvidas Frequentes</p>
            <h2 className="text-4xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
              Perguntas e Respostas
            </h2>
          </RevealSection>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FaqItem key={faq.question} question={faq.question} answer={faq.answer} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA FINAL ────────────────────────────────────────── */}
      <section className="py-24 border-t border-[oklch(0.22_0.02_60)] bg-[oklch(0.09_0.01_60)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <RevealSection>
            <div className="relative">
              <div className="absolute inset-0 bg-[oklch(0.78_0.12_75/0.06)] rounded-3xl blur-3xl" />
              <div className="relative p-12 rounded-3xl border border-[oklch(0.78_0.12_75/0.25)] bg-[oklch(0.1_0.01_60)] gold-glow">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[oklch(0.78_0.12_75/0.1)] border border-[oklch(0.78_0.12_75/0.2)] mb-6">
                  <Sparkles className="w-3.5 h-3.5 text-[oklch(0.78_0.12_75)]" />
                  <span className="text-xs text-[oklch(0.78_0.12_75)] font-medium">Acesso imediato após o pagamento</span>
                </div>
                <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Pronto para começar?
                </h2>
                <p className="text-muted-foreground mb-8 text-lg max-w-xl mx-auto">
                  Escolha seu pacote, pague com segurança e receba tudo no seu e-mail em minutos.
                </p>
                <a href="#catalogo">
                  <Button
                    size="lg"
                    className="h-14 px-10 bg-[oklch(0.78_0.12_75)] hover:bg-[oklch(0.85_0.1_78)] text-[oklch(0.08_0.01_60)] font-semibold text-base rounded-2xl shadow-lg shadow-[oklch(0.78_0.12_75/0.25)] transition-all duration-200 active:scale-[0.97]"
                  >
                    Ver Todos os Pacotes <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </a>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>
    </div>
  );
}
