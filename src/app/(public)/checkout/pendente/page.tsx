import { Clock } from 'lucide-react'
import Link from 'next/link'

export default function PendentePage() {
  return (
    <div className="max-w-md mx-auto px-4 text-center">
      <div className="bg-white rounded-2xl p-10 shadow-[0_4px_24px_rgba(48,51,66,0.06)]">
        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
          <Clock className="h-8 w-8 text-amber-500" />
        </div>
        <h1 className="text-2xl font-bold text-[var(--color-azul-escuro)] mb-3">
          Pagamento sendo processado
        </h1>
        <p className="text-muted-foreground mb-8">
          Quando seu pagamento for confirmado, você receberá um e-mail com o acesso à plataforma.
        </p>
        <Link
          href="/checkout"
          className="text-sm text-[var(--color-laranja)] font-medium hover:underline"
        >
          Voltar ao início
        </Link>
      </div>
    </div>
  )
}
