import React, { useState, useEffect } from 'react';

function Pendaftaran() {
    // step 1
    const [nama_pasien, setNamaPasien] = useState('');
    const [tanggal_lahir, setTanggalLahir] = useState('');
    const [jenis_kelamin, setJenisKelamin] = useState('');
    const [alamat, setAlamat] = useState('');
    const [no_ktp, setNoKtp] = useState('');
    const [no_telepon, setNoTelepon] = useState('');

    // step 2
    const [poliklinik, setPoliklinik] = useState('');
    const [dokter_id, setDokter] = useState(0);
    const [tanggal_reservasi, setTanggalReservasi] = useState('');
    const [jam_reservasi, setJamReservasi] = useState('');
    const [tipe_pembayaran, setTipePembayaran] = useState('');

    const [step, setStep] = useState(1);

    const [dokterOptions, setDokterOptions] = useState([]);
    const [jadwalPraktekOptions, setJadwalPraktekOptions] = useState([]);

    useEffect(() => {
        // Fetch dokter data
        fetch('http://localhost:3000/dokter')
            .then(response => response.json())
            .then(data => {
                setDokterOptions(data);
                
            })
            .catch(error => {
                console.error('Error fetching dokter data:', error);
            });

        // Fetch jadwalPraktek data
        fetch('http://localhost:3000/jadwalPraktek')
            .then(response => response.json())
            .then(data => {
                setJadwalPraktekOptions(data);
            })
            .catch(error => {
                console.error('Error fetching jadwalPraktek data:', error);
            });

        console.log(dokterOptions)
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('http://localhost:3000/pendaftaran', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nama_pasien,
                tanggal_lahir,
                jenis_kelamin,
                alamat,
                no_ktp,
                no_telepon,
                poliklinik,
                dokter_id,
                tanggal_reservasi,
                jam_reservasi,
                tipe_pembayaran
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log('Pendaftaran berhasil:', data);
                // Reset form fields
                setNamaPasien('');
                setTanggalLahir('');
                setJenisKelamin('');
                setAlamat('');
                setNoKtp('');
                setNoTelepon('');
                setPoliklinik('');
                setDokter('');
                setTanggalReservasi('');
                setJamReservasi('');
                setTipePembayaran('');
                setStep(1); // Kembali ke langkah pertama
            })
            .catch(error => {
                console.error('Ada kesalahan dalam pendaftaran!', error);
            });
    };

    const handleNextStep = () => {
        setStep(step + 1);
    };

    const handlePreviousStep = () => {
        setStep(step - 1);
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
            {step === 1 && (
                <>
                    <div className='flex items-center justify-between mb-4'>
                        <h1 className="text-2xl font-bold">Data Diri Pasien</h1>
                        <p>Step 1 dari 3</p>
                    </div>

                    <form>
                        <div className="mb-4">
                            <label className="block text-gray-700">Nama Pasien:</label>
                            <input
                                type="text"
                                value={nama_pasien}
                                onChange={(e) => setNamaPasien(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Tanggal Lahir:</label>
                            <input
                                type="date"
                                value={tanggal_lahir}
                                onChange={(e) => setTanggalLahir(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Jenis Kelamin:</label>
                            <select
                                value={jenis_kelamin}
                                onChange={(e) => setJenisKelamin(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Pilih</option>
                                <option value="Laki-laki">Laki-laki</option>
                                <option value="Perempuan">Perempuan</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Alamat:</label>
                            <textarea
                                value={alamat}
                                onChange={(e) => setAlamat(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">No KTP:</label>
                            <input
                                type="text"
                                value={no_ktp}
                                onChange={(e) => setNoKtp(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">No Telepon:</label>
                            <input
                                type="text"
                                value={no_telepon}
                                onChange={(e) => setNoTelepon(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleNextStep}
                            className="w-full bg-black text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Lanjut
                        </button>
                    </form>
                </>
            )}
            {step === 2 && (
                <>
                    <div className='flex items-center justify-between mb-4'>
                        <h1 className="text-2xl font-bold">Pendaftaran</h1>
                        <p>Step 2 dari 3</p>
                    </div>

                    <form>
                        <div className="mb-4">
                            <label className="block text-gray-700">Poliklinik</label>
                            <select
                                value={poliklinik}
                                onChange={(e) => setPoliklinik(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Pilih</option>
                                {dokterOptions.map((dokterOption, index) => (
                                    <option key={index} value={dokterOption.spesialisasi}>Klinik {dokterOption.spesialisasi}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Dokter</label>
                            <select
                                value={dokter_id}
                                onChange={(e) => setDokter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={poliklinik === ''}
                            >
                                <option value="">Pilih</option>
                                {dokterOptions.map((dokterOption, index) => (
                                    poliklinik === dokterOption.spesialisasi && (
                                        <option key={index} value={dokterOption.dokter_id}>{dokterOption.nama_dokter}</option>
                                    )
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Tanggal Reservasi:</label>
                            <input
                                type="date"
                                value={tanggal_reservasi}
                                min={dokter_id && jadwalPraktekOptions[dokter_id] ? new Date(new Date(jadwalPraktekOptions[dokter_id].tanggal).setDate(new Date(jadwalPraktekOptions[dokter_id].tanggal).getDate() + 1)).toISOString().split('T')[0] : ''}
                                onChange={(e) => setTanggalReservasi(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Jam Reservasi</label>
                            <input
                                type="time"
                                value={jam_reservasi}
                                onChange={(e) => setJamReservasi(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Tipe Pembayaran</label>
                            <select
                                value={tipe_pembayaran}
                                onChange={(e) => setTipePembayaran(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Pilih</option>
                                <option value="Asuransi">Asuransi</option>
                                <option value="Mandiri">Mandiri</option>
                            </select>
                        </div>
                        <div className="flex justify-between">
                            <button
                                type="button"
                                onClick={handlePreviousStep}
                                className="w-full mr-2 bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Kembali
                            </button>
                            <button
                                type="button"
                                onClick={handleNextStep}
                                className="w-full ml-2 bg-black text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Lanjut
                            </button>
                        </div>
                    </form>
                </>
            )}
            {step === 3 && (
                <>
                    <div className='flex items-center justify-between mb-4'>
                        <h1 className="text-2xl font-bold">Ringkasan Data</h1>
                        <p>Step 3 dari 3</p>
                    </div>

                    <div>
                        <p><strong>Nama Pasien:</strong> {nama_pasien}</p>
                        <p><strong>Tanggal Lahir:</strong> {tanggal_lahir}</p>
                        <p><strong>Jenis Kelamin:</strong> {jenis_kelamin}</p>
                        <p><strong>Alamat:</strong> {alamat}</p>
                        <p><strong>No KTP:</strong> {no_ktp}</p>
                        <p><strong>No Telepon:</strong> {no_telepon}</p>
                        <p><strong>Poliklinik:</strong> {poliklinik}</p>
                        <p><strong>Dokter:</strong> {dokterOptions.find(d => d.dokter_id == dokter_id)?.nama_dokter}</p>
                        <p><strong>Tanggal Reservasi:</strong> {tanggal_reservasi}</p>
                        <p><strong>Jam Reservasi:</strong> {jam_reservasi}</p>
                        <p><strong>Tipe Pembayaran:</strong> {tipe_pembayaran}</p>
                    </div>

                    <div className="flex justify-between mt-4">
                        <button
                            type="button"
                            onClick={handlePreviousStep}
                            className="w-full mr-2 bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Kembali
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="w-full ml-2 bg-black text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Submit
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default Pendaftaran;
