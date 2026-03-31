import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { paymentClient } from '@/lib/mercadopago'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

const planNames: Record<string, string> = {
  monthly: 'Mensal',
  quarterly: 'Trimestral',
  yearly: 'Anual',
  premium: 'Premium',
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // MP sends different notification types
    if (body.type !== 'payment' && body.action !== 'payment.updated') {
      return NextResponse.json({ received: true })
    }

    const paymentId = body.data?.id
    if (!paymentId) {
      return NextResponse.json({ received: true })
    }

    // Fetch payment details from MP API
    const payment = await paymentClient.get({ id: paymentId })

    if (!payment || !payment.external_reference) {
      return NextResponse.json({ received: true })
    }

    const pendingUserId = payment.external_reference
    const status = payment.status // approved, pending, rejected, etc.

    // Find PendingUser
    const pendingUser = await prisma.pendingUser.findUnique({
      where: { id: pendingUserId },
    })

    if (!pendingUser) {
      console.error('PendingUser not found:', pendingUserId)
      return NextResponse.json({ received: true })
    }

    // Idempotency: if already PAID, skip
    if (pendingUser.status === 'PAID') {
      return NextResponse.json({ received: true })
    }

    if (status === 'approved') {
      // Check if user already exists (double safety)
      const existingUser = await prisma.user.findUnique({
        where: { email: pendingUser.email },
      })

      if (!existingUser) {
        // Calculate subscription end based on plan
        const now = new Date()
        const subscriptionEnd = new Date(now)
        switch (pendingUser.plan) {
          case 'monthly':
            subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1)
            break
          case 'quarterly':
            subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 3)
            break
          case 'yearly':
          case 'premium':
            subscriptionEnd.setFullYear(subscriptionEnd.getFullYear() + 1)
            break
        }

        // Create User from PendingUser
        const newUser = await prisma.user.create({
          data: {
            email: pendingUser.email,
            passwordHash: pendingUser.passwordHash,
            name: pendingUser.name,
            phone: pendingUser.phone,
            subscriptionStatus: 'ACTIVE',
            subscriptionPlan: pendingUser.plan,
            subscriptionEnd,
            mpPaymentId: String(paymentId),
            couponUsed: pendingUser.couponCode,
            amountPaid: pendingUser.finalPrice,
            acceptedTerms: pendingUser.acceptedTerms,
            acceptedTermsAt: pendingUser.acceptedTermsAt,
          },
        })

        // Assign selected clubs from checkout
        if (pendingUser.selectedClubs) {
          const clubSlugs = pendingUser.selectedClubs.split(',').filter(Boolean)
          if (clubSlugs.length > 0) {
            const clubRecords = await prisma.club.findMany({
              where: { slug: { in: clubSlugs } },
              select: { id: true },
            })
            await prisma.clubMember.createMany({
              data: clubRecords.map(c => ({ userId: newUser.id, clubId: c.id })),
              skipDuplicates: true,
            })
          }
        }

        // Increment coupon usage if applicable
        if (pendingUser.couponCode) {
          await prisma.coupon.updateMany({
            where: { code: pendingUser.couponCode },
            data: { currentUses: { increment: 1 } },
          })
        }

        // Send confirmation email
        try {
          const { Resend } = await import('resend')
          const resend = new Resend(process.env.RESEND_API_KEY)
          await resend.emails.send({
            from: process.env.EMAIL_FROM || 'Le Cercle <noreply@idiomascommardia.com>',
            to: pendingUser.email,
            subject: 'Seu acesso ao Le Cercle está liberado!',
            html: getConfirmationEmailHtml(pendingUser.name, pendingUser.plan, pendingUser.email),
          })
        } catch (emailError) {
          console.error('Email send error:', emailError)
        }
      }

      // Mark PendingUser as PAID
      await prisma.pendingUser.update({
        where: { id: pendingUser.id },
        data: {
          status: 'PAID',
          mpPaymentId: String(paymentId),
        },
      })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ received: true })
  }
}

function getConfirmationEmailHtml(name: string, plan: string, email: string): string {
  const firstName = name.split(' ')[0]
  const planName = planNames[plan] || plan

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#F2F2F2;font-family:'Montserrat',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F2F2F2;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;">
        <!-- Header -->
        <tr><td style="padding:32px 32px 16px;text-align:center;">
          <h1 style="margin:0;font-size:24px;font-weight:700;color:#303342;">Le Cercle</h1>
          <p style="margin:4px 0 0;font-size:10px;letter-spacing:3px;color:#FF9FAF;text-transform:uppercase;">Idiomas com Mardia</p>
        </td></tr>
        <!-- Content -->
        <tr><td style="padding:16px 32px 32px;">
          <h2 style="margin:0 0 16px;font-size:20px;color:#303342;">Olá, ${firstName}!</h2>
          <p style="margin:0 0 8px;font-size:14px;line-height:1.6;color:#666;">
            Seu pagamento do plano <strong>${planName}</strong> foi confirmado com sucesso.
          </p>
          <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#666;">
            Sua plataforma já está liberada! Acesse agora e comece sua jornada no francês.
          </p>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center">
              <a href="${APP_URL}/login" style="display:inline-block;padding:14px 40px;background-color:#FC8E60;color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;border-radius:12px;">
                Acessar o Le Cercle
              </a>
            </td></tr>
          </table>
          <p style="margin:24px 0 0;font-size:13px;line-height:1.5;color:#999;">
            Use seu email <strong>${email}</strong> e a senha que você criou no cadastro.
          </p>
        </td></tr>
        <!-- Footer -->
        <tr><td style="padding:20px 32px;background-color:#F2F2F2;text-align:center;">
          <p style="margin:0;font-size:12px;color:#999;">
            Dúvidas? <a href="https://instagram.com/idiomascommardia" style="color:#FC8E60;text-decoration:none;">@idiomascommardia</a> no Instagram
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}
