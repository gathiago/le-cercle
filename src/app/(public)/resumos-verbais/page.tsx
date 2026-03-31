'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Check, BookOpen, Star, Clock, FileText, VideoCamera, ShieldCheck, Quotes } from '@phosphor-icons/react'

const spring = { type: 'spring' as const, stiffness: 100, damping: 20 }

const PURCHASE_LINK = '/produto/resumos-verbais'

const temposVerbais = [
  'Presente do indicativo',
  'Passé composé',
  'Imparfait',
  'Passé composé X Imparfait',
  'Futur proche',
  'Futur simple',
  'Conditionnel présent',
  'Subjonctif présent',
]

const feedbacks = [
  { text: 'Sério, primeiro que ela tá tipo linda e eu FINALMENTE peguei a diferença entre o imparfait e o passé composé. Aquela unidade dedicada somente pra isso foi essencial e os milhões de exercícios.', time: '16:37' },
  { text: 'Sério, a parte do condicional, tudo pra mim.', time: '17:37' },
  { text: 'Amiga, lembra de como a gente PENOU pra aprender subjuntivo quando a gente tava no curso sério KKKKK. Queria que tivesse uma coisa assim na época.', time: '18:02' },
]

const faqs = [
  { q: 'Esse material é para quem está começando do zero?', a: 'Sim. A apostila foi pensada para quem está começando ou recomeçando no francês. Tudo é explicado do zero, com exemplos simples e sem linguagem técnica desnecessária. Entretanto, caso você não seja iniciante absoluto e queira um material complementar de estudos, ela também vai te ajudar.' },
  { q: 'Esse material substitui um curso de francês?', a: 'Não. Ele não substitui um curso ou um acompanhamento com professora, mas funciona como um guia de apoio para organizar os estudos, revisar conteúdos e ganhar autonomia.' },
  { q: 'Por quanto tempo tenho acesso à apostila?', a: 'Para sempre! O acesso é vitalício.' },
  { q: 'Você explica todos os tempos verbais do francês?', a: 'Não — e isso é intencional. A apostila foca nos tempos verbais mais usados no dia a dia, para evitar sobrecarga e tornar o aprendizado mais leve.' },
  { q: 'Recebo a apostila impressa?', a: 'Não. Você receberá um e-book, mas pode imprimir a apostila se quiser.' },
]

export default function ResumosVerbaisPage() {
  return (
    <div className="min-h-[100dvh] bg-[var(--color-surface)]">
      {/* ===== HERO — Assimétrico, editorial ===== */}
      <section className="pt-8 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-[var(--color-rosa-light)]/50 to-transparent pointer-events-none" />

        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-16 items-center relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.1 }}
          >
            <div className="inline-flex items-center gap-2 bg-[var(--color-rosa)]/[0.08] text-[var(--color-rosa)] text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
              <BookOpen className="h-3.5 w-3.5" weight="bold" />
              Material digital
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-[var(--color-azul-escuro)] tracking-tighter leading-[1.05] mb-4">
              Resumos
              <br />
              <span className="text-[var(--color-rosa)]">Verbais</span>
            </h1>

            <p className="text-lg text-[var(--color-azul-escuro)]/45 leading-relaxed max-w-[48ch] mb-4">
              Os principais tempos verbais do francês num só lugar!
            </p>

            <p className="text-sm text-[var(--color-azul-escuro)]/30 mb-8">
              Por <strong className="text-[var(--color-azul-escuro)]/60">Mardia Brito de Souza Alcantara</strong>
            </p>

            <a
              href={PURCHASE_LINK}
              className="group inline-flex items-center h-14 px-10 rounded-xl bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-laranja)] text-white font-semibold text-base transition-all active:scale-[0.98] shadow-[0_12px_32px_rgba(252,142,96,0.25)]"
              style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}
            >
              Quero garantir o meu
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-0.5 transition-transform" weight="bold" />
            </a>
          </motion.div>

          {/* Visual card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...spring, delay: 0.3 }}
            className="hidden lg:block relative"
          >
            <div className="bg-[var(--color-surface-lowest)] rounded-[2rem] p-8 shadow-[0_24px_64px_-16px_rgba(48,51,66,0.06)] relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-rosa)] flex items-center justify-center">
                  <FileText className="h-5 w-5 text-white" weight="bold" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[var(--color-azul-escuro)]">Resumos Verbais</p>
                  <p className="text-xs text-[var(--color-azul-escuro)]/35">E-book + Vídeo aulas</p>
                </div>
              </div>
              <div className="space-y-2.5">
                {temposVerbais.slice(0, 5).map((t, i) => (
                  <motion.div
                    key={t}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...spring, delay: 0.5 + i * 0.08 }}
                    className="flex items-center gap-3 py-2.5 px-4 bg-[var(--color-surface-low)] rounded-xl"
                  >
                    <Check className="h-4 w-4 text-[var(--color-rosa)] shrink-0" weight="bold" />
                    <span className="text-sm text-[var(--color-azul-escuro)]">{t}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="absolute top-5 -right-3 w-full h-full bg-[var(--color-rosa-light)]/40 rounded-[2rem] -z-10 rotate-2" />
          </motion.div>
        </div>
      </section>

      {/* ===== PRA QUEM É ===== */}
      <section className="py-20 px-6 bg-[var(--color-surface-low)]">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-16 items-start">
          <div>
            <p className="text-[var(--color-rosa)] text-xs font-semibold tracking-[3px] uppercase mb-5">Pra quem é</p>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-azul-escuro)] tracking-tight leading-tight mb-6">
              Essa apostila é pra você que:
            </h2>
            <ul className="space-y-4">
              {[
                'Fica perdido na hora de estudar os verbos em francês',
                'Nunca sabe quando usar cada tempo verbal',
                'Quer ter uma base gramatical sólida',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-[var(--color-rosa)]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="h-3.5 w-3.5 text-[var(--color-rosa)]" weight="bold" />
                  </div>
                  <span className="text-[var(--color-azul-escuro)]/70">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[var(--color-surface-lowest)] rounded-[2rem] p-8 shadow-[0_8px_32px_rgba(48,51,66,0.04)]">
            <p className="text-[var(--color-rosa)] text-xs font-semibold tracking-[3px] uppercase mb-4">Por que focar nos verbos?</p>
            <div className="space-y-4 text-[var(--color-azul-escuro)]/60 text-sm leading-relaxed">
              <p>Porque é o verbo que faz a língua andar. Você pode conhecer mil palavras em francês, mas sem os verbos, elas não se conectam. É o verbo que indica ação, tempo, intenção e desejo.</p>
              <p>Focar nos verbos não é reduzir o idioma, é ir direto ao essencial. Em vez de se perder em listas intermináveis de regras, você aprende a reconhecer padrões, entender a lógica por trás das conjugações e usar o francês de forma prática.</p>
              <p>Esta apostila foi pensada para quem quer entender antes de decorar, ganhar autonomia e sentir que o francês começa a fazer sentido de verdade — desde as primeiras frases.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== DETALHES DO PRODUTO ===== */}
      <section className="py-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          <p className="text-[var(--color-rosa)] text-xs font-semibold tracking-[3px] uppercase mb-5">O que você recebe</p>
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-azul-escuro)] tracking-tight leading-tight mb-8">
            Detalhes do produto
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-6 mb-10">
            {/* Tempos verbais */}
            <div className="bg-[var(--color-surface-lowest)] rounded-[2rem] p-8 shadow-[0_8px_32px_rgba(48,51,66,0.04)]">
              <p className="text-sm font-bold text-[var(--color-azul-escuro)] mb-5">Explicações, exercícios e correções sobre:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {temposVerbais.map((t) => (
                  <div key={t} className="flex items-center gap-2.5 py-2 px-3 bg-[var(--color-surface-low)] rounded-xl">
                    <Check className="h-4 w-4 text-[var(--color-rosa)] shrink-0" weight="bold" />
                    <span className="text-sm text-[var(--color-azul-escuro)]/70">{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Extras */}
            <div className="space-y-4">
              <div className="bg-[var(--color-surface-lowest)] rounded-[1.5rem] p-6 shadow-[0_8px_32px_rgba(48,51,66,0.04)]">
                <div className="flex items-center gap-3 mb-2">
                  <VideoCamera className="h-5 w-5 text-[var(--color-laranja)]" weight="bold" />
                  <p className="font-bold text-[var(--color-azul-escuro)]">3 vídeo aulas curtas</p>
                </div>
                <p className="text-sm text-[var(--color-azul-escuro)]/40">Para complementar seu aprendizado com explicações visuais.</p>
              </div>
              <div className="bg-[var(--color-surface-lowest)] rounded-[1.5rem] p-6 shadow-[0_8px_32px_rgba(48,51,66,0.04)]">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="h-5 w-5 text-emerald-500" weight="bold" />
                  <p className="font-bold text-[var(--color-azul-escuro)]">Acesso vitalício</p>
                </div>
                <p className="text-sm text-[var(--color-azul-escuro)]/40">Comprou, é seu para sempre. Sem mensalidade.</p>
              </div>
              <div className="bg-[var(--color-surface-lowest)] rounded-[1.5rem] p-6 shadow-[0_8px_32px_rgba(48,51,66,0.04)]">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="h-5 w-5 text-[var(--color-primary)]" weight="bold" />
                  <p className="font-bold text-[var(--color-azul-escuro)]">E-book em PDF</p>
                </div>
                <p className="text-sm text-[var(--color-azul-escuro)]/40">Pode imprimir ou estudar direto no celular/tablet.</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <a
              href={PURCHASE_LINK}
              className="group inline-flex items-center h-14 px-10 rounded-xl bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-laranja)] text-white font-semibold text-base transition-all active:scale-[0.98] shadow-[0_12px_32px_rgba(252,142,96,0.25)]"
              style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}
            >
              Quero garantir o meu
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-0.5 transition-transform" weight="bold" />
            </a>
          </div>
        </div>
      </section>

      {/* ===== QUEM SOU EU ===== */}
      <section className="py-20 px-6 bg-[var(--color-rosa-light)]/40">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-[300px_1fr] gap-16 items-center">
          <div className="flex justify-center md:justify-start">
            <div className="w-60 h-60 md:w-72 md:h-72 rounded-[2rem] bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-rosa)] flex items-center justify-center text-white text-7xl font-bold shadow-[0_32px_64px_-16px_rgba(147,70,85,0.35)]">
              M
            </div>
          </div>
          <div>
            <p className="text-[var(--color-rosa)] text-xs font-semibold tracking-[3px] uppercase mb-5">Quem sou eu?</p>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-azul-escuro)] tracking-tight leading-tight mb-5">
              Mardia Alcantara
            </h2>
            <p className="text-[var(--color-azul-escuro)]/50 leading-relaxed max-w-[55ch]">
              Curiosa por natureza, me tornei poliglota devido ao incentivo da minha vó. Aprender idiomas mudou a minha vida, me proporcionou meu primeiro emprego como professora de inglês e francês e também me levou até a França num intercâmbio acadêmico, mesmo vindo de uma família humilde de Nilópolis. Graduada em Química, estudante de Medicina e pós-graduada em Metodologia do Ensino de Francês como Língua Estrangeira. Estudo Francês desde os 13 aninhos e tenho 7 anos de sala de aula.
            </p>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-[var(--color-rosa)] text-xs font-semibold tracking-[3px] uppercase mb-4">FAQ</p>
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-azul-escuro)] tracking-tight mb-10">
            Perguntas frequentes
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="group bg-[var(--color-surface-lowest)] rounded-2xl overflow-hidden shadow-[0_4px_16px_rgba(48,51,66,0.03)]">
                <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-[var(--color-azul-escuro)] hover:bg-[var(--color-rosa-light)]/20 transition-colors">
                  {faq.q}
                  <span className="text-[var(--color-rosa)] text-xl group-open:rotate-45 transition-transform ml-4 shrink-0">+</span>
                </summary>
                <p className="px-5 pb-5 text-[var(--color-azul-escuro)]/50 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEEDBACKS ===== */}
      <section className="py-20 px-6 bg-[var(--color-surface-low)]">
        <div className="max-w-[1200px] mx-auto">
          <p className="text-[var(--color-rosa)] text-xs font-semibold tracking-[3px] uppercase mb-4">Feedbacks</p>
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-azul-escuro)] tracking-tight mb-3">
            Quem já testou, aprova!
          </h2>
          <p className="text-[var(--color-azul-escuro)]/35 mb-10">Olha só:</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {feedbacks.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...spring, delay: i * 0.1 }}
                className="bg-[var(--color-surface-lowest)] rounded-[1.5rem] p-6 shadow-[0_8px_32px_rgba(48,51,66,0.04)]"
              >
                <Quotes className="h-6 w-6 text-[var(--color-rosa)]/20 mb-3" weight="fill" />
                <p className="text-sm text-[var(--color-azul-escuro)]/60 leading-relaxed mb-4">&ldquo;{f.text}&rdquo;</p>
                <p className="text-[10px] text-[var(--color-azul-escuro)]/25">{f.time}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="py-20 px-6 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-rosa)] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/[0.06] rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight mb-5">
            Garanta o seu!
          </h2>
          <p className="text-white/60 text-lg mb-10 max-w-[40ch] mx-auto leading-relaxed">
            Os principais tempos verbais do francês, exercícios e vídeo aulas num só lugar.
          </p>
          <a
            href={PURCHASE_LINK}
            className="group inline-flex items-center h-14 px-10 rounded-xl bg-white text-[var(--color-azul-escuro)] font-bold text-base hover:bg-white/90 transition-colors active:scale-[0.98] shadow-[0_12px_32px_rgba(0,0,0,0.1)]"
          >
            Comprar agora
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-0.5 transition-transform" weight="bold" />
          </a>
        </div>
      </section>
    </div>
  )
}
