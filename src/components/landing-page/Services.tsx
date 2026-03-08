"use client";

import { FiLayers, FiWind, FiBox, FiCalendar } from "react-icons/fi"; // Mengganti FiClock menjadi FiCalendar

const services = [
    {
        icon: <FiLayers className="w-8 h-8" />,
        title: "Cuci & Setrika",
        description: "Jadwalkan layanan komplit untuk pakaian sehari-hari Anda. Pakaian dicuci bersih, wangi, dan disetrika licin siap pakai."
    },
    {
        icon: <FiWind className="w-8 h-8" />,
        title: "Setrika Saja",
        description: "Sudah mencuci sendiri? Jadwalkan layanan menyetrika kami. Hasil rapi tanpa garis lipatan ganda untuk hari yang Anda tentukan."
    },
    {
        icon: <FiBox className="w-8 h-8" />,
        title: "Cuci & Lipat",
        description: "Jadwalkan pencucian untuk pakaian santai yang tidak perlu disetrika. Dicuci bersih, kering, dan dilipat rapi saat diantar."
    },
    {
        icon: <FiCalendar className="w-8 h-8" />, // Menggunakan ikon kalender
        title: "Jadwal Fleksibel",
        description: "Atur sendiri hari dan waktu penjemputan serta pengantaran pakaian menyesuaikan dengan kesibukan aktivitas Anda."
    }
];

export default function Services() {
    return (
        <section id="services" className="py-24 bg-slate-50 relative overflow-hidden">
            {/* Background Gradient Accent */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-blue-600 font-semibold tracking-wider text-sm uppercase">Penjadwalan Layanan</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-black mt-2 mb-4">Jadwalkan Laundry Anda dengan Mudah</h2>
                    <p className="text-gray-600">
                        Aplikasi Gosokind memungkinkan Anda untuk mengatur jadwal penjemputan dan pengantaran laundry. Pilih layanan yang sesuai dan biarkan kami merawat pakaian Anda.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((item, index) => (
                        <div key={index} className="group bg-white shadow-sm border border-slate-200 hover:border-blue-500 hover:shadow-md p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2">
                            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold text-black mb-3">{item.title}</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}