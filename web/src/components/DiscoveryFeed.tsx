import { useState } from 'react'
import { EmptyFeed } from './EmptyFeed'
import { PeopleCard } from './PeopleCard'
import { Heart, X } from 'lucide-react'
import { Button } from './ui/button'

export function DiscoveryFeed() {
    const MOCK_PEOPLE = [
        {
            id: 1,
            name: 'Sofia',
            age: 28,
            bio: 'Adventure seeker & coffee enthusiast ☕ Love hiking, photography, and spontaneous road trips.',
            location: 'San Francisco, CA',
            occupation: 'Product Designer',
            images: Array.from({ length: 10 }).map(
                (_, index) => `https://picsum.photos/800/300?random=${index}`,
            ),
        },
        {
            id: 2,
            name: 'Marcus',
            age: 31,
            bio: 'Music producer by day, chef by night 🎵🍳 Dog dad to a golden retriever named Max.',
            location: 'Los Angeles, CA',
            occupation: 'Music Producer',
            images: Array.from({ length: 10 }).map(
                (_, index) => `https://picsum.photos/800/300?random=${index}`,
            ),
        },
        {
            id: 3,
            name: 'Emma',
            age: 26,
            bio: 'Yoga instructor & plant mom 🌱 Believes in good vibes, green smoothies, and deep conversations.',
            location: 'Austin, TX',
            occupation: 'Yoga Instructor',
            images: Array.from({ length: 10 }).map(
                () => 'https://picsum.photos/800/300',
            ),
        },
    ]

    const [index, setIndex] = useState(0)
    return (
        <div className="flex justify-center">
            <div className="max-w-sm">
                {index < MOCK_PEOPLE.length ? (
                    <div>
                        <PeopleCard
                            userProfile={{
                                ...MOCK_PEOPLE[index],
                                images: MOCK_PEOPLE[index].images.map(
                                    (i) => i + '?' + Math.random().toString(),
                                ),
                            }}
                        />
                        <div className="flex justify-center gap-4 p-4">
                            <Button
                                variant="outline"
                                onClick={() => setIndex((i) => i + 1)}
                                size="icon"
                                className="h-14 w-14 rounded-full border-2"
                            >
                                <X className="h-6 w-6" />
                            </Button>

                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setIndex((i) => i + 1)}
                                className="h-14 w-14 rounded-full border-2"
                            >
                                <Heart className="h-6 w-6" />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <EmptyFeed />
                )}
            </div>
        </div>
    )
}
