import { Heart, X } from 'lucide-react'
import { useState } from 'react'
import { EmptyFeed } from './EmptyFeed'
import { PeopleCard } from './PeopleCard'
import { Button } from './ui/button'
import { MOCK_PROFILES } from '@/constants/mockData'

export function DiscoveryFeed() {
    const [index, setIndex] = useState(0)

    function onSwipe(direction: 'left' | 'right') {
        console.log(direction)
        setIndex((i) => i + 1)
    }

    return (
        <div className="flex justify-center items-center h-full">
            <div className="max-w-sm">
                {index < MOCK_PROFILES.length ? (
                    <div key={index}>
                        <PeopleCard
                            userProfile={MOCK_PROFILES[index]}
                        />
                    </div>
                ) : (
                    <div>
                        <EmptyFeed />
                    </div>
                )}

                <div className="flex justify-center gap-8 mt-8 p-4">
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
