import {
    GoogleIcon,
    TelegramIcon,
    WhatsAppIcon,
    FacebookIcon,
    InstagramIcon,
} from './SvgIcons'

import { Button } from './ui/button'

const socialPlatforms = [
    {
        name: 'Google',
        icon: <GoogleIcon />,
    },
    {
        name: 'Telegram',
        icon: <TelegramIcon />,
    },
    {
        name: 'WhatsApp',
        icon: <WhatsAppIcon />,
    },
    {
        name: 'Facebook',
        icon: <FacebookIcon />,
    },
    {
        name: 'Instagram',
        icon: <InstagramIcon />,
    },
]

export default function SocialButtons() {
    return (
        <div className="flex justify-center gap-3">
            {socialPlatforms.map((platform) => (
                <Button
                    className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ease-out hover:scale-110"
                    key={platform.name}
                    title={platform.name}
                >
                    {platform.icon}
                </Button>
            ))}
        </div>
    )
}
