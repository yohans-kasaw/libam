import { Heart, X } from 'lucide-react'
import { useState } from 'react'
import { EmptyFeed } from './EmptyFeed'
import { PeopleCard } from './PeopleCard'
import { Button } from './ui/button'
import { MOCK_PROFILES } from '@/constants/mockData'
import { motion, AnimatePresence } from 'motion/react'

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

  function onSwipe(direction: 'left' | 'right') {
    console.log(direction)
    setCurrentIndex((previousIndex) =>
      Math.min(previousIndex + 1, totalProfiles),
    )
  }

  return (
    <div className="flex justify-center items-center h-full">
      <div className="max-w-sm">
        <div className='grid'>
          <AnimatePresence mode="popLayout">
            {!isFeedEmpty && visibleProfiles.map((profile, visibleIndex) => {
              const absoluteIndex = currentIndex + visibleIndex
              const zIndex = stackSize - visibleIndex
              const depth = Math.min(visibleIndex, VISIBLE_STACK_DEPTH - 1)
              const translateY = depth * STACK_OFFSET_PX

              return (
                <motion.div
                  key={profile.id}
                  className='row-start-1 col-start-1'
                  layout
                  initial={{ opacity: 0}}
                  animate={{ opacity: 1}}
                  exit={{ opacity: 0 }}
                  style={{ zIndex, translateY }}
                >
                  <div className='bg-red-200'>
                    curr index{currentIndex}  index{absoluteIndex} zIndex{zIndex} id {profile.id}
                  </div>
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
            onClick={() => onSwipe('left')}
            size="icon"
            className="h-14 w-14 rounded-full border-2"
          >
            <X className="h-6 w-6" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => onSwipe('right')}
            className="h-14 w-14 rounded-full border-2"
          >
            <Heart className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  )
}
