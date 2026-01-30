import { ThemeToggle } from '@/components/ThemeToggle'
import { Route as ProfileRoute } from '@/routes/_authenticated/home.profile'
import { Route as MatchesRoute } from '@/routes/_authenticated/home.matches'
import { Route as HelpRoute } from '@/routes/_authenticated/help'
import { Link } from '@tanstack/react-router'
import { type FileRoutesByFullPath } from '@/routeTree.gen'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
    User,
    Users,
    Settings,
    HelpCircle,
    type LucideIcon,
} from 'lucide-react'

export function AppSidebar() {
    const items: {
        label: string
        to: keyof FileRoutesByFullPath
        icon: LucideIcon
    }[] = [
            { label: 'Profile', to: ProfileRoute.fullPath, icon: User },
            { label: 'Matches', to: MatchesRoute.fullPath, icon: Users },
            { label: 'Settings', to: '/', icon: Settings },
            { label: 'Help', to: HelpRoute.fullPath, icon: HelpCircle },
        ]

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="bg-background/60 border-b group-data-[state=collapsed]:hidden">
                <div className="flex flex-col gap-2 p-2">
                    <div className="flex justify-between">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <ThemeToggle />
                    </div>
                    <div className="flex justify-between">
                        <div className="text-xs">emailyohans@gmail.com</div>
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup />
                {items.map((item) => (
                    <SidebarMenuItem key={item.label}>
                        <SidebarMenuButton asChild>
                            <Link to={item.to}>
                                <item.icon />
                                <span>{item.label}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
                <SidebarGroup />
            </SidebarContent>
            <SidebarFooter></SidebarFooter>
        </Sidebar>
    )
}
