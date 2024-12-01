import React from "react";
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
import Image from "next/image";

interface ResponseWidgetProps {
  images: string[];
  timeSeriesData?: DataPoint[];
  content: string;
}

export const ResponseWidget: React.FC<ResponseWidgetProps> = ({
  images,
  timeSeriesData,
  content,
}) => {
  const [hoveredPoint, setHoveredPoint] = React.useState<DataPoint | null>(
    null,
  );

  return (
    <div className="flex w-full flex-col items-start gap-4">
      {/* Image Carousel */}
      <div className="w-full max-w-[600px]">
        <Carousel
          opts={{
            align: "start",
            slidesToScroll: 1,
            containScroll: "trimSnaps",
          }}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {images.map((image, index) => (
              <CarouselItem key={index} className="basis-1/2 pl-2 md:pl-4">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={image}
                    alt={`Carousel image ${index + 1}`}
                    fill
                    className="rounded-lg object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={index < 2}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>

      {/* Time Series Chart */}
      {timeSeriesData && (
        <div className="w-full">
          <TimeSeriesChart
            data={timeSeriesData}
            height={200}
            onPointHover={setHoveredPoint}
          />
          {hoveredPoint && (
            <div className="text-muted-foreground mt-2 text-sm">
              Selected point:{" "}
              {new Date(hoveredPoint.timestamp).toLocaleString()} - Value:{" "}
              {hoveredPoint.value}
            </div>
          )}
        </div>
      )}

      {/* Message Content */}
      <div className="text-sm">{content}</div>
    </div>
  );
};
