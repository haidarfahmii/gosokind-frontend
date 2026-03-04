"use client";

import { FiLayers, FiWind, FiBox, FiClock } from "react-icons/fi";

const services = [
    {
        icon: <FiLayers className="w-8 h-8" />,
        title: "Cuci & Setrika",
        description: "Layanan komplit untuk pakaian sehari-hari. Pakaian dicuci bersih, wangi, dan disetrika licin siap pakai."
    },
    {
        icon: <FiWind className="w-8 h-8" />,
        title: "Setrika Saja",
        description: "Sudah mencuci sendiri? Serahkan urusan menyetrika kepada kami. Hasil rapi tanpa garis lipatan ganda."
    },
    {
        icon: <FiBox className="w-8 h-8" />,
        title: "Cuci & Lipat",
        description: "Cocok untuk pakaian santai yang tidak perlu disetrika. Dicuci bersih, kering, dan dilipat rapi."
    },
    {
        icon: <FiClock className="w-8 h-8" />,
        title: "Layanan Ekspres",
        description: "Butuh cepat? Layanan prioritas dengan jaminan selesai dalam hitungan jam tanpa mengurangi kualitas."
    }
];

export default function Services() {
    return (
        <section id="layanan" className="py-24 bg-slate-50 relative overflow-hidden">
            {/* Background Gradient Accent */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-blue-500 font-semibold tracking-wider text-sm uppercase">Layanan Kami</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-black mt-2 mb-4">Solusi Pakaian Rapi untuk Anda</h2>
                    <p className="text-gray-400">Pilih layanan yang sesuai dengan kebutuhan Anda. Kami menangani setiap potong pakaian dengan perawatan terbaik.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((item, index) => (
                        <div key={index} className="group bg-black border border-white/10 hover:border-blue-500/50 p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2">
                            <div className="w-14 h-14 bg-blue-600/20 text-blue-400 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}