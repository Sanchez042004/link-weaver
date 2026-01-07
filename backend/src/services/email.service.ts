import nodemailer from 'nodemailer';
import { env } from '../config/env';

/**
 * Servicio para el envío de correos electrónicos usando Nodemailer (Gmail/SMTP)
 */
export class EmailService {
    private transporter: nodemailer.Transporter | null = null;
    private readonly FROM_EMAIL = env.SMTP_USER;
    private readonly FRONTEND_URL = env.FRONTEND_URL || 'http://localhost:3000';

    constructor() {
        if (env.SMTP_USER && env.SMTP_PASS) {
            console.log('✅ EmailService: Configuración SMTP detectada (Gmail).');
            this.transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: env.SMTP_USER,
                    pass: env.SMTP_PASS,
                },
            });
        } else {
            console.warn('⚠️ EmailService: SMTP_USER o SMTP_PASS NO detectados en el entorno.');
        }
    }

    /**
     * Enviar email de verificación de cuenta
     */
    async sendVerificationEmail(email: string, name: string, token: string): Promise<void> {
        console.log(`📧 Intentando enviar email de verificación a: ${email}`);
        if (!this.transporter) {
            console.warn('⚠️ Se intentó enviar un email pero SMTP no está configurado.');
            return;
        }

        const verificationUrl = `${this.FRONTEND_URL}/verify-email?token=${token}`;

        try {
            await this.transporter.sendMail({
                from: `"Knot.ly" <${this.FROM_EMAIL}>`,
                to: email,
                subject: 'Verifica tu cuenta en Knot.ly',
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;">
                        <h2 style="color: #f15922;">¡Bienvenido a Knot.ly, ${name}!</h2>
                        <p>Gracias por registrarte. Para empezar a acortar tus enlaces, por favor verifica tu cuenta haciendo clic en el botón de abajo:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${verificationUrl}" style="background-color: #f15922; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Verificar mi email</a>
                        </div>
                        <p style="font-size: 12px; color: #666;">Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
                        <p style="font-size: 12px; color: #666;">${verificationUrl}</p>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                        <p style="font-size: 10px; color: #999;">Si no creaste esta cuenta, puedes ignorar este correo.</p>
                    </div>
                `,
            });
            console.log('✅ Email de verificación enviado con éxito.');
        } catch (error) {
            console.error('❌ Error enviando email de verificación:', error);
        }
    }

    /**
     * Enviar email para restablecer contraseña
     */
    async sendPasswordResetEmail(email: string, name: string, token: string): Promise<void> {
        console.log(`📧 Intentando enviar email de recuperación a: ${email}`);
        if (!this.transporter) {
            console.warn('⚠️ Se intentó enviar un email pero SMTP no está configurado.');
            return;
        }

        const resetUrl = `${this.FRONTEND_URL}/reset-password?token=${token}`;

        try {
            await this.transporter.sendMail({
                from: `"Knot.ly" <${this.FROM_EMAIL}>`,
                to: email,
                subject: 'Restablece tu contraseña en Knot.ly',
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;">
                        <h2 style="color: #f15922;">Hola, ${name}</h2>
                        <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente botón para continuar:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${resetUrl}" style="background-color: #f15922; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Restablecer contraseña</a>
                        </div>
                        <p style="font-size: 12px; color: #666;">Este enlace expirará en 1 hora.</p>
                        <p style="font-size: 12px; color: #666;">Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
                        <p style="font-size: 12px; color: #666;">${resetUrl}</p>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                        <p style="font-size: 10px; color: #999;">Si no solicitaste este cambio, puedes ignorar este correo.</p>
                    </div>
                `,
            });
            console.log('✅ Email de recuperación enviado con éxito.');
        } catch (error) {
            console.error('❌ Error enviando email de recuperación:', error);
        }
    }
}

export const emailService = new EmailService();
