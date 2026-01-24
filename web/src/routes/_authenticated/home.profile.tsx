import { ImageGallery } from '@/components/ImageGallery'
import { Button } from '@/components/ui/button'
import { Route as Root } from '@/routes/index'
import { DialogHeader } from '@/components/ui/dialog'
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

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
                </DialogContent>
            </Dialog>
        </div>
    )
}
