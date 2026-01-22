import { ThemeToggle } from '@/components/ThemeToggle'
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
import { User, Users, Settings, HelpCircle } from 'lucide-react'

export function AppSidebar() {
    const items = [
        { label: 'Profile', url: '#', icon: User },
        { label: 'Contacts', url: '#', icon: Users },
        { label: 'Settings', url: '#', icon: Settings },
        { label: 'Help', url: '#', icon: HelpCircle },
    ]

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="bg-background/60 border-b group-data-[state=collapsed]:hidden">
                <div className='flex flex-col gap-2 p-2'>
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
                            <a href={item.url}>
                                <item.icon />
                                <span>{item.label}</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
                <SidebarGroup />
            </SidebarContent>
            <SidebarFooter></SidebarFooter>
        </Sidebar>
    )
}
