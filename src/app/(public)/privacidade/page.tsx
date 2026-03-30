export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-azul-escuro)]">Le Cercle</h1>
          <p className="text-xs text-[var(--color-rosa)] tracking-widest uppercase mt-1">Idiomas com Mardia</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-[0_4px_24px_rgba(48,51,66,0.06)]">
          <h2 className="text-2xl font-bold text-[var(--color-azul-escuro)] mb-6">Política de Privacidade</h2>

          <div className="prose prose-sm max-w-none text-[var(--color-azul-escuro)]/80 space-y-4">
            <p><strong>Última atualização:</strong> Março de 2026</p>

            <h3 className="text-lg font-semibold text-[var(--color-azul-escuro)]">1. Dados Coletados</h3>
            <p>Coletamos os seguintes dados pessoais: nome completo, endereço de e-mail, telefone (opcional), dados de pagamento (processados pelo Mercado Pago), respostas do questionário de nível, e conteúdo publicado na comunidade.</p>

            <h3 className="text-lg font-semibold text-[var(--color-azul-escuro)]">2. Finalidade do Tratamento</h3>
            <p>Seus dados são utilizados para: gerenciar sua conta e acesso à plataforma, processar pagamentos, personalizar sua experiência de aprendizado, enviar comunicações sobre o serviço, e melhorar nossos serviços.</p>

            <h3 className="text-lg font-semibold text-[var(--color-azul-escuro)]">3. Compartilhamento de Dados</h3>
            <p>Seus dados podem ser compartilhados com: Mercado Pago (processamento de pagamentos), Resend (envio de e-mails transacionais), e Vercel (hospedagem). Não vendemos dados pessoais a terceiros.</p>

            <h3 className="text-lg font-semibold text-[var(--color-azul-escuro)]">4. Armazenamento e Segurança</h3>
            <p>Seus dados são armazenados em banco de dados seguro com criptografia. Senhas são protegidas com hash bcrypt. Utilizamos HTTPS em todas as comunicações.</p>

            <h3 className="text-lg font-semibold text-[var(--color-azul-escuro)]">5. Seus Direitos (LGPD)</h3>
            <p>Conforme a Lei Geral de Proteção de Dados (Lei 13.709/2018), você tem direito a: acessar seus dados, corrigir dados incompletos ou incorretos, solicitar a exclusão de seus dados, revogar consentimento, e solicitar portabilidade dos dados.</p>

            <h3 className="text-lg font-semibold text-[var(--color-azul-escuro)]">6. Cookies</h3>
            <p>Utilizamos cookies essenciais para funcionamento da plataforma (autenticação e sessão). Não utilizamos cookies de rastreamento de terceiros.</p>

            <h3 className="text-lg font-semibold text-[var(--color-azul-escuro)]">7. Retenção de Dados</h3>
            <p>Seus dados são mantidos enquanto sua conta estiver ativa. Após cancelamento, os dados são mantidos por até 6 meses para fins legais, sendo deletados em seguida.</p>

            <h3 className="text-lg font-semibold text-[var(--color-azul-escuro)]">8. Contato do Encarregado</h3>
            <p>Para exercer seus direitos ou esclarecer dúvidas sobre privacidade, entre em contato pelo Instagram <a href="https://instagram.com/idiomascommardia" target="_blank" rel="noopener noreferrer" className="text-[var(--color-laranja)]">@idiomascommardia</a>.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
