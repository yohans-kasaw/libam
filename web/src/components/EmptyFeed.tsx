import { Card } from './ui/card'
import { Heart } from 'lucide-react'

export function EmptyFeed() {
    return (
        <Card className="rounded-3xl">
            <div className="flex flex-col gap-1 items-center justify-center p-10 text-center">
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 rounded-full opacity-80 animate-pulse" />

                    <div className="relative bg-muted/40 rounded-full p-8">
                        <Heart className="h-16 w-16 text-muted-foreground/60" />
                    </div>
                </div>

                <h3 className="text-2xl font-semibold text-foreground mb-3">
                    No more candidates
                </h3>
                <p className="text-muted-foreground max-w-xs leading-relaxed">
                    You've seen everyone in your area. Check back later for new
                    matches or expand your search preferences.
                </p>

                <div className="mt-16 flex gap-4">
                    {[0, 150, 300].map((delay) => (
                        <div
                            className="w-2 h-2 rounded-full bg-muted-foreground/20 animate-bounce"
                            style={{
                                animationDelay: `${delay}ms`,
                            }}
                        />
                    ))}
                </div>
            </div>
        </Card>
    )
}
