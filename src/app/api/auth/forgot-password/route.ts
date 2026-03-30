import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'
import crypto from 'crypto'

const resend = new Resend(process.env.RESEND_API_KEY)
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ message: 'Se o email existir, enviaremos um link.' })
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (user) {
      // Delete any existing tokens for this email
      await prisma.passwordResetToken.deleteMany({ where: { email } })

      // Generate token
      const token = crypto.randomBytes(32).toString('hex')
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

      await prisma.passwordResetToken.create({
        data: { email, token, expiresAt },
      })

      const resetUrl = `${APP_URL}/forgot-password?token=${token}`

      try {
        await resend.emails.send({
          from: process.env.EMAIL_FROM || 'Le Cercle <noreply@idiomascommardia.com>',
          to: email,
          subject: 'Redefinir sua senha - Le Cercle',
          html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#F2F2F2;font-family:'Montserrat',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F2F2F2;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;">
        <tr><td style="padding:32px 32px 16px;text-align:center;">
          <h1 style="margin:0;font-size:24px;font-weight:700;color:#303342;">Le Cercle</h1>
          <p style="margin:4px 0 0;font-size:10px;letter-spacing:3px;color:#FF9FAF;text-transform:uppercase;">Idiomas com Mardia</p>
        </td></tr>
        <tr><td style="padding:16px 32px 32px;">
          <h2 style="margin:0 0 16px;font-size:20px;color:#303342;">Redefinir senha</h2>
          <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#666;">
            Você solicitou a redefinição da sua senha. Clique no botão abaixo para criar uma nova senha. Este link expira em 1 hora.
          </p>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center">
              <a href="${resetUrl}" style="display:inline-block;padding:14px 40px;background-color:#FC8E60;color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;border-radius:12px;">
                Redefinir minha senha
              </a>
            </td></tr>
          </table>
          <p style="margin:24px 0 0;font-size:12px;color:#999;">
            Se você não solicitou isso, ignore este email.
          </p>
        </td></tr>
        <tr><td style="padding:20px 32px;background-color:#F2F2F2;text-align:center;">
          <p style="margin:0;font-size:12px;color:#999;">
            <a href="https://instagram.com/idiomascommardia" style="color:#FC8E60;text-decoration:none;">@idiomascommardia</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
        })
      } catch (emailError) {
        console.error('Email error:', emailError)
      }
    }

    // Always return success to not leak email existence
    return NextResponse.json({
      message: 'Se o email existir, enviaremos um link.',
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ message: 'Se o email existir, enviaremos um link.' })
  }
}

// Reset password with token
export async function PUT(request: Request) {
  try {
    const { token, password } = await request.json()

    if (!token || !password || password.length < 6) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
    }

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    })

    if (!resetToken || resetToken.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Link expirado ou inválido' }, { status: 400 })
    }

    const bcrypt = await import('bcryptjs')
    const passwordHash = await bcrypt.hash(password, 10)

    await prisma.user.update({
      where: { email: resetToken.email },
      data: { passwordHash },
    })

    // Delete used token
    await prisma.passwordResetToken.delete({ where: { id: resetToken.id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json({ error: 'Erro ao redefinir senha' }, { status: 500 })
  }
}
