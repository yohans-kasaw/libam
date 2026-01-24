import { AspectRatio } from '@/components/ui/aspect-ratio'
import {
    Carousel,
    type CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel'
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from './ui/button'

interface ImageGalleryProps {
    images: string[]
}

export function ImageGallery({ images }: ImageGalleryProps) {
    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(1)
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

    if (!images || images.length === 0) {
        return null
    }

    return (
        <Carousel opts={{ loop: true }} setApi={setApi} className="w-full">
            <div className="flex justify-center text-xs/4 mb-2 text-muted-foreground">
                {current} / {count}
            </div>
            <CarouselContent>
                {images.map((image, index) => (
                    <CarouselItem key={index} className="basis-2/3">
                        <AspectRatio
                            ratio={16 / 9}
                            className={`transition-opacity duration-500 ease-in-out ${index + 1 === current ? 'opacity-100' : 'opacity-20'}`}
                        >
                            <img
                                className="rounded-md w-full h-full object-cover"
                                src={image}
                                alt={`Gallery image ${index + 1}`}
                            />
                        </AspectRatio>
                    </CarouselItem>
                ))}
            </CarouselContent>

            <div className="flex justify-between items-center mt-4">
                <div className="flex gap-2 text-muted-foreground">
                    <CarouselPrevious className="static translate-y-0 " />
                    <CarouselNext className="static translate-y-0" />
                </div>
                <div>
                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full"
                    >
                        <Plus className="text-muted-foreground" />
                    </Button>
                </div>
            </div>
        </Carousel>
    )
}
