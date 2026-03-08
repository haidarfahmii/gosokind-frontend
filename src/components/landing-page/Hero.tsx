"use client";

import { useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import Link from "next/link"; // 1. Import komponen Link
// Import Swiper React components & Modules
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, EffectFade } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const slides = [
    {
        badge: "Layanan #1 di Indonesia",
        title: <>Pakaian Rapi <br /> Tanpa Repot</>,
        description: "Serahkan urusan setrika pakaian Anda kepada ahli kami. Dijamin rapi, wangi, dan licin sepanjang hari.",
        primaryBtn: "Pesan Sekarang",
        secondaryBtn: "Pelajari Lebih Lanjut"
    },
    {
        badge: "Kualitas Premium",
        title: <>Wangi Segar <br /> Tahan Lama</>,
        description: "Menggunakan parfum premium yang tahan lama dan aman untuk serat kain pakaian kesayangan Anda.",
        primaryBtn: "Pesan Sekarang",
        secondaryBtn: "Cek Harga"
    },
    {
        badge: "Layanan Ekspres",
        title: <>Selesai Kilat <br /> Dalam 6 Jam</>,
        description: "Butuh pakaian segera? Gunakan layanan ekspres kami untuk hasil maksimal dalam waktu singkat.",
        primaryBtn: "Pesan Sekarang",
        secondaryBtn: "Syarat & Ketentuan"
    }
];

export default function Hero() {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <section className="relative min-h-dvh flex items-center justify-center bg-[#0a0c14] text-white pt-20 overflow-hidden">

            {/* Background Blur Effect */}
            <div
                className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-blue-600/20 blur-[100px] md:blur-[120px] rounded-full transition-transform duration-1000 ease-out z-0"
                style={{ transform: `translateX(${activeIndex * 20}px)` }}
            />

            <div className="w-full max-w-7xl mx-auto h-full z-10 flex items-center justify-center">
                <Swiper
                    modules={[Autoplay, Navigation, Pagination, EffectFade]}
                    effect="fade"
                    fadeEffect={{ crossFade: true }}
                    speed={800}
                    navigation={true}
                    pagination={{
                        clickable: true,
                        dynamicBullets: true,
                    }}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    loop={true}
                    onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                    className="w-full h-full"
                    style={{
                        "--swiper-navigation-color": "#ffffff",
                        "--swiper-navigation-size": "24px",
                        "--swiper-pagination-color": "#2563eb",
                        "--swiper-pagination-bullet-inactive-color": "#ffffff",
                        "--swiper-pagination-bullet-inactive-opacity": "0.3",
                    } as React.CSSProperties}
                >
                    {slides.map((slide, index) => (
                        <SwiperSlide key={index}>
                            <div className="flex h-full w-full flex-col items-center justify-center px-6 sm:px-12 pb-12 pt-4">
                                <div className="relative z-10 w-full max-w-4xl mx-auto text-center flex flex-col items-center justify-center min-h-[50vh]">
                                    <span className="inline-block px-4 py-1.5 mb-4 md:mb-6 text-xs font-bold tracking-widest text-blue-400 uppercase bg-blue-400/10 rounded-full">
                                        {slide.badge}
                                    </span>
                                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-tight">
                                        {slide.title}
                                    </h1>
                                    <p className="text-gray-400 text-base sm:text-lg md:text-xl mb-8 md:mb-10 max-w-2xl mx-auto">
                                        {slide.description}
                                    </p>

                                    {/* 2. Ubah Button menjadi Link */}
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
                                        {/* Primary Button mengarah ke /home */}
                                        <Link
                                            href="/home"
                                            className="group w-full sm:w-auto bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-full font-bold text-base sm:text-lg transition flex items-center justify-center gap-2"
                                        >
                                            {slide.primaryBtn}
                                            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                                        </Link>

                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}