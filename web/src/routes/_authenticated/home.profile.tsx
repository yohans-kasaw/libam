import { ImageGallery } from '@/components/ImageGallery'
import { Route as Root } from '@/routes/index'
import { DialogHeader } from '@/components/ui/dialog'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { AtSign, CircleCheck, Mail, Phone } from 'lucide-react'
import { Button as div } from '@/components/ui/button'

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
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit profile</DialogTitle>
                    </DialogHeader>
                    <ImageGallery images={images} />
                    <div className="flex items-center gap-2 mt-4">
                        <div className="text-xl sm:text-2xl">
                            {profile.name}
                        </div>
                        <div>{profile.age}</div>
                        <div>
                            <CircleCheck />
                        </div>
                    </div>

                    <div className="flex gap-2 items-center">
                        <span className="size-2.5 rounded-full bg-green-300" />
                        <span className="text-sm text-muted-foreground">
                            {profile.online ? 'online' : 'offline'}
                        </span>
                    </div>

                    {/* Account */}
                    <div>
                        <div>
                            <div className="flex items-center gap-2">
                                <Phone />
                                <div className="flex flex-col justify-start items-start">
                                    <span>{profile.phone}</span>
                                    <span>
                                        "tap to change your phone number"
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <div>
                            <div className="flex items-center gap-2">
                                <Mail/>
                                <div className="flex flex-col justify-start items-start">
                                    <span>{profile.email}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* handle */}
                    <div>
                        <div>
                            <div className="flex items-center gap-2">
                                <AtSign />
                                <div className="flex flex-col justify-start items-start">
                                    <span>{profile.handle}</span>
                                    <span>
                                        "tap to change your phone number"
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Bio */}
                    <div>
                        bio
                        <div className='mt-2'>
                            <div className="flex items-center">
                                <Phone />
                                <div className="flex flex-col justify-start items-start">
                                    <span>{profile.bio}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bio */}
                    <div></div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
