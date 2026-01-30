import { Card } from './ui/card'
import { Briefcase, MapPin } from 'lucide-react'
import { Badge } from './ui/badge'
import { type UserProfile } from '@/types/user'
import { AspectRatio } from '@radix-ui/react-aspect-ratio';

export function ProfileCard({
    userProfile,
}: {
    userProfile: UserProfile,
}) {
    return (
        <Card className="rounded-xl p-4">
            <div>
                <AspectRatio ratio={16 / 9} className='flex justify-center'>
                    <img src={userProfile.images[0]} />
                </AspectRatio>
            </div>

            <div>
                <div className="flex items-baseline gap-2 mb-1">
                    <h2 className="text-xl font-medium">{userProfile.name}</h2>
                    <span className="text-sm">{userProfile.age}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-2">
                    <Badge
                        variant="secondary"
                        className="bg-white/20 text-white border-0"
                    >
                        <MapPin className="w-3 h-3 mr-1" />
                        {userProfile.location}
                    </Badge>
                    <Badge
                        variant="secondary"
                        className="bg-white/20 text-white border-0"
                    >
                        <Briefcase className="w-3 h-3 mr-1" />
                        {userProfile.occupation}
                    </Badge>
                </div>
            </div>
        </Card>
    )
}
