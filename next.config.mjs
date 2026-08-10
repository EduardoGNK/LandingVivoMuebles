/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // SECURITY: TypeScript errors must not be silenced — they can hide type-unsafe code
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google profile pictures
      },
    ],
  },
  // Configuración de seguridad — Security Headers (CWE-79, CWE-693)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Clickjacking protection
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          // MIME-type sniffing prevention
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // XSS auditor (legacy, but still useful for old browsers)
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Referrer information control
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // HSTS: force HTTPS for 1 year (includeSubDomains)
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          // Restrict browser feature access
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=()',
          },
          // Content Security Policy — restricts resource origins
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",  // unsafe-inline/eval required by Next.js
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://res.cloudinary.com https://lh3.googleusercontent.com",
              "media-src 'self' https://res.cloudinary.com",
              "connect-src 'self' https://api-inference.huggingface.co https://smtp-relay.brevo.com",
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

export default nextConfig
