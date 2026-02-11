import { useState } from 'react'
import { Heart, X } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

import { EmptyFeed } from './EmptyFeed'
import { PeopleCard } from './PeopleCard'
import { Button } from './ui/button'
import { MOCK_PROFILES } from '@/constants/mockData'
import { useSwipeCard } from '@/hooks/useSwipeCard'

const MAX_VISIBLE_CARDS = 9
const VISIBLE_STACK_DEPTH = 6
const STACK_OFFSET_PX = 4

export function DiscoveryFeed() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const totalProfiles = MOCK_PROFILES.length
  const isFeedEmpty = currentIndex >= totalProfiles

  const visibleProfiles = isFeedEmpty
    ? []
    : MOCK_PROFILES.slice(currentIndex, currentIndex + MAX_VISIBLE_CARDS)

  const stackSize = visibleProfiles.length
  const hasProfiles = stackSize > 0
  const frontProfile = hasProfiles ? visibleProfiles[0] : undefined
  const restProfiles = hasProfiles ? visibleProfiles.slice(1) : []

  function handleSwiped(direction: 'left' | 'right') {
    console.log(direction)
    setCurrentIndex((previousIndex) =>
      Math.min(previousIndex + 1, totalProfiles),
    )
  }

  const {
    x,
    y,
    rotate,
    controls,
    handleDragEnd,
    swipeLeft,
    swipeRight,
    isAnimating,
  } = useSwipeCard({ onSwiped: handleSwiped })

  return (
    <div className="flex h-full items-center justify-center">
      <div className="max-w-sm">
        <div className='grid'>
          <AnimatePresence mode="popLayout">
            {frontProfile && (
              <motion.div
                key={frontProfile.id}
                className='row-start-1 col-start-1'
                layout
                // exit={{ scale: 0.8 }}
                style={{ x, y, rotate, zIndex: stackSize }}
                drag="x"
                onDragEnd={handleDragEnd}
                animate={controls}
              >
                <PeopleCard userProfile={frontProfile} />
              </motion.div>
            )}

            {restProfiles.map((profile, index) => {
              const visibleIndex = index + 1
              const zIndex = stackSize - visibleIndex
              const depth = Math.min(visibleIndex, VISIBLE_STACK_DEPTH - 1)
              const translateY = depth * STACK_OFFSET_PX

              return (
                <motion.div
                  key={profile.id}
                  className='row-start-1 col-start-1'
                  layout
                  style={{ zIndex, translateY }}
                >
                  <PeopleCard userProfile={profile} />
                </motion.div>
              )
            })}

            {isFeedEmpty && (
              <motion.div className='row-start-1 col-start-1'>
                <EmptyFeed />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-8 mt-8 p-4" style={{ visibility: isFeedEmpty ? 'hidden' : 'visible' }}>
          <Button
            variant="outline"
            onClick={swipeLeft}
            size="icon"
            className="h-14 w-14 rounded-full border-2"
            disabled={isAnimating}
          >
            <X className="h-6 w-6" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={swipeRight}
            className="h-14 w-14 rounded-full border-2"
            disabled={isAnimating}
          >
            <Heart className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  )
}
