import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0a0c14] text-white border-t border-white/10 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div>
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="bg-blue-500 p-1 rounded text-sm">G</span> GOSOKIND
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            GOSOKIND adalah platform layanan setrika dan laundry on-demand terdepan yang menghubungkan Anda dengan mitra profesional untuk pakaian yang lebih rapi.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-6">Tautan Cepat</h4>
          <ul className="space-y-4 text-gray-400 text-sm">
            <li><Link href="/" className="hover:text-blue-400 transition">Beranda</Link></li>
            <li><Link href="/layanan" className="hover:text-blue-400 transition">Layanan Kami</Link></li>
            <li><Link href="/harga" className="hover:text-blue-400 transition">Harga Paket</Link></li>
            <li><Link href="/syarat" className="hover:text-blue-400 transition">Syarat & Ketentuan</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6">Layanan</h4>
          <ul className="space-y-4 text-gray-400 text-sm">
            <li>Paket Lengkap</li>
            <li>Cuci & Lipat</li>
            <li>Cuci & Setrika</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6">Hubungi Kami</h4>
          <ul className="space-y-4 text-gray-400 text-sm">
            <li className="flex items-start gap-3">
              <span>📍</span> Jl. Teknologi No. 12, Jakarta Selatan, Indonesia 12345
            </li>
            <li className="flex items-center gap-3">
              <span>📞</span> +62 812 3456 7890
            </li>
            <li className="flex items-center gap-3">
              <span>📧</span> support@gosokind.com
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 pt-10 border-t border-white/10 flex flex-col md:row justify-between items-center gap-4 text-gray-500 text-xs">
        <p>© 2026 GOSOKIND. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}