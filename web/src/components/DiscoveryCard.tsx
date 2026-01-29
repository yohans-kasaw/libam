import { forwardRef, useImperativeHandle } from 'react'
import { ImageGallery } from './ImageGallery'
import { Card } from './ui/card'
import { Briefcase, MapPin } from 'lucide-react'
import { Badge } from './ui/badge'
import { type UserProfile } from '@/types/user'
import {
    animate,
    motion,
    useMotionValue,
    useTransform,
} from 'motion/react'

interface DiscoveryCardProps {
    userProfile: UserProfile
    onSwipe: (direction: 'left' | 'right') => void
}

export interface DiscoveryCardHandle {
    swipe: (direction: 'left' | 'right') => Promise<void>
}

export const DiscoveryCard = forwardRef<DiscoveryCardHandle, DiscoveryCardProps>(
    ({ userProfile, onSwipe }, ref) => {
        const x = useMotionValue(0)
        const opacity = useTransform(x, [-200, 0, 200], [0.8, 1, 0.8])
        const rotate = useTransform(x, [-200, 200], [25, -25])
        const scale = useTransform(x, [-200, 0, 200], [0.8, 1, 0.8])

        const doSwipe = async (direction: 'left' | 'right') => {
            await animate(x, direction === 'left' ? -200 : 200, {
                type: 'spring',
                stiffness: 300,
                damping: 30,
            })
            onSwipe(direction)
        }

        useImperativeHandle(ref, () => ({
            swipe: doSwipe,
        }))

        return (
            <motion.div
                style={{
                    x,
                    opacity,
                    rotate,
                    scale,
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(_, info) => {
                    if (Math.abs(info.offset.x) > 50) {
                        doSwipe(info.offset.x > 0 ? 'right' : 'left')
                    }
                }}
                className="cursor-grab active:cursor-grabbing"
            >
                <Card className="rounded-3xl p-4 pb-8 shadow-xl bg-card">
                    <div
                        onPointerDownCapture={(e) => {
                            // Prevent drag when clicking on gallery
                            e.stopPropagation()
                        }}
                    >
                        <ImageGallery
                            images={userProfile.images}
                            showAddButton={false}
                            aspectRatio={9 / 16}
                        />
                    </div>

                    <div className="mt-4">
                        <div className="flex items-baseline gap-2 mb-1">
                            <h2 className="text-2xl font-bold">{userProfile.name}</h2>
                            <span className="text-xl text-muted-foreground">{userProfile.age}</span>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                            <Badge
                                variant="secondary"
                                className="bg-secondary/50"
                            >
                                <MapPin className="w-3 h-3 mr-1" />
                                {userProfile.location}
                            </Badge>
                            <Badge
                                variant="secondary"
                                className="bg-secondary/50"
                            >
                                <Briefcase className="w-3 h-3 mr-1" />
                                {userProfile.occupation}
                            </Badge>
                        </div>

                        <p className="text-sm text-balance opacity-90 line-clamp-3">
                            {userProfile.bio}
                        </p>
                    </div>
                </Card>
            </motion.div>
        )
    }
)

DiscoveryCard.displayName = 'DiscoveryCard'
