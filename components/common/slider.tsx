"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { motion } from "framer-motion";
import { type ReactElement, useRef, useState } from "react";

export interface SlideItemProps {
    goToNextSlide: () => void;
    goToPreviousSlide: () => void;
}

interface SliderProps {
    items: Array<{
        SlideItem: React.FC<{ goToNextSlide: () => void; goToPreviousSlide: () => void }>;
    }>;
}

export const Slider = ({ items }: SliderProps): ReactElement => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const wrapperWidth = wrapperRef.current?.clientWidth ?? 0;

    const [currentSlide, setCurrentSlide] = useState(0);

    const handleNext = (): void => {
        if (currentSlide === items.length - 1) return;
        if (currentSlide === items.length) return;
        setCurrentSlide((prev) => prev + 1);
    };

    const handlePrevious = (): void => {
        if (currentSlide === 0) return;
        if (currentSlide === items.length) return;
        setCurrentSlide((prev) => prev - 1);
    };

    return (
        <div ref={wrapperRef} className="relative flex h-full flex-col overflow-hidden">
            <motion.div
                className="flex h-full grow items-stretch "
                animate={{ translateX: -currentSlide * wrapperWidth }}
                transition={{
                    damping: 20,
                    duration: 0.3,
                    type: "spring",
                    stiffness: 100,
                }}
            >
                {items.map(({ SlideItem }, index) => {
                    return <SlideItem goToNextSlide={handleNext} goToPreviousSlide={handlePrevious} key={index} />;
                })}
            </motion.div>
        </div>
    );
};
