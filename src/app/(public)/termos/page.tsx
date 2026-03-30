export default function TermosPage() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-azul-escuro)]">Le Cercle</h1>
          <p className="text-xs text-[var(--color-rosa)] tracking-widest uppercase mt-1">Idiomas com Mardia</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-[0_4px_24px_rgba(48,51,66,0.06)]">
          <h2 className="text-2xl font-bold text-[var(--color-azul-escuro)] mb-6">Termos de Uso</h2>

          <div className="prose prose-sm max-w-none text-[var(--color-azul-escuro)]/80 space-y-4">
            <p><strong>Última atualização:</strong> Março de 2026</p>

            <h3 className="text-lg font-semibold text-[var(--color-azul-escuro)]">1. Aceitação dos Termos</h3>
            <p>Ao acessar e utilizar a plataforma Le Cercle (&quot;Plataforma&quot;), operada por Idiomas com Mardia, você concorda com estes Termos de Uso. Caso não concorde, não utilize a Plataforma.</p>

            <h3 className="text-lg font-semibold text-[var(--color-azul-escuro)]">2. Descrição do Serviço</h3>
            <p>Le Cercle é uma plataforma de imersão em francês que oferece conteúdo semanal, encontros ao vivo, comunidade exclusiva e eventos presenciais, conforme o plano contratado.</p>

            <h3 className="text-lg font-semibold text-[var(--color-azul-escuro)]">3. Cadastro e Conta</h3>
            <p>O usuário deve fornecer informações verdadeiras no cadastro. A conta é pessoal e intransferível. O compartilhamento de credenciais pode resultar em suspensão.</p>

            <h3 className="text-lg font-semibold text-[var(--color-azul-escuro)]">4. Planos e Pagamento</h3>
            <p>Os planos e preços estão disponíveis na página de assinatura. O pagamento é processado via Mercado Pago. O acesso é liberado após confirmação do pagamento.</p>

            <h3 className="text-lg font-semibold text-[var(--color-azul-escuro)]">5. Cancelamento</h3>
            <p>O usuário pode solicitar cancelamento a qualquer momento entrando em contato conosco. Não há reembolso proporcional após o início do período contratado.</p>

            <h3 className="text-lg font-semibold text-[var(--color-azul-escuro)]">6. Conduta na Comunidade</h3>
            <p>O usuário se compromete a manter uma conduta respeitosa na comunidade. Conteúdos ofensivos, discriminatórios ou spam resultarão em remoção e possível suspensão da conta.</p>

            <h3 className="text-lg font-semibold text-[var(--color-azul-escuro)]">7. Propriedade Intelectual</h3>
            <p>Todo o conteúdo da Plataforma (textos, vídeos, áudios, materiais) é protegido por direitos autorais. É proibida a reprodução, distribuição ou compartilhamento sem autorização.</p>

            <h3 className="text-lg font-semibold text-[var(--color-azul-escuro)]">8. Contato</h3>
            <p>Para dúvidas sobre estes termos, entre em contato pelo Instagram <a href="https://instagram.com/idiomascommardia" target="_blank" rel="noopener noreferrer" className="text-[var(--color-laranja)]">@idiomascommardia</a>.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
