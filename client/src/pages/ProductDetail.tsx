import { trpc } from "@/lib/trpc";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, Download, Shield, Zap, Loader2, Star } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "wouter";
import type { Product } from "@shared/commerce/types";

function formatMoney(amount: string, currencyCode: string): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: currencyCode,
  }).format(parseFloat(amount));
}

const BONUS_LINKS: Record<string, { label: string; url: string }[]> = {
  "starter-pack-do-empreendedor": [
    { label: "Como elaborar um Plano de Negócios — Sebrae (PDF)", url: "https://bibliotecas.sebrae.com.br/chronus/ARQUIVOS_CHRONUS/bds/bds.nsf/5f6dba19baaf17a98b4763d4327bfb6c/$File/2021.pdf" },
    { label: "Desenvolvimento do Modelo de Negócios — Sebrae (PDF)", url: "https://bibliotecas.sebrae.com.br/chronus/ARQUIVOS_CHRONUS/bds/bds.nsf/e0d3bc581dc03903edd3f665709a7e20/$File/30601.pdf" },
  ],
  "kit-de-produtividade-e-organizacao": [
    { label: "Cartilha Gerenciamento do Tempo — EduCAPES/MEC (PDF)", url: "https://educapes.capes.gov.br/bitstream/capes/599115/2/Cartilha%20Gerenciamento%20do%20tempo.pdf" },
    { label: "Curso Gestão do Tempo e Produtividade — Escola Virtual Gov", url: "https://www.escolavirtual.gov.br/curso/468" },
  ],
  "guia-de-marketing-e-vendas": [
    { label: "Marketing Digital: Gestão de Mídias — Sebrae/PR", url: "https://sebraepr.com.br/ebooks/marketing-digital-gestao-de-midias/" },
    { label: "E-books Gratuitos para Empreendedores — Sebrae/PR", url: "https://sebraepr.com.br/ebooks/" },
  ],
  "pack-de-templates-de-design": [
    { label: "Desenvolvimento do Modelo de Negócios — Sebrae (PDF)", url: "https://bibliotecas.sebrae.com.br/chronus/ARQUIVOS_CHRONUS/bds/bds.nsf/e0d3bc581dc03903edd3f665709a7e20/$File/30601.pdf" },
    { label: "E-books de Gestão — Sebrae Rio", url: "https://sebraerj.com.br/conteudos-gratuitos/columns" },
  ],
  "mega-mix-combo": [
    { label: "Como elaborar um Plano de Negócios — Sebrae (PDF)", url: "https://bibliotecas.sebrae.com.br/chronus/ARQUIVOS_CHRONUS/bds/bds.nsf/5f6dba19baaf17a98b4763d4327bfb6c/$File/2021.pdf" },
    { label: "Cartilha Gerenciamento do Tempo — EduCAPES/MEC (PDF)", url: "https://educapes.capes.gov.br/bitstream/capes/599115/2/Cartilha%20Gerenciamento%20do%20tempo.pdf" },
    { label: "Marketing Digital: Gestão de Mídias — Sebrae/PR", url: "https://sebraepr.com.br/ebooks/marketing-digital-gestao-de-midias/" },
    { label: "E-books Gratuitos para Empreendedores — Sebrae/PR", url: "https://sebraepr.com.br/ebooks/" },
  ],
};

const PACKAGE_DETAILS: Record<string, { items: string[]; bonus: string; emoji: string }> = {
  "starter-pack-do-empreendedor": {
    emoji: "🚀",
    items: [
      "Guia passo a passo para validar sua ideia de negócio",
      "Template da Matriz de Validação Rápida (planilha)",
      "Modelo completo do Business Model Canvas com instruções",
      "Template de Controle de Custos Iniciais",
      "Plano de Ação de 30 dias para a primeira venda",
    ],
    bonus: "Links para materiais gratuitos do Sebrae sobre plano de negócios e Business Model Canvas",
  },
  "kit-de-produtividade-e-organizacao": {
    emoji: "⏰",
    items: [
      "Guia da Matriz de Eisenhower para priorizar tarefas",
      "Template de Planejamento Semanal com os 4 quadrantes",
      "Guia da técnica Pomodoro Estendido para foco profundo",
      "Modelo de Estrutura do Dia Ideal (Time Blocking)",
      "Checklist de Auditoria de Ferramentas do negócio",
    ],
    bonus: "Links para e-books gratuitos EduCAPES/MEC sobre gestão do tempo e organização empresarial",
  },
  "guia-de-marketing-e-vendas": {
    emoji: "📣",
    items: [
      "Template para criar sua Persona (Cliente Ideal)",
      "Guia do Funil de Vendas Simplificado (3 etapas práticas)",
      "Estratégia de Conteúdo para 30 dias",
      "Roteiro de Vendas pelo WhatsApp (5 mensagens prontas)",
      "Checklist 'Antes de Publicar' para garantir qualidade",
    ],
    bonus: "Links para guias gratuitos do Sebrae sobre marketing digital, vendas e jornada do consumidor",
  },
  "pack-de-templates-de-design": {
    emoji: "🎨",
    items: [
      "Guia de Identidade Visual para Pequenos Negócios",
      "Estruturas prontas de 3 tipos de posts (educativo, depoimento, venda)",
      "Checklist de Consistência Visual da Marca",
      "Links para templates gratuitos no Canva prontos para editar",
      "Guia de Paletas de Cores e Tipografia para Negócios",
    ],
    bonus: "Links para templates gratuitos no Canva e guias de identidade visual para pequenos negócios",
  },
  "mega-mix-combo": {
    emoji: "💎",
    items: [
      "Tudo do Starter Pack do Empreendedor",
      "Tudo do Kit de Produtividade e Organização",
      "Tudo do Guia de Marketing e Vendas",
      "Tudo do Pack de Templates de Design",
      "BÔNUS: Biblioteca de Prompts de IA para negócios",
      "BÔNUS: Fluxo de Trabalho Integrado (semana a semana)",
    ],
    bonus: "Todos os materiais gratuitos dos 4 pacotes anteriores + Guia de uso integrado de IA nos negócios",
  },
};

export default function ProductDetail() {
  const params = useParams<{ handle: string }>();
  const handle = params.handle ?? "";
  const { data: product, isLoading } = trpc.commerce.products.byHandle.useQuery({ handle });
  const { addItem, loading } = useCart();
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    if (!product?.variants[0]) return;
    setAdding(true);
    try {
      await addItem(product.variants[0].id, 1);
    } finally {
      setAdding(false);
    }
  };

  const details = PACKAGE_DETAILS[handle] ?? { emoji: "📦", items: [], bonus: "" };
  const bonusLinks = BONUS_LINKS[handle] ?? [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[oklch(0.78_0.12_75)]" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Produto não encontrado.</p>
        <Link href="/">
          <Button variant="outline">Voltar à loja</Button>
        </Link>
      </div>
    );
  }

  const price = product.priceRange.min;
  const image = product.images[0];

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Back */}
        <Link href="/#catalogo">
          <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-[oklch(0.78_0.12_75)] transition-colors mb-10">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao catálogo
          </button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image */}
          <div className="space-y-6">
            <div className="aspect-square rounded-3xl overflow-hidden bg-[oklch(0.11_0.01_60)] border border-[oklch(0.22_0.02_60)]">
              {image ? (
                <img src={image.url} alt={image.altText ?? product.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-8xl">{details.emoji}</span>
                </div>
              )}
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: <Download className="w-4 h-4" />, label: "Entrega Digital" },
                { icon: <Shield className="w-4 h-4" />, label: "Pagamento Seguro" },
                { icon: <Zap className="w-4 h-4" />, label: "Acesso Imediato" },
              ].map((b) => (
                <div key={b.label} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-[oklch(0.11_0.01_60)] border border-[oklch(0.22_0.02_60)] text-center">
                  <span className="text-[oklch(0.78_0.12_75)]">{b.icon}</span>
                  <span className="text-xs text-muted-foreground">{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[oklch(0.78_0.12_75/0.3)] bg-[oklch(0.78_0.12_75/0.05)]">
              <span className="text-xs text-[oklch(0.78_0.12_75)] font-medium">Produto Digital</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-foreground leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              {product.title}
            </h1>

            {/* Stars */}
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-[oklch(0.78_0.12_75)] text-[oklch(0.78_0.12_75)]" />)}
              <span className="text-sm text-muted-foreground ml-2">5.0 — Produto Digital</span>
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            {/* Price + CTA */}
            <div className="p-6 rounded-2xl bg-[oklch(0.11_0.01_60)] border border-[oklch(0.78_0.12_75/0.2)] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Preço</span>
                <span className="text-3xl font-bold text-[oklch(0.78_0.12_75)]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {formatMoney(price.amount, price.currencyCode)}
                </span>
              </div>
              <Button
                onClick={handleAdd}
                disabled={adding || loading}
                className="w-full h-14 bg-[oklch(0.78_0.12_75)] hover:bg-[oklch(0.85_0.1_78)] text-[oklch(0.08_0.01_60)] font-semibold text-base rounded-xl shadow-lg shadow-[oklch(0.78_0.12_75/0.2)] transition-all duration-200"
              >
                {adding ? <Loader2 className="w-5 h-5 animate-spin" /> : "Adicionar ao Carrinho"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Entrega digital automática após o pagamento
              </p>
            </div>

            {/* What's included */}
            {details.items.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
                  O que está incluído
                </h3>
                <ul className="space-y-2">
                  {details.items.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-[oklch(0.78_0.12_75)] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Bonus Links */}
            {bonusLinks.length > 0 && (
              <div className="p-4 rounded-xl bg-[oklch(0.78_0.12_75/0.05)] border border-[oklch(0.78_0.12_75/0.2)] space-y-3">
                <p className="text-xs text-[oklch(0.78_0.12_75)] font-medium uppercase tracking-wider">Bônus: Materiais Gratuitos Incluídos</p>
                <ul className="space-y-2">
                  {bonusLinks.map(link => (
                    <li key={link.url}>
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-[oklch(0.78_0.12_75)] transition-colors group">
                        <Download className="w-3.5 h-3.5 flex-shrink-0 text-[oklch(0.78_0.12_75)]" />
                        <span className="group-hover:underline">{link.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
