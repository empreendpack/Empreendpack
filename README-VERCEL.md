# Deploy no Vercel — EmpreendePack

## Variáveis de Ambiente Necessárias

Configure estas variáveis em **Vercel → Settings → Environment Variables**:

| Variável | Valor |
|---|---|
| `SHOPIFY_STORE_DOMAIN` | `66ovsy-opal-quartz-nebula.myshopify.com` |
| `SHOPIFY_STOREFRONT_API_ACCESS_TOKEN` | `c2e44b5d1f139f77230c56a8e03ea6e7` |
| `JWT_SECRET` | `4cNLcgTzDDkNprrq4gL8id` |
| `NODE_ENV` | `production` |

## Passo a Passo

1. Importe o repositório GitHub no Vercel
2. Configure as variáveis acima em Settings > Environment Variables
3. Deploy automático ao fazer push no GitHub
4. Conecte o domínio `conectahosting.com.br` em Settings > Domains

## Configurações de Build

- **Build Command:** `pnpm run build`
- **Output Directory:** `dist/public`
- **Install Command:** `pnpm install`
- **Node.js Version:** 22.x
