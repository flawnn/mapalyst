import Image from "next/image";
import React from "react";
import { cn } from "~/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/ui/components/carousel";
import {
  TimeSeriesChart,
  type DataPoint,
} from "~/ui/components/time-series-chart";
import { ImageModal } from "~/ui/components/image-modal";

const CAROUSEL_CONFIG = {
  imageWidth: 300,
  imageHeight: 225,
  containerWidth: 332,
  carouselWidth: 300,
} as const;

interface RichResponseWidgetProps {
  images: string[];
  timeSeriesData?: DataPoint[];
  content: string;
  className?: string;
}

export const RichResponseWidget: React.FC<RichResponseWidgetProps> = ({
  images,
  timeSeriesData,
  content,
  className,
}) => {
  const [hoveredPoint, setHoveredPoint] = React.useState<DataPoint | null>(
    null,
  );
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  return (
    <>
      <div
        ref={containerRef}
        className={cn("flex flex-col items-stretch gap-4", className)}
        style={{
          width: CAROUSEL_CONFIG.containerWidth,
          maxWidth: "100%",
        }}
      >
        {/* Image Carousel Section */}
        <div 
          className="relative w-full"
          style={{ 
            width: CAROUSEL_CONFIG.carouselWidth,
            margin: "0 auto",
          }}
        >
          <Carousel
            opts={{
              align: "center",
              slidesToScroll: 1,
              containScroll: "trimSnaps",
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {images.map((image, index) => (
                <CarouselItem key={index} className="pl-4">
                  <div
                    style={{
                      width: CAROUSEL_CONFIG.imageWidth,
                      height: CAROUSEL_CONFIG.imageHeight,
                      padding: "8px",
                    }}
                    className="relative"
                  >
                    <div
                      className="relative h-full w-full cursor-pointer overflow-hidden rounded-lg transition-transform duration-200 hover:scale-[1.03]"
                      onClick={() => setSelectedImage(image)}
                    >
                      <Image
                        src={image}
                        alt={`Carousel image ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes={`${CAROUSEL_CONFIG.imageWidth}px`}
                        priority={index < 2}
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90" />
            <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90" />
          </Carousel>
        </div>

        {/* Time Series Chart Section */}
        {timeSeriesData && (
          <div className="w-full">
            <TimeSeriesChart
              data={timeSeriesData}
              height={200}
              onPointHover={setHoveredPoint}
            />
            {/* {hoveredPoint && (
              <div className="mt-2 text-sm text-muted-foreground">
                Selected point:{" "}
                {new Date(hoveredPoint.timestamp).toLocaleString()} - Value:{" "}
                {hoveredPoint.value}
              </div>
            )} */}
          </div>
        )}

        {/* Message Content */}
        <div className="w-full break-words text-sm">{content}</div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <ImageModal
          src={selectedImage}
          alt="Enlarged view"
          onClose={() => setSelectedImage(null)}
        />
      )}
    </>
  );
};
