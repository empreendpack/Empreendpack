# Loja Empreendedor - TODO

## Setup e Configuração
- [x] Inicializar projeto web-db-user
- [x] Configurar integração Shopify
- [x] Registrar commerceRouter em server/routers.ts
- [x] Criar 5 produtos no Shopify via MCP com preços, descrições e imagens
- [x] Verificar catálogo com pnpm shopify:probe

## Design Global
- [x] Configurar tema elegante: paleta dourada/escura, tipografia premium (Playfair Display + Inter)
- [x] Atualizar client/src/index.css com variáveis CSS e estilos globais
- [x] Atualizar client/index.html com fontes Google Fonts
- [x] Criar componentes base: Navbar, Footer, CartDrawer

## Página Inicial (Home)
- [x] Hero Section: proposta de valor com CTA
- [x] Seção "Por que escolher a loja" (benefícios)
- [x] Catálogo de produtos (grid dos 5 pacotes)
- [x] Seção de bônus materiais gratuitos
- [x] Seção FAQ
- [x] Rodapé com contato e links
- [x] CTA final

## Páginas de Produto
- [x] Rota /produto/:handle para página de detalhe
- [x] Descrição completa, conteúdo incluído, preço
- [x] Botão "Adicionar ao Carrinho" integrado com Shopify
- [x] Seção de bônus (livros gratuitos relacionados)
- [x] Trust badges (entrega digital, pagamento seguro, acesso imediato)

## Carrinho e Checkout
- [x] CartDrawer lateral com itens, quantidades e total
- [x] Botão "Finalizar Compra" → Shopify Checkout
- [x] Indicador de itens no carrinho na Navbar

## Conteúdo dos Pacotes (bônus livros gratuitos)
- [x] Starter Pack: links para materiais Sebrae sobre plano de negócios
- [x] Kit Produtividade: links para materiais EduCAPES sobre gestão
- [x] Guia Marketing: links para materiais Sebrae sobre marketing digital
- [x] Pack Templates: links para recursos Canva e design gratuitos
- [x] Mega Mix: todos os bônus anteriores + biblioteca de prompts IA

## Testes e Qualidade
- [x] Rodar pnpm test (vitest) — 7 passed, 1 skipped
- [x] Verificar TypeScript — sem erros
- [x] Testar integração Shopify (smoke test)
- [x] Checkpoint final para publicação
