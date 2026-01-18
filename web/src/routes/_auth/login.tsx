import { createFileRoute, redirect } from '@tanstack/react-router'
import { Mail, Phone } from 'lucide-react'
import SocialButtons from '@/components/SocialButtons'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useState, type FormEvent } from 'react'
import { Tabs, TabsContent, TabsTrigger, TabsList } from '@/components/ui/tabs'
import { Card, CardAction, CardContent, CardHeader } from '@/components/ui/card'

export const Route = createFileRoute('/_auth/login')({
    beforeLoad() {
        if (authenticated()) {
            throw redirect({
                to: '/',
                replace: true,
            })
        }
    },
    component: RouteComponent,
})

function RouteComponent() {
    type emailOrPhone = 'email' | 'phone'
    const [activeTab, setActiveTab] = useState<emailOrPhone>('email')
    const [input, setInput] = useState('')

    const handleSendOtp = (e: FormEvent) => {
        e.preventDefault()

        console.log('Using email or phone', activeTab)
        console.log('Submitting:', input)
        // api.sendOtp({ [activeTab]: input })
    }

    return (
        <div className="flex justify-center mb-20">
            <Card className="w-full max-w-sm">
                {/* Tab Switcher */}
                <form onSubmit={handleSendOtp}>
                    <CardContent>
                        <Tabs
                            defaultValue="phone"
                            onValueChange={(value) => {
                                setActiveTab(value as emailOrPhone)
                                setInput('')
                            }}
                        >
                            <TabsList className="w-full mb-8">
                                <TabsTrigger value="phone">
                                    <Phone />
                                    Phone
                                </TabsTrigger>
                                <TabsTrigger value="email">
                                    <Mail />
                                    Email
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="phone" className="mb-4">
                                <Input
                                    type="tel"
                                    name="phone"
                                    autoComplete="tel"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Enter your phone number"
                                />
                            </TabsContent>

                            <TabsContent value="email" className="mb-4">
                                <Input
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Enter your email"
                                />
                            </TabsContent>
                        </Tabs>

                        <Button type="submit" className="w-full">
                            Send OTP
                        </Button>
                    </CardContent>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-4">
                    <Separator className="flex-1" />
                    <span className="text-muted-foreground text-sm font-medium">
                        or
                    </span>
                    <Separator className="flex-1" />
                </div>

                <SocialButtons />
            </Card>
        </div>
    )
}

//TODO: implement
function authenticated() {
    return false
}
