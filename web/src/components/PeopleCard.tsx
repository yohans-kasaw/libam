import { ImageGallery } from './ImageGallery'
import { Card } from './ui/card'
import { Briefcase, MapPin } from 'lucide-react'
import { Badge } from './ui/badge'
import { type UserProfile } from '@/types/user'

export function PeopleCard({ userProfile }: { userProfile: UserProfile }) {
    return (
        <Card className="rounded-3xl p-4 pb-8">
            <ImageGallery
                images={userProfile.images}
                showAddButton={false}
                aspectRatio={9 / 16}
            ></ImageGallery>

            <div>
                <div className="flex items-baseline gap-2 mb-1">
                    <h2 className="text-2xl font-bold">
                        {userProfile.name}
                    </h2>
                    <span className="text-xl">{userProfile.age}</span>
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

                <p className="text-sm opacity-90 line-clamp-2">
                    {userProfile.bio}
                </p>
            </div>
        </Card>
    )
}
