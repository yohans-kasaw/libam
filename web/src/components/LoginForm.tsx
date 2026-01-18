import { useState, type FormEvent } from 'react'
import { Mail, Phone } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsTrigger, TabsList } from '@/components/ui/tabs'

export type LoginMethod = 'email' | 'phone'

interface LoginFormProps {
    onSendOtp: (method: LoginMethod, value: string) => void
}

export default function LoginForm({ onSendOtp }: LoginFormProps) {
    const [activeTab, setActiveTab] = useState<LoginMethod>('phone')
    const [input, setInput] = useState('')

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        onSendOtp(activeTab, input)
    }

    return (
        <form onSubmit={handleSubmit}>
            <Tabs
                defaultValue="phone"
                onValueChange={(value) => {
                    setActiveTab(value as LoginMethod)
                    setInput('')
                }}
            >
                <TabsList className="w-full mb-8">
                    <TabsTrigger value="phone">
                        <Phone className="mr-2 h-4 w-4" />
                        Phone
                    </TabsTrigger>
                    <TabsTrigger value="email">
                        <Mail className="mr-2 h-4 w-4" />
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
        </form>
    )
}
