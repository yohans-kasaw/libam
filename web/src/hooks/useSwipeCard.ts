import { useCallback, useState } from 'react'
import {
    useAnimationControls,
    useMotionValue,
    useTransform,
} from 'motion/react'

type SwipeDirection = 'left' | 'right'

interface SwipeConfig {
    swipeDistance?: number
    swipeVelocity?: number
    maxRotationDeg?: number
    yDrift?: number
}

interface UseSwipeCardOptions {
    onSwiped: (direction: SwipeDirection) => void
    config?: SwipeConfig
}

const DEFAULT_SWIPE_DISTANCE = 120
const DEFAULT_SWIPE_VELOCITY = 500
const DEFAULT_MAX_ROTATION_DEG = 15
const DEFAULT_Y_DRIFT = 0

const SPRING_TO_CENTER = {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
}

const SPRING_TO_EXIT = {
    type: 'spring' as const,
    stiffness: 260,
    damping: 26,
}

interface DragInfo {
    offset: { x: number }
    velocity: { x: number }
}

export function useSwipeCard({ onSwiped, config }: UseSwipeCardOptions) {
    const swipeDistance = config?.swipeDistance ?? DEFAULT_SWIPE_DISTANCE
    const swipeVelocity = config?.swipeVelocity ?? DEFAULT_SWIPE_VELOCITY
    const maxRotationDeg = config?.maxRotationDeg ?? DEFAULT_MAX_ROTATION_DEG
    const yDrift = config?.yDrift ?? DEFAULT_Y_DRIFT

    const x = useMotionValue(0)
    const controls = useAnimationControls()
    const rotate = useTransform(
        x,
        [-swipeDistance, 0, swipeDistance],
        [maxRotationDeg, 0, -maxRotationDeg],
    )
    const y = useTransform(
        x,
        [-swipeDistance, 0, swipeDistance],
        [yDrift, 0, yDrift],
    )
    const [isAnimating, setIsAnimating] = useState(false)

    const resetCard = useCallback(() => {
        controls.set({ x: 0, opacity: 1 })
        x.set(0)
    }, [controls, x])

    const animateBackToCenter = useCallback(() => {
        setIsAnimating(true)
        controls
            .start({
                x: 0,
                opacity: 1,
                transition: SPRING_TO_CENTER,
            })
            .finally(() => {
                setIsAnimating(false)
            })
    }, [controls])

    const startSwipe = useCallback(
        (direction: SwipeDirection) => {
            if (isAnimating) return

            setIsAnimating(true)
            const exitX = direction === 'right' ? swipeDistance * 2 : -swipeDistance * 2

            controls
                .start({
                    x: exitX,
                    opacity: 0,
                    transition: SPRING_TO_EXIT,
                })
                .then(() => {
                    onSwiped(direction)
                    resetCard()
                    setIsAnimating(false)
                })
        },
        [controls, isAnimating, onSwiped, resetCard, swipeDistance],
    )

    const handleDragEnd = useCallback(
        (_event: unknown, info: DragInfo) => {
            if (isAnimating) return

            const distanceX = info.offset.x
            const velocityX = info.velocity.x

            const hasPassedThreshold =
                Math.abs(distanceX) > swipeDistance ||
                Math.abs(velocityX) > swipeVelocity

            if (hasPassedThreshold) {
                const direction: SwipeDirection = distanceX > 0 ? 'right' : 'left'
                startSwipe(direction)
                return
            }

            animateBackToCenter()
        },
        [animateBackToCenter, isAnimating, startSwipe, swipeDistance, swipeVelocity],
    )

    const swipeLeft = useCallback(() => startSwipe('left'), [startSwipe])
    const swipeRight = useCallback(() => startSwipe('right'), [startSwipe])

    return {
        x,
        y,
        rotate,
        controls,
        handleDragEnd,
        swipeLeft,
        swipeRight,
        isAnimating,
    }
}
