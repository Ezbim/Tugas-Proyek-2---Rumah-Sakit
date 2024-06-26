import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MdPrint } from 'react-icons/md';

function Pendaftaran() {
    const [isPasienBaru, setIsPasienBaru] = useState(true); // New state to track if the patient is new or returning
    const [nama_pasien, setNamaPasien] = useState('');
    const [tanggal_lahir, setTanggalLahir] = useState('');
    const [jenis_kelamin, setJenisKelamin] = useState('');
    const [alamat, setAlamat] = useState('');
    const [no_ktp, setNoKtp] = useState('');
    const [no_telepon, setNoTelepon] = useState('');
    const [pasien_id, setPasienId] = useState(''); // State for patient ID if they are a returning patient
    const [poliklinik, setPoliklinik] = useState(0);
    const [dokter_id, setDokter] = useState(0);
    const [tipe_pembayaran, setTipePembayaran] = useState('');
    const [step, setStep] = useState(1);
    const [dokterOptions, setDokterOptions] = useState([]);
    const [poliklinikOption, setPoliklinikOption] = useState([]);
    const [pasienData, setPasienData] = useState([])
    const [tarif, setTarif] = useState('')
    const [registrationData, setRegistrationData] = useState('');
    const [errors, setErrors] = useState({});
    const [pasienDat, setPasienDat] = useState([])
    useEffect(() => {
        if (poliklinik == 1) {
            setTarif(1)
        } else if (poliklinik == 2) {
            setTarif(2)
        } else if (poliklinik == 3) {
            setTarif(3)
        }
    }, [poliklinik])

    useEffect(() => {
        fetch('http://localhost:3000/dokter')
            .then(response => response.json())
            .then(data => setDokterOptions(data))
            .catch(error => console.error('Error fetching dokter data:', error));
    }, []);
    useEffect(() => {
        fetch('http://localhost:3000/pasien')
            .then(response => response.json())
            .then(data => setPasienDat(data))
            .catch(error => console.error('Error fetching dokter data:', error));
    }, []);

    useEffect(() => {
        fetch('http://localhost:3000/poliklinik')
            .then(response => response.json())
            .then(data => setPoliklinikOption(data))
            .catch(error => console.error('Error fetching poliklinik data:', error));
    }, []);
    

    const validateStep1 = () => {
        const newErrors = {};
        if (isPasienBaru) {
            if (!nama_pasien) newErrors.nama_pasien = 'Nama Pasien wajib diisi';
            if (!tanggal_lahir) newErrors.tanggal_lahir = 'Tanggal Lahir wajib diisi';
            if (!jenis_kelamin) newErrors.jenis_kelamin = 'Jenis Kelamin wajib diisi';
            if (!alamat) newErrors.alamat = 'Alamat wajib diisi';
            if (!no_ktp) newErrors.no_ktp = 'No KTP wajib diisi';
            if (!no_telepon) newErrors.no_telepon = 'No Telepon wajib diisi';
        } else {
            if (!pasien_id) newErrors.pasien_id = 'ID Pasien wajib diisi';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors = {};
        if (!poliklinik) newErrors.poliklinik = 'Poliklinik wajib dipilih';
        if (!dokter_id) newErrors.dokter_id = 'Dokter wajib dipilih';
        if (!tipe_pembayaran) newErrors.tipe_pembayaran = 'Tipe Pembayaran wajib dipilih';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateStep1() || !validateStep2()) return;
        const data = isPasienBaru
            ? { nama_pasien, tanggal_lahir, jenis_kelamin, alamat, no_ktp, no_telepon, poliklinik, dokter_id, tipe_pembayaran, tarif }
            : { pasien_id, poliklinik, dokter_id, tipe_pembayaran, tarif };

        fetch('http://localhost:3000/pendaftaran', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Pendaftaran berhasil:', data);
                setRegistrationData(data);
                setStep(4);
            })
            .catch(error => console.error('Ada kesalahan dalam pendaftaran!', error));


    };

    useEffect(() => {
        console.log(pasienData)
    }, [pasienData])

    const handleNextStep = async () => {
        if (step === 1) {
            if (!validateStep1()) return;

            if (!isPasienBaru) {
                try {
                    const response = await fetch(`http://localhost:3000/pasien/${pasien_id}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch patient details');
                    }
                    const data = await response.json();
                    // Assuming data is an array and you need the first item
                    setPasienData(data)

                } catch (error) {
                    setErrors({ pasien_id: 'Error fetching patient details' });
                }
            }
        } else if (step === 2) {
            if (!validateStep2()) return;
        }
        setStep(step + 1);
    };

    const handlePreviousStep = () => {
        setStep(step - 1);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return date.toLocaleDateString('id-ID', options);
    };
    const [isVisible, setIsVisible] = useState(false);
    const boxRef = useRef(null);

    const handleToggle = () => {

        setIsVisible(!isVisible);
    };

    const handleBlur = (event) => {
        if (boxRef.current && !boxRef.current.contains(event.relatedTarget)) {
            setIsVisible(false);
        }

    };

    useEffect(() => {
        if (isVisible && boxRef.current) {
            boxRef.current.focus();
        }
    }, [isVisible]);

    useEffect(()=>{
        console.log(registrationData)
    },[registrationData])


    return (
        <>
            <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">

                {step === 1 && (
                    <>
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-2xl font-bold">Pendaftaran Pasien</h1>
                            <p>Step 1 dari 3</p>
                        </div>
                        <form>
                            <div className="mb-4">
                                <label className="block text-gray-700">Jenis Pasien:</label>
                                <select
                                    value={isPasienBaru ? "baru" : "lama"}
                                    onChange={(e) => setIsPasienBaru(e.target.value === "baru")}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="baru">Pasien Baru</option>
                                    <option value="lama">Pasien Lama</option>
                                </select>
                            </div>
                            {isPasienBaru ? (
                                <>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Nama Pasien:</label>
                                        <input
                                            type="text"
                                            value={nama_pasien}
                                            onChange={(e) => setNamaPasien(e.target.value)}
                                            className={`w-full px-3 py-2 border ${errors.nama_pasien ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500`}
                                        />
                                        {errors.nama_pasien && <p className="text-red-500 text-sm">{errors.nama_pasien}</p>}
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Tanggal Lahir:</label>
                                        <input
                                            type="date"
                                            value={tanggal_lahir}
                                            onChange={(e) => setTanggalLahir(e.target.value)}
                                            className={`w-full px-3 py-2 border ${errors.tanggal_lahir ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500`}
                                        />
                                        {errors.tanggal_lahir && <p className="text-red-500 text-sm">{errors.tanggal_lahir}</p>}
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Jenis Kelamin:</label>
                                        <select
                                            value={jenis_kelamin}
                                            onChange={(e) => setJenisKelamin(e.target.value)}
                                            className={`w-full px-3 py-2 border ${errors.jenis_kelamin ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500`}
                                        >
                                            <option value="">Pilih</option>
                                            <option value="Laki-laki">Laki-laki</option>
                                            <option value="Perempuan">Perempuan</option>
                                        </select>
                                        {errors.jenis_kelamin && <p className="text-red-500 text-sm">{errors.jenis_kelamin}</p>}
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Alamat:</label>
                                        <textarea
                                            value={alamat}
                                            onChange={(e) => setAlamat(e.target.value)}
                                            className={`w-full px-3 py-2 border ${errors.alamat ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500`}
                                        />
                                        {errors.alamat && <p className="text-red-500 text-sm">{errors.alamat}</p>}
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">No KTP:</label>
                                        <input
                                            type="text"
                                            value={no_ktp}
                                            onChange={(e) => setNoKtp(e.target.value)}
                                            className={`w-full px-3 py-2 border ${errors.no_ktp ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500`}
                                        />
                                        {errors.no_ktp && <p className="text-red-500 text-sm">{errors.no_ktp}</p>}
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">No Telepon:</label>
                                        <input
                                            type="text"
                                            value={no_telepon}
                                            onChange={(e) => setNoTelepon(e.target.value)}
                                            className={`w-full px-3 py-2 border ${errors.no_telepon ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500`}
                                        />
                                        {errors.no_telepon && <p className="text-red-500 text-sm">{errors.no_telepon}</p>}
                                    </div>
                                </>
                            ) : (
                                <div className="mb-4">
                                    <label className="block text-gray-700">NIP Pasien:</label>
                                    <input
                                        type="text"
                                        value={pasien_id}
                                        onChange={(e) => setPasienId(Number(e.target.value))}
                                        className={`w-full px-3 py-2 border ${errors.pasien_id ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500`}
                                    />
                                    {errors.pasien_id && <p className="text-red-500 text-sm">{errors.pasien_id}</p>}
                                </div>
                            )}
                        </form>
                    </>
                )}
                {step === 2 && (
                    <>
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-2xl font-bold">Pendaftaran Pasien </h1>
                            <p>Step 2 dari 3</p>
                        </div>
                        <form>
                            <div className="mb-4">
                                <label className="block text-gray-700">Pilih Poliklinik:</label>
                                <select
                                    value={poliklinik}
                                    onChange={(e) => setPoliklinik(Number(e.target.value))}
                                    className={`w-full px-3 py-2 border ${errors.poliklinik ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500`}
                                >
                                    <option value="">Pilih</option>
                                    {poliklinikOption.map((poliklinikOption, index) => (
                                        <option key={index} value={poliklinikOption.poliklinik_id}>
                                            Klinik {poliklinikOption.nama_poliklinik}
                                        </option>
                                    ))}
                                </select>
                                {errors.poliklinik && <p className="text-red-500 text-sm">{errors.poliklinik}</p>}
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Pilih Dokter:</label>
                                <select
                                    value={dokter_id}
                                    onChange={(e) => setDokter(Number(e.target.value))}
                                    className={`w-full px-3 py-2 border ${errors.dokter_id ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500`}
                                >
                                    <option value="">Pilih</option>
                                    {dokterOptions.map((dokterOption, index) => (
                                        poliklinik === dokterOption.poliklinik_id && (
                                            <option key={index} value={dokterOption.dokter_id}>
                                                {dokterOption.nama_dokter}
                                            </option>
                                        )
                                    ))}
                                </select>
                                {errors.dokter_id && <p className="text-red-500 text-sm">{errors.dokter_id}</p>}
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Tipe Pembayaran:</label>
                                <select
                                    value={tipe_pembayaran}
                                    onChange={(e) => setTipePembayaran(e.target.value)}
                                    className={`w-full px-3 py-2 border ${errors.tipe_pembayaran ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500`}
                                >
                                    <option value="">Pilih</option>
                                    <option value="Asuransi">Asuransi</option>
                                    <option value="Mandiri">Mandiri</option>
                                </select>
                                {errors.tipe_pembayaran && <p className="text-red-500 text-sm">{errors.tipe_pembayaran}</p>}
                            </div>
                        </form>
                    </>
                )}
                {step === 3 && (
                    <>
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-2xl font-bold">Pendaftaran Pasien</h1>
                            <p>Step 3 dari 3</p>
                        </div>
                        <div className="mb-4">
                            <h2 className="text-xl">Rincian Pendaftaran:</h2>
                            <p><strong>Nama Pasien:</strong> {isPasienBaru ? nama_pasien : pasienData[0].nama_pasien}</p>
                            {!isPasienBaru && <p><strong>ID Pasien:</strong> {!isPasienBaru ? pasien_id : "N/A"}</p>}
                            <p><strong>Poliklinik:</strong> {poliklinikOption[poliklinik - 1]?.nama_poliklinik}</p>
                            <p><strong>Dokter:</strong> {dokterOptions[dokter_id - 1]?.nama_dokter}</p>
                            <p><strong>Tipe Pembayaran:</strong> {tipe_pembayaran}</p>
                        </div>
                    </>
                )}
                {step === 4 && (
                    <>
                        <div className="relative p-4 bg-green-100 text-black-800 rounded-md flex items-center justify-between">
                            <h2 className="text-xl font-bold">Kartu Pasien Berhasil dibuat</h2>
                            <button className='p-2 border border-black rounded-lg hover:bg-gray-300' onClick={handleToggle}>Lihat kartu</button>
                            {isVisible &&
                                <div className="fixed inset-0 bg-gray-500 bg-opacity-30 flex items-center justify-center"
                                    
                                >
                                    <div className='p-5 bg-white min-w-96 h-52 relative'
                                        ref={boxRef}
                                        tabIndex={-1}
                                        onBlur={handleBlur}
                                        onFocus={() => setIsVisible(true)}
                                    >

                                        <div className='flex'>
                                            <svg className="mx-1" width="20" height="20" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M21.8907 30V27.8571C21.8907 27.5757 21.8437 27.2971 21.7524 27.037C21.6611 26.7772 21.5273 26.5409 21.3587 26.3418C21.1899 26.1428 20.9897 25.985 20.7694 25.8774C20.549 25.7697 20.3128 25.7142 20.0742 25.7142H12.8081C10.3994 25.7142 8.08932 24.5854 6.38607 22.5761C4.68285 20.5668 3.72597 17.8416 3.72593 15C3.72593 13.593 3.96085 12.1997 4.41727 10.8998C4.8737 9.59988 5.54269 8.41875 6.38605 7.42382C7.22941 6.42891 8.23061 5.63973 9.33251 5.10129C10.4344 4.56285 11.6154 4.28574 12.8081 4.28576H20.0737C20.3122 4.28584 20.5486 4.23048 20.769 4.12283C20.9894 4.01518 21.1898 3.85735 21.3584 3.65836C21.5272 3.45935 21.661 3.22309 21.7524 2.96307C21.8437 2.70304 21.8907 2.42434 21.8907 2.14288V0H12.8085C11.1388 -1.13057e-10 9.48538 0.387988 7.94274 1.14181C6.40011 1.89563 4.99844 3.00053 3.81777 4.3934C2.63709 5.78629 1.70053 7.43988 1.06156 9.25977C0.422596 11.0796 0.0937321 13.0302 0.09375 15C0.09375 18.9782 1.43333 22.7935 3.8178 25.6066C6.20228 28.4196 9.43633 30 12.8085 30H21.8907Z" fill="url(#paint0_linear_27_808)" />
                                                <path d="M7.35883 15C7.35883 16.705 7.93292 18.34 8.95482 19.5455C9.9767 20.7511 11.3627 21.4283 12.8078 21.4283H21.8907C22.8542 21.4283 23.7781 21.8799 24.4594 22.6836C25.1406 23.4873 25.5234 24.5774 25.5234 25.7141V29.9998H29.1563V25.7142C29.1563 23.441 28.3908 21.2609 27.0283 19.6533C25.6656 18.0459 23.8176 17.1429 21.8907 17.1429H12.8081C12.3264 17.1429 11.8644 16.9171 11.5237 16.5153C11.1831 16.1134 10.9917 15.5683 10.9917 15C10.9917 14.4317 11.1831 13.8866 11.5237 13.4848C11.8644 13.0829 12.3264 12.8571 12.8081 12.8571H21.8907C23.8176 12.8571 25.6656 11.9541 27.0283 10.3466C28.3908 8.73919 29.1563 6.55902 29.1563 4.28576V0H25.5229V4.28576C25.5229 5.42226 25.1402 6.51223 24.4591 7.31591C23.778 8.11959 22.8541 8.57118 21.8907 8.57136H12.8081C12.0925 8.57131 11.3839 8.73757 10.7227 9.06062C10.0616 9.38368 9.46083 9.85722 8.95482 10.4542C8.44879 11.0511 8.04741 11.7598 7.77356 12.5398C7.49972 13.3198 7.3588 14.1558 7.35883 15Z" fill="url(#paint1_linear_27_808)" />
                                                <defs>
                                                    <linearGradient id="paint0_linear_27_808" x1="3.38508" y1="15" x2="31.3506" y2="15" gradientUnits="userSpaceOnUse">
                                                        <stop stop-color="#817696" />
                                                        <stop offset="1" stop-color="#817698" />
                                                    </linearGradient>
                                                    <linearGradient id="paint1_linear_27_808" x1="3.3699" y1="14.9999" x2="31.3578" y2="14.9999" gradientUnits="userSpaceOnUse">
                                                        <stop stop-color="#8575D2" />
                                                        <stop offset="1" stop-color="#9083D5" />
                                                    </linearGradient>
                                                </defs>
                                            </svg>
                                            <p className='text-xl'>RS UPAYA SEHAT</p>
                                        </div>
                                        <div className='flex items-center p-4 w-full'>
                                            <div className="p-2 w-28 h-28 bg-gray-400"></div>
                                            <div>
                                                <div className="p-2">
                                                    ID Pasien : {registrationData.registration.pasien_id}
                                                </div>
                                                <div className="p-2">
                                                    Nama Pasien : {registrationData.registration.pasien_id}
                                                </div>
                                                <div className="p-2">
                                                    Jenis Kelamin : {registrationData.registration.pasien_id}
                                                </div>
                                            </div>
                                        </div>

                                    </div>


                                </div>
                            }
                        </div>
                        <div className='mx-auto max-w-sm border-2  my-4 p-4 rounded-md shadow-md'>
                            <div className='flex w-full justify-center items-center my-6'>
                                <svg className="mx-1" width="20" height="20" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21.8907 30V27.8571C21.8907 27.5757 21.8437 27.2971 21.7524 27.037C21.6611 26.7772 21.5273 26.5409 21.3587 26.3418C21.1899 26.1428 20.9897 25.985 20.7694 25.8774C20.549 25.7697 20.3128 25.7142 20.0742 25.7142H12.8081C10.3994 25.7142 8.08932 24.5854 6.38607 22.5761C4.68285 20.5668 3.72597 17.8416 3.72593 15C3.72593 13.593 3.96085 12.1997 4.41727 10.8998C4.8737 9.59988 5.54269 8.41875 6.38605 7.42382C7.22941 6.42891 8.23061 5.63973 9.33251 5.10129C10.4344 4.56285 11.6154 4.28574 12.8081 4.28576H20.0737C20.3122 4.28584 20.5486 4.23048 20.769 4.12283C20.9894 4.01518 21.1898 3.85735 21.3584 3.65836C21.5272 3.45935 21.661 3.22309 21.7524 2.96307C21.8437 2.70304 21.8907 2.42434 21.8907 2.14288V0H12.8085C11.1388 -1.13057e-10 9.48538 0.387988 7.94274 1.14181C6.40011 1.89563 4.99844 3.00053 3.81777 4.3934C2.63709 5.78629 1.70053 7.43988 1.06156 9.25977C0.422596 11.0796 0.0937321 13.0302 0.09375 15C0.09375 18.9782 1.43333 22.7935 3.8178 25.6066C6.20228 28.4196 9.43633 30 12.8085 30H21.8907Z" fill="url(#paint0_linear_27_808)" />
                                    <path d="M7.35883 15C7.35883 16.705 7.93292 18.34 8.95482 19.5455C9.9767 20.7511 11.3627 21.4283 12.8078 21.4283H21.8907C22.8542 21.4283 23.7781 21.8799 24.4594 22.6836C25.1406 23.4873 25.5234 24.5774 25.5234 25.7141V29.9998H29.1563V25.7142C29.1563 23.441 28.3908 21.2609 27.0283 19.6533C25.6656 18.0459 23.8176 17.1429 21.8907 17.1429H12.8081C12.3264 17.1429 11.8644 16.9171 11.5237 16.5153C11.1831 16.1134 10.9917 15.5683 10.9917 15C10.9917 14.4317 11.1831 13.8866 11.5237 13.4848C11.8644 13.0829 12.3264 12.8571 12.8081 12.8571H21.8907C23.8176 12.8571 25.6656 11.9541 27.0283 10.3466C28.3908 8.73919 29.1563 6.55902 29.1563 4.28576V0H25.5229V4.28576C25.5229 5.42226 25.1402 6.51223 24.4591 7.31591C23.778 8.11959 22.8541 8.57118 21.8907 8.57136H12.8081C12.0925 8.57131 11.3839 8.73757 10.7227 9.06062C10.0616 9.38368 9.46083 9.85722 8.95482 10.4542C8.44879 11.0511 8.04741 11.7598 7.77356 12.5398C7.49972 13.3198 7.3588 14.1558 7.35883 15Z" fill="url(#paint1_linear_27_808)" />
                                    <defs>
                                        <linearGradient id="paint0_linear_27_808" x1="3.38508" y1="15" x2="31.3506" y2="15" gradientUnits="userSpaceOnUse">
                                            <stop stop-color="#817696" />
                                            <stop offset="1" stop-color="#817698" />
                                        </linearGradient>
                                        <linearGradient id="paint1_linear_27_808" x1="3.3699" y1="14.9999" x2="31.3578" y2="14.9999" gradientUnits="userSpaceOnUse">
                                            <stop stop-color="#8575D2" />
                                            <stop offset="1" stop-color="#9083D5" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <p className='text-xl'>RS UPAYA SEHAT</p>
                            </div>


                            <p className='text-center text-xl my-2'>Poliklinik :<br></br><strong className='text-2xl'>{poliklinikOption[registrationData.antrian.poliklinik_id - 1]?.nama_poliklinik}</strong> </p>
                            <p className='text-center text-xl my-2 mb-10'>Nomor Antrian:<br></br><strong className='text-5xl'> 0{registrationData.antrian.urutan_antrian}</strong></p>


                            <p className='my-2 mx-8 text-center text-sm'>Dibuat pada : <p className='font-bold'>{formatDate(registrationData.antrian.tanggal)}</p></p>
                            <button className="flex mx-auto w-1/2 border-2 p-2 items-center justify-center gap-2 my-6" onClick={() => console.log(registrationData)}>print <MdPrint className='' /></button>


                        </div>



                    </>
                )}
                <div className="flex justify-between mt-6">
                    {step > 1 && !registrationData && (
                        <button onClick={handlePreviousStep} className="bg-gray-500 text-white px-4 py-2 rounded-md">Kembali</button>
                    )}
                    {step < 3 && (
                        <button onClick={handleNextStep} className="bg-purple-500 text-white px-4 py-2 rounded-md">Selanjutnya</button>
                    )}
                    {step === 3 && (
                        <button onClick={handleSubmit} className="bg-purple-500 text-white px-4 py-2 rounded-md">Daftar</button>
                    )}

                    {registrationData && (<Link to="/" className="bg-purple-500 text-white px-4 py-2 rounded-md mx-auto">Selesai</Link>)}
                </div>
            </div>
        </>
    );
}

export default Pendaftaran;
