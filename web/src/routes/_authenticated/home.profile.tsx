import { ImageGallery } from '@/components/ImageGallery'
import { Card, CardContent } from '@/components/ui/card'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Route as Root } from '@/routes/index'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ChevronRight, CircleCheck, Hash, Mail, Phone } from 'lucide-react'
import { useState, type ReactNode } from 'react'

export const Route = createFileRoute('/_authenticated/home/profile')({
    component: RouteComponent,
})

function RouteComponent() {
    const images = Array.from({ length: 10 }).map(
        (_, index) => `https://picsum.photos/800/300?random=${index}`,
    )

    const [profile, setProfile] = useState({
        name: 'Yohans',
        age: 25,
        verified: true,
        phone: '+251 929260704',
        handle: '@yohans',
        bio: 'relax 😌',
        email: 'yohans@example.com',
        online: true,
    })

    const navigate = useNavigate()

    return (
        <div className="pl-10 max-w-lg">
            <Dialog
                open={true}
                onOpenChange={() => {
                    navigate({ to: Root.fullPath })
                }}
            >
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit profile</DialogTitle>
                    </DialogHeader>
                    <ImageGallery images={images} showAddButton={true} aspectRatio={16/9} />

                    <div className="flex items-center gap-2 mt-4">
                        <div className="text-xl font-medium">
                            {profile.name}
                        </div>
                        <div className="text-xl font-medium">{profile.age}</div>
                        <div className="flex justify-center items-center w-5 h-10">
                            <CircleCheck size={14} className="text-blue-300" />
                        </div>
                    </div>

                    <div className="flex gap-2 items-center">
                        <span className="size-2.5 rounded-full bg-green-300" />
                        <span className="text-sm text-muted-foreground">
                            {profile.online ? 'online' : 'offline'}
                        </span>
                    </div>

                    {/* Account */}
                    <h2 className="text-muted-foreground font-medium tracking-wide">
                        Account
                    </h2>
                    <Card className="p-1">
                        <CardContent className="px-4">
                            <div className="divide-y divide-border">
                                <ActionItem
                                    icon={<Phone />}
                                    title={profile.phone}
                                    description="Tap to change phone number"
                                />
                                <ActionItem
                                    icon={<Hash />}
                                    title={profile.handle}
                                    description="username"
                                />
                                <ActionItem
                                    icon={<Mail />}
                                    title={profile.email}
                                    description="Email address"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <h2 className="text-muted-foreground font-medium tracking-wide">
                        Bio
                    </h2>
                    {/* Bio */}
                    <Card className="p-1">
                        <CardContent className="pl-4">
                            <div className="">
                                <ActionItem
                                    title={profile.bio}
                                    description="Tap to change"
                                    noChevron={true}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </DialogContent>
            </Dialog>
        </div>
    )
}

function ActionItem({
    icon,
    title,
    description,
    noChevron,
}: {
    icon?: ReactNode
    title: string
    description: string
    noChevron?: boolean
}) {
    return (
        <div className="flex flex-col divide-y divide-border py-1">
            <div className="flex w-full p-3 rounded-xl items-center gap-2 transition-colors hover:bg-accent">
                {icon && (
                    <div className="w-10 h-10 flex items-center justify-center">
                        {icon}
                    </div>
                )}
                <div className="flex-1 flex flex-col justify-start items-start space-y-0.5">
                    <span className="text-[16px] font-medium leading-none">
                        {title}
                    </span>
                    <span className="text-sm text-muted-foreground">
                        {description}
                    </span>
                </div>
                {!noChevron && <ChevronRight />}
            </div>
        </div>
    )
}
