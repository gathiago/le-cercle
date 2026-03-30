import { CreditCard, ExternalLink, Globe } from 'lucide-react'

export default function AdminConfiguracoesPage() {
  const envVars = [
    { label: 'Mensal', price: process.env.NEXT_PUBLIC_PRICE_MONTHLY },
    { label: 'Trimestral (total)', price: process.env.NEXT_PUBLIC_PRICE_QUARTERLY },
    { label: 'Trimestral (/mês)', price: process.env.NEXT_PUBLIC_PRICE_QUARTERLY_MONTHLY },
    { label: 'Anual (total)', price: process.env.NEXT_PUBLIC_PRICE_YEARLY },
    { label: 'Anual (/mês)', price: process.env.NEXT_PUBLIC_PRICE_YEARLY_MONTHLY },
    { label: 'Premium (total)', price: process.env.NEXT_PUBLIC_PRICE_PREMIUM },
    { label: 'Premium (/mês)', price: process.env.NEXT_PUBLIC_PRICE_PREMIUM_MONTHLY },
  ]

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-[var(--color-azul-escuro)] mb-6">Configurações</h1>

      <div className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(48,51,66,0.06)] mb-6">
        <h3 className="font-semibold text-[var(--color-azul-escuro)] mb-4">Preços Atuais</h3>
        <div className="space-y-3">
          {envVars.map((v) => (
            <div key={v.label} className="flex justify-between py-2">
              <span className="text-sm text-muted-foreground">{v.label}</span>
              <span className="text-sm font-medium text-[var(--color-azul-escuro)]">R$ {v.price}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[var(--color-rosa-light)] rounded-2xl p-6">
        <h3 className="font-semibold text-[var(--color-azul-escuro)] mb-2">Como alterar preços</h3>
        <p className="text-sm text-[var(--color-azul-escuro)]">
          Os preços são definidos via variáveis de ambiente. Para alterar, acesse o painel da Vercel → Settings → Environment Variables e atualize os valores NEXT_PUBLIC_PRICE_*. Após salvar, faça um redeploy.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(48,51,66,0.06)] mt-6">
        <h3 className="font-semibold text-[var(--color-azul-escuro)] mb-4">Links Úteis</h3>
        <div className="space-y-3">
          <a href="https://www.mercadopago.com.br/activities" target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-surface-low)] hover:bg-[var(--color-surface)] transition-colors">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-[var(--color-laranja)]" />
              <div>
                <p className="text-sm font-medium text-[var(--color-azul-escuro)]">Mercado Pago</p>
                <p className="text-xs text-muted-foreground">Gerenciar pagamentos e vendas</p>
              </div>
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </a>
          <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-surface-low)] hover:bg-[var(--color-surface)] transition-colors">
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-[var(--color-laranja)]" />
              <div>
                <p className="text-sm font-medium text-[var(--color-azul-escuro)]">Vercel Dashboard</p>
                <p className="text-xs text-muted-foreground">Deploy e variáveis de ambiente</p>
              </div>
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </a>
        </div>
      </div>
    </div>
  )
}
