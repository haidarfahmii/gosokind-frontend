import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="fixed top-0 w-full z-50 bg-[#0a0c14]/80 backdrop-blur-md border-b border-white/10 text-white px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/" className="text-2xl font-bold tracking-tighter flex items-center gap-2">
                        <span className="bg-blue-500 p-1 rounded">G</span> GOSOKIND
                    </Link>
                    <div className="hidden md:flex gap-6 text-sm font-medium">
                        <Link href="#beranda" className="hover:text-blue-400">Beranda</Link>
                        <Link href="#layanan" className="hover:text-blue-400">Layanan</Link>
                        <Link href="#harga" className="hover:text-blue-400">Harga</Link>
                        <Link href="#tentang" className="hover:text-blue-400">Tentang Kami</Link>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/login" className="text-sm hover:text-blue-400">Masuk</Link>
                    <Link href="/register" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full text-sm font-semibold transition">
                        Daftar Sekarang
                    </Link>
                </div>
            </div>
        </nav>
    );
}