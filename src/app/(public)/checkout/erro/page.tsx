import { XCircle } from 'lucide-react'
import Link from 'next/link'

export default function ErroPage() {
  return (
    <div className="max-w-md mx-auto px-4 text-center">
      <div className="bg-white rounded-2xl p-10 shadow-[0_4px_24px_rgba(48,51,66,0.06)]">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
          <XCircle className="h-8 w-8 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-[var(--color-azul-escuro)] mb-3">
          Problema no pagamento
        </h1>
        <p className="text-muted-foreground mb-8">
          Houve um problema ao processar seu pagamento. Por favor, tente novamente.
        </p>
        <Link
          href="/checkout"
          className="inline-flex items-center justify-center h-14 px-10 rounded-2xl bg-gradient-to-r from-[var(--color-laranja)] to-[#ff9062] hover:opacity-90 text-white font-semibold text-lg shadow-[0_8px_32px_rgba(252,142,96,0.3)]"
        >
          Tentar de novo
        </Link>
      </div>
    </div>
  )
}
