import { type UserProfile } from '@/types/user'

export const MOCK_PROFILES: UserProfile[] = [
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
            (_, index) => `https://picsum.photos/800/300?random=${index + 10}`,
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
            (_, index) => `https://picsum.photos/800/300?random=${index + 20}`,
        ),
    },
]
