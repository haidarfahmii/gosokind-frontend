"use client";

import React, { useEffect, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { type Swiper as SwiperType } from "swiper";
// Import Swiper styles
import "swiper/css";
// Import modul Mousewheel agar bisa discroll pakai mouse di desktop
import { Mousewheel } from "swiper/modules";

interface TimePickerWheelProps {
    value: string;
    onChange: (value: string) => void;
    options: string[];
}

export function TimePickerWheel({ value, onChange, options }: TimePickerWheelProps) {
    // Cari index awal berdasarkan value
    const initialIndex = options.indexOf(value) > -1 ? options.indexOf(value) : 0;

    // Simpan instance swiper untuk kontrol manual jika perlu
    const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

    // Sinkronisasi jika value berubah dari luar (misal reset form)
    useEffect(() => {
        if (swiperInstance && !swiperInstance.destroyed) {
            const index = options.indexOf(value);
            if (index > -1 && index !== swiperInstance.activeIndex) {
                swiperInstance.slideTo(index);
            }
        }
    }, [value, options, swiperInstance]);

    return (
        <div className="relative h-48 w-full bg-slate-50 rounded-xl border border-slate-200 overflow-hidden select-none">
            {/* --- Visual Overlays (Tetap Sama) --- */}
            {/* Gradient Atas */}
            <div className="absolute top-0 left-0 right-0 h-16 bg-linear-to-b from-slate-50 to-transparent z-10 pointer-events-none" />

            {/* Gradient Bawah */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-slate-50 to-transparent z-10 pointer-events-none" />

            {/* Highlighter Tengah */}
            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-12 bg-blue-100/50 border-y border-blue-200 z-0 pointer-events-none" />

            {/* --- SWIPER COMPONENT --- */}
            <Swiper
                modules={[Mousewheel]}
                direction={"vertical"}     // Mode Vertikal (Wheel)
                slidesPerView={4}          // Tampilkan 5 item (agar yang tengah pas di index 2)
                centeredSlides={true}      // Item aktif selalu di tengah
                spaceBetween={0}
                mousewheel={true}          // Support scroll mouse
                initialSlide={initialIndex} // Posisi awal
                className="h-full w-full"
                onSwiper={setSwiperInstance} // Simpan instance
                onSlideChange={(swiper) => {
                    // Update value hanya saat slide berhenti/berubah
                    const selectedOption = options[swiper.activeIndex];
                    if (selectedOption) {
                        onChange(selectedOption);
                    }
                }}
            >
                {options.map((option, index) => (
                    <SwiperSlide key={index} className="flex items-center justify-center">
                        {({ isActive }) => (
                            <div
                                className={`transition-all duration-300 ease-out flex items-center justify-center h-12 w-full cursor-grab active:cursor-grabbing
                                    ${isActive
                                        ? "text-xl font-bold text-blue-600 scale-110 opacity-100"
                                        : "text-sm font-medium text-slate-400 scale-90 opacity-50"
                                    }
                                `}
                            >
                                {option} {option !== "Sekarang" && "WIB"}
                            </div>
                        )}
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}