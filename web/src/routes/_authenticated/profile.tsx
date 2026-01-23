import { AspectRatio } from '@/components/ui/aspect-ratio'
import {
    Carousel,
    type CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/_authenticated/profile')({
    component: RouteComponent,
})

function RouteComponent() {
    const randomImage = 'https://picsum.photos/800/300'

    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)
    const count = api?.scrollSnapList().length ?? 0
    useEffect(() => {
        if (!api) {
            return
        }

        const onSelect = () => {
            setCurrent(api.selectedScrollSnap() + 1)
        }

        api.on('select', onSelect)
        return () => {
            api.off('select', onSelect)
        }
    }, [api])

    return (
        <div className="pl-10 max-w-lg">
            <Carousel opts={{ loop: true }} setApi={setApi}>
                <div className='flex justify-center text-xs/4'>
                    {current} / {count}
                </div>
                <CarouselContent>
                    {Array.from({ length: 10 }).map((_, index) => (
                        <CarouselItem key={index} className="basis-2/3">
                            <AspectRatio
                                ratio={16 / 9}
                                className={`transition-opacity duration-500 ease-in-out ${index + 1 === current ? 'opacity-100' : 'opacity-20'}`}
                            >
                                <img
                                    className="rounded-xs w-full h-full object-cover"
                                    src={randomImage + `?random=${index}`}
                                />
                            </AspectRatio>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <div className="flex justify-end gap-2 mt-4">
                    <CarouselPrevious className="static translate-y-0" />
                    <CarouselNext className="static translate-y-0" />
                </div>
            </Carousel>
        </div>
    )
}
