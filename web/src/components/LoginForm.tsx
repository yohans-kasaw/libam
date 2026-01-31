import { useState, type FormEvent } from 'react'
import { Mail, Phone, LockKeyhole as Key, Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsTrigger, TabsList } from '@/components/ui/tabs'

export type LoginMethod = 'email' | 'phone' | 'password'

interface LoginFormProps {
    onSendOtp: (method: LoginMethod, value: string, password?: string) => void
}

export default function LoginForm({ onSendOtp }: LoginFormProps) {
    const [activeTab, setActiveTab] = useState<LoginMethod>('phone')
    const [input, setInput] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        onSendOtp(activeTab, input, password)
    }

    const resetForm = (method: LoginMethod) => {
        setActiveTab(method)
        setInput('')
        setPassword('')
        setShowPassword(false)
    }

    return (
        <form onSubmit={handleSubmit}>
            <Tabs
                defaultValue="phone"
                onValueChange={(value) => resetForm(value as LoginMethod)}
            >
                <TabsList className="w-full mb-8">
                    <TabsTrigger value="phone" className="flex-1">
                        <Phone className="mr-2 h-4 w-4" />
                        Phone
                    </TabsTrigger>
                    <TabsTrigger value="email" className="flex-1">
                        <Mail className="mr-2 h-4 w-4" />
                        Email
                    </TabsTrigger>
                    <TabsTrigger value="password" className="flex-1">
                        <Key className="mr-2 h-4 w-4" />
                        Password
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
                        required={activeTab === 'phone'}
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
                        required={activeTab === 'email'}
                    />
                </TabsContent>

                <TabsContent value="password" className="space-y-4 mb-4">
                    <div className="space-y-2">
                        <Input
                            type="text"
                            name="identifier"
                            autoComplete="username"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Email or Phone number"
                            required={activeTab === 'password'}
                        />
                    </div>
                    <div className="space-y-2 grid gap-1">
                        <Input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required={activeTab === 'password'}
                            className="pr-10 row-start-1 col-start-1"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="hover:bg-transparent row-start-1 col-start-1 justify-self-end"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className="sr-only">
                                {showPassword ? 'Hide password' : 'Show password'}
                            </span>
                        </Button>
                    </div>
                </TabsContent>
            </Tabs>

            <Button type="submit" className="w-full">
                {activeTab === 'password' ? 'Login' : 'Send OTP'}
            </Button>
        </form>
    )
}
