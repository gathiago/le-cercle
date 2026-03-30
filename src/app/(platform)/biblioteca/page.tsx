import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { BibliotecaGrid } from '@/components/biblioteca/biblioteca-grid'

export default async function BibliotecaPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const weeks = await prisma.weekContent.findMany({
    orderBy: { weekNumber: 'desc' },
  })

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-azul-escuro)]">Biblioteca</h1>
        <p className="text-muted-foreground mt-1">Todos os conteúdos semanais disponíveis.</p>
      </div>
      <BibliotecaGrid weeks={JSON.parse(JSON.stringify(weeks))} />
    </div>
  )
}
