import type { JSX } from 'react'

// Shared props to ensure consistency
const defaultProps = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.2",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
}

export const GoogleIcon = (props: JSX.IntrinsicElements['svg']) => (
    <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        {...defaultProps}
        {...props}
    >
        <path d="M17.788 5.108A9 9 0 1 0 21 12h-8" />
    </svg>
)

export const TelegramIcon = (props: JSX.IntrinsicElements['svg']) => (
    <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        {...defaultProps}
        {...props}
    >
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
)

export const WhatsAppIcon = (props: JSX.IntrinsicElements['svg']) => (
    <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        {...defaultProps}
        {...props}
    >
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
)

export const FacebookIcon = (props: JSX.IntrinsicElements['svg']) => (
    <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        {...defaultProps}
        {...props}
    >
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
)

export const InstagramIcon = (props: JSX.IntrinsicElements['svg']) => (
    <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        {...defaultProps}
        {...props}
    >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
)
