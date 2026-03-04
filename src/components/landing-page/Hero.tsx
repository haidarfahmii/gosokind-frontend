"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { FiChevronLeft, FiChevronRight, FiArrowRight } from "react-icons/fi";

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

const extendedSlides = [slides[slides.length - 1], ...slides, slides[0]];

export default function Hero() {
    const [currentIndex, setCurrentIndex] = useState(1);
    const [isTransitioning, setIsTransitioning] = useState(false); // Default false agar bisa diklik pertama kali
    const [useAnimation, setUseAnimation] = useState(true);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const move = (step: number) => {
        if (isTransitioning) return;
        setUseAnimation(true);
        setIsTransitioning(true);
        setCurrentIndex(prev => prev + step);
    };

    const handleTransitionEnd = () => {
        setIsTransitioning(false);
        if (currentIndex === 0 || currentIndex === extendedSlides.length - 1) {
            setUseAnimation(false);
            setCurrentIndex(currentIndex === 0 ? extendedSlides.length - 2 : 1);
        }
    };

    useEffect(() => {
        timerRef.current = setInterval(() => move(1), 5000);
        return () => clearInterval(timerRef.current!);
    }, [currentIndex, isTransitioning]);

    return (
        <section className="relative min-h-screen flex items-center justify-center bg-[#0a0c14] text-white pt-20 overflow-hidden">

            <div
                className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full transition-transform duration-1000 ease-out"
                style={{ transform: `translateX(${(currentIndex - 1) * 20}px)` }}
            />

            <div
                className={`flex h-full ${useAnimation ? "transition-transform duration-700 ease-in-out" : "transition-none"}`}
                style={{
                    transform: `translateX(-${currentIndex * 100}%)`,
                    width: `${extendedSlides.length * 100}%`
                }}
                onTransitionEnd={handleTransitionEnd}
            >
                {extendedSlides.map((slide, index) => (
                    <div key={index} className="w-full shrink-0 flex items-center justify-center px-6">
                        <div className="relative z-10 max-w-4xl text-center">
                            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-blue-400 uppercase bg-blue-400/10 rounded-full">
                                {slide.badge}
                            </span>
                            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                                {slide.title}
                            </h1>
                            <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
                                {slide.description}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button className="group bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-full font-bold text-lg transition flex items-center justify-center gap-2">
                                    {slide.primaryBtn}
                                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button className="border border-white/20 hover:bg-white/10 px-8 py-4 rounded-full font-bold text-lg transition">
                                    {slide.secondaryBtn}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            {[-1, 1].map(dir => (
                <button key={dir} onClick={() => move(dir)} disabled={isTransitioning}
                    className={`absolute z-20 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition hidden md:block disabled:opacity-50 ${dir === -1 ? 'left-6' : 'right-6'}`}>
                    {dir === -1 ? <FiChevronLeft size={24} /> : <FiChevronRight size={24} />}
                </button>
            ))}

            {/* Indicators */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                {slides.map((_, i) => (
                    <button key={i} onClick={() => { setUseAnimation(true); setCurrentIndex(i + 1); }}
                        className={`h-2 transition-all duration-300 rounded-full ${((currentIndex - 1 + slides.length) % slides.length === i) ? "w-8 bg-blue-600" : "w-2 bg-white/20"}`} />
                ))}
            </div>
        </section>
    );
}