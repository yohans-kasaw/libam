import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Route as Root } from '@/routes/index'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { MOCK_PROFILES } from '@/constants/mockData'
import { ProfileCard } from '@/components/ProfileCard'

export const Route = createFileRoute('/_authenticated/home/matches')({
    component: RouteComponent,
})

function RouteComponent() {
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
                        <DialogTitle>Your Matches</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-6">
                        {MOCK_PROFILES.map(p =>
                            <ProfileCard
                                userProfile={p}
                            />
                        )}
                    </div>

                </DialogContent>
            </Dialog>
        </div>
    )
}
