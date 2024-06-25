import { NavLink } from 'react-router-dom';
const LandingPage = () => {

    return (<div>
        {/* Hero Section */}
        <section className="bg-purple-600 bg-center text-white py-20" style={{ backgroundImage: "url(https://cms.disway.id/uploads/7587a2e0616397c1978b997c0a9fb676.jpg)" }}>
            <div className="container mx-auto text-center">
                <h1 className="text-5xl font-bold mb-4">Selamat Datang di Rumah Sakit Kami</h1>
                <p className="text-xl mb-8">Memberikan perawatan penuh kasih untuk kesehatan dan kesejahteraan Anda.</p>
                <NavLink className="bg-white text-black font-bold py-2 px-4 rounded-full border-2 border-purple-400" to="/pendaftaran">
                    Daftar
                </NavLink>
            </div>
        </section>

        {/* Services Section */}
        {/* <section className="py-20">
            <div className="container mx-auto text-center">
                <h2 className="text-4xl font-bold mb-8">Layanan Kami</h2>
                <div className="flex flex-wrap justify-center">
                    <div className="w-full md:w-1/3 p-4">
                        <div className="border p-6 rounded-lg">
                            <h3 className="text-2xl font-bold mb-4">Pemeriksaan Umum</h3>
                            <p className="text-gray-700">Pemeriksaan rutin dan skrining kesehatan untuk menjaga kesehatan optimal Anda.</p>
                        </div>
                    </div>
                    <div className="w-full md:w-1/3 p-4">
                        <div className="border p-6 rounded-lg">
                            <h3 className="text-2xl font-bold mb-4">Perawatan Darurat</h3>
                            <p className="text-gray-700">Layanan darurat 24/7 untuk kebutuhan medis yang mendesak.</p>
                        </div>
                    </div>
                    <div className="w-full md:w-1/3 p-4">
                        <div className="border p-6 rounded-lg">
                            <h3 className="text-2xl font-bold mb-4">Pengobatan Spesialis</h3>
                            <p className="text-gray-700">Perawatan lanjutan untuk kondisi kesehatan tertentu.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section> */}

        {/* Contact Section */}
        <section className="bg-gray-100 py-20">
            <div className="container mx-auto text-center">
                <h2 className="text-4xl font-bold mb-8">Hubungi Kami</h2>
                <p className="text-xl mb-2">Punya pertanyaan atau perlu menjadwalkan janji? Hubungi kami!</p>
                <p className=' w-auto max-w-40 rounded-md text-black p-4 text-2xl flex mx-auto items-center justify-center border'>081234567890</p>
            </div>
        </section>
    </div>);
}

export default LandingPage;