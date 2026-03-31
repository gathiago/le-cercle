import { prisma } from '@/lib/prisma'
import { NewsletterManager } from '@/components/admin/newsletter-manager'

export default async function AdminNewsletterPage() {
  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--color-azul-escuro)] mb-6">Newsletter</h1>
      <NewsletterManager initialSubscribers={JSON.parse(JSON.stringify(subscribers))} />
    </div>
  )
}
