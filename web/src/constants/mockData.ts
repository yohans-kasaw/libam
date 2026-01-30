import { type UserProfile } from '@/types/user'

const getRandomDimensions = () => {
    const ratios = [
        { w: 800, h: 1200 },
        { w: 1200, h: 800 },
        { w: 1000, h: 1000 },
        { w: 900, h: 1600 },
    ];
    const { w, h } = ratios[Math.floor(Math.random() * ratios.length)];
    const jitter = () => Math.floor(Math.random() * 50);
    return `${w + jitter()}/${h + jitter()}`;
};

const NAMES = ['Sofia', 'Marcus', 'Emma', 'Liam', 'Yuki', 'Amara', 'Chen', 'Soren'];
const LOCATIONS = ['San Francisco, CA', 'Los Angeles, CA', 'Austin, TX', 'Seattle, WA', 'Brooklyn, NY'];
const BIOS = [
    'Adventure seeker & coffee enthusiast ☕',
    'Music producer by day, chef by night 🎵🍳',
    'Yoga instructor & plant mom 🌱',
    'Tech nerd and weekend marathon runner 🏃‍♂️',
    'Just looking for the best tacos in town.',
];

const generateProfile = (id: number): UserProfile => {
    const name = NAMES[id % NAMES.length];
    return {
        id,
        name,
        age: 22 + Math.floor(Math.random() * 15),
        bio: BIOS[id % BIOS.length],
        location: LOCATIONS[id % LOCATIONS.length],
        occupation: 'Professional Human',
        images: Array.from({ length: 6 + Math.floor(Math.random() * 4) }).map(
            (_, index) => `https://picsum.photos/${getRandomDimensions()}?random=${id}-${index}`,
        ),
    };
};

// Generate 20 unique-ish profiles
export const MOCK_PROFILES: UserProfile[] = Array.from({ length: 20 }).map((_, i) =>
    generateProfile(i + 1)
);
