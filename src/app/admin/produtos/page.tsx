import { prisma } from '@/lib/prisma'
import { AdminProductsManager } from '@/components/admin/products-manager'

export default async function AdminProdutosPage() {
  const products = await prisma.digitalProduct.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { purchases: true } } },
  })

  const formatted = products.map((p) => ({
    ...p,
    purchaseCount: p._count.purchases,
  }))

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--color-azul-escuro)] mb-6">Produtos Digitais</h1>
      <AdminProductsManager initialProducts={JSON.parse(JSON.stringify(formatted))} />
    </div>
  )
}
