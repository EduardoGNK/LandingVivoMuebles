import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    BREVO_SMTP_USER: process.env.BREVO_SMTP_USER,
    BREVO_SMTP_KEY: process.env.BREVO_SMTP_KEY ? 'set' : 'not set',
    EMAIL_1: process.env.EMAIL_1,
    EMAIL_2: process.env.EMAIL_2,
  });
}