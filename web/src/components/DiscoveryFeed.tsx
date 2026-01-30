import { Heart, X } from 'lucide-react'
import {
    animate,
    AnimatePresence,
    motion,
    useMotionValue,
    useTransform,
} from 'motion/react'
import { useState } from 'react'
import { EmptyFeed } from './EmptyFeed'
import { PeopleCard } from './PeopleCard'
import { Button } from './ui/button'
import { MOCK_PROFILES } from '@/constants/mockData'

export function DiscoveryFeed() {
    const [index, setIndex] = useState(0)

    const x = useMotionValue(0)
    const opacity = useTransform(x, [-200, 0, 200], [0.8, 1, 0.8])
    const rotate = useTransform(x, [-200, 200], [25, -25])
    const scale = useTransform(x, [-200, 0, 200], [0.8, 1, 0.8])

    async function doSwipe(direction: 'left' | 'right') {
        await animate(x, direction == 'left' ? -120 : 120, {
            type: 'spring',
            stiffness: 300,
            damping: 30,
        })
        onSwipe(direction)
    }

    function onSwipe(direction: 'left' | 'right') {
        console.log(direction)
        setIndex((i) => i + 1)
    }

    return (
        <div className="flex justify-center items-center h-full">
            <div className="max-w-sm">
                <AnimatePresence mode="wait">
                    {index < MOCK_PROFILES.length ? (
                        <motion.div
                            key={index}
                            initial={{
                                x: x.get() == 0 ? 0 : x.get() > 0 ? 120 : -120,
                                opacity: 0,
                            }}
                            animate={{
                                x: 0,
                                opacity: 1,
                            }}
                            exit={{ opacity: 0 }}
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
                                    onSwipe(
                                        info.offset.x > 0 ? 'right' : 'left',
                                    )
                                }
                            }}
                        >
                            <PeopleCard
                                userProfile={MOCK_PROFILES[index]}
                            />

                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <EmptyFeed />
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex justify-center gap-8 mt-8 p-4">
                    <Button
                        variant="outline"
                        onClick={() => doSwipe('left')}
                        size="icon"
                        className="h-14 w-14 rounded-full border-2"
                    >
                        <X className="h-6 w-6" />
                    </Button>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => doSwipe('right')}
                        className="h-14 w-14 rounded-full border-2"
                    >
                        <Heart className="h-6 w-6" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
