import Link from 'next/link'
import { LandingHero } from '@/components/landing/hero'
import { LandingFeatures } from '@/components/landing/features'
import { LandingTestimonials } from '@/components/landing/testimonials'
import { LandingProducts } from '@/components/landing/products'
import { LandingPricing } from '@/components/landing/pricing'
import { LandingFaq } from '@/components/landing/faq'
import { LandingCta } from '@/components/landing/cta'

export default function LandingPage() {
  return (
    <div className="min-h-[100dvh] bg-[var(--color-surface)] antialiased">
      {/* ===== NAV — Glass Rule: 80% opacity + backdrop-blur ===== */}
      <nav className="fixed top-0 w-full bg-[var(--color-surface)]/80 backdrop-blur-[20px] z-40">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-baseline gap-2.5">
            <span className="text-lg font-bold text-[var(--color-azul-escuro)] tracking-tight">Le Cercle</span>
            <span className="text-[9px] text-[var(--color-rosa)] font-semibold tracking-[2.5px] uppercase">Mardia</span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/login" className="text-sm font-medium text-[var(--color-azul-escuro)]/50 hover:text-[var(--color-azul-escuro)] transition-colors hidden sm:block">
              Entrar
            </Link>
            <Link href="/checkout" className="bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-laranja)] text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all active:scale-[0.98] shadow-[0_8px_24px_rgba(252,142,96,0.2)]" style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}>
              Fazer parte
            </Link>
          </div>
        </div>
      </nav>

      <LandingHero />

      {/* ===== PROBLEMA — Tonal shift to azul-escuro ===== */}
      <section className="py-28 px-6 bg-[var(--color-azul-escuro)] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'url(/Estampa-Formas.png)', backgroundSize: '400px', backgroundRepeat: 'repeat' }} />
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-20 items-center relative">
          <div>
            <p className="text-[var(--color-rosa)] text-xs font-semibold tracking-[3px] uppercase mb-6">O problema</p>
            <h2 className="text-3xl md:text-[2.75rem] font-bold text-white tracking-tight leading-[1.1] mb-6">
              Você estuda francês mas
              na hora de falar,{' '}
              <span className="text-white/30">trava.</span>
            </h2>
            <p className="text-white/40 leading-relaxed max-w-[50ch]">
              A maioria dos cursos foca em gramática isolada. No Le Cercle, você pratica desde o primeiro dia &mdash; com pessoas reais, conteúdo cultural e a orientação da Mardia.
            </p>
          </div>
          <div className="space-y-4">
            {[
              { before: 'Medo de falar', after: 'Confiança pra conversar' },
              { before: 'Gramática no papel', after: 'Prática com cultura real' },
              { before: 'Estudar sozinha', after: 'Comunidade que apoia' },
            ].map((item) => (
              <div key={item.before} className="bg-white/[0.04] rounded-2xl p-5 flex items-center gap-5" style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)' }}>
                <div className="w-11 h-11 rounded-xl bg-[var(--color-rosa)]/10 flex items-center justify-center shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-rosa)]" />
                </div>
                <div>
                  <p className="text-white/25 text-sm line-through mb-0.5">{item.before}</p>
                  <p className="text-white font-semibold">{item.after}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LandingFeatures />

      {/* ===== SOBRE A MARDIA — surface shift to rosa-light ===== */}
      <section className="py-28 px-6 bg-[var(--color-rosa-light)]/40 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: 'url(/Estampa-Logo.png)', backgroundSize: '220px', backgroundRepeat: 'repeat' }} />
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-[320px_1fr] gap-20 items-center">
          <div className="flex justify-center md:justify-start">
            <div className="relative">
              <div className="w-60 h-60 md:w-72 md:h-72 rounded-[2rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(147,70,85,0.35)]">
                <img src="/mardia-2.png" alt="Mardia Alcantara" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-[var(--color-surface-lowest)] rounded-2xl px-5 py-3 shadow-[0_8px_24px_rgba(48,51,66,0.06)]">
                <p className="text-[10px] text-[var(--color-azul-escuro)]/40 uppercase tracking-[2px] font-semibold">Mentora</p>
                <p className="text-sm font-bold text-[var(--color-azul-escuro)]">Mardia Alcantara</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-[var(--color-rosa)] text-xs font-semibold tracking-[3px] uppercase mb-5">Quem te guia</p>
            <h2 className="text-3xl md:text-[2.75rem] font-bold text-[var(--color-azul-escuro)] tracking-tight leading-[1.1] mb-5">
              Professora, criadora e apaixonada pela cultura francesa.
            </h2>
            <p className="text-[var(--color-azul-escuro)]/50 leading-relaxed max-w-[50ch] mb-7">
              Com anos de experiência ensinando de forma prática e acolhedora, Mardia criou o Le Cercle para quem quer mais do que decorar regras &mdash; quer viver o francês.
            </p>
            <div className="flex flex-wrap gap-3">
              {['Imersão cultural', 'Método acolhedor', 'Prática real', 'Grupos pequenos'].map((tag) => (
                <span key={tag} className="text-xs font-medium text-[var(--color-azul-escuro)]/60 bg-[var(--color-surface-lowest)] rounded-full px-4 py-1.5 shadow-[0_2px_8px_rgba(48,51,66,0.04)]">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <LandingTestimonials />
      <LandingProducts />
      <LandingPricing />
      <LandingFaq />
      <LandingCta />

      {/* ===== FOOTER ===== */}
      <footer className="py-14 px-6 bg-[var(--color-azul-escuro)]">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-white font-bold tracking-tight text-lg">Le Cercle</p>
            <p className="text-white/20 text-xs tracking-[2px] uppercase">Idiomas com Mardia</p>
          </div>
          <div className="flex items-center gap-6 text-sm text-white/30">
            <Link href="/termos" className="hover:text-white/70 transition-colors">Termos</Link>
            <Link href="/privacidade" className="hover:text-white/70 transition-colors">Privacidade</Link>
            <a href="https://instagram.com/idiomascommardia" target="_blank" rel="noopener noreferrer" className="hover:text-white/70 transition-colors">Instagram</a>
          </div>
          <p className="text-white/15 text-xs">&copy; 2026 Le Cercle</p>
        </div>
      </footer>
    </div>
  )
}
