import { useEffect, useState, useRef } from "react";
import { MdPrint } from 'react-icons/md';
const RekamMedis = () => {
    const [rekamData, setRekamData] = useState([])
    const [dokterData, setDokterData] = useState([])
    const [poliData, setPoliData] = useState([])
    const [pasienData, setPasienData] = useState([])
    const [resepData, setResepData] = useState([])
    const [obat, setObat] = useState([])

    useEffect(() => {
        fetch('http://localhost:3000/dokter')
            .then(response => response.json())
            .then(data => setDokterData(data))
            .catch(error => console.error('Error fetching poliklinik data:', error));
    }, []);
    useEffect(() => {
        fetch('http://localhost:3000/poliklinik')
            .then(response => response.json())
            .then(data => setPoliData(data))
            .catch(error => console.error('Error fetching poliklinik data:', error));
    }, []);
    useEffect(() => {
        fetch('http://localhost:3000/rekamMedis')
            .then(response => response.json())
            .then(data => setRekamData(data))
            .catch(error => console.error('Error fetching poliklinik data:', error));
    }, []);
    useEffect(() => {
        fetch('http://localhost:3000/pasien')
            .then(response => response.json())
            .then(data => setPasienData(data))
            .catch(error => console.error('Error fetching poliklinik data:', error));
    }, []);
    useEffect(() => {
        fetch('http://localhost:3000/resep')
            .then(response => response.json())
            .then(data => setResepData(data))
            .catch(error => console.error('Error fetching dokter data:', error));
    }, []);
    useEffect(() => {
        fetch('http://localhost:3000/obat')
            .then(response => response.json())
            .then(data => setObat(data))
            .catch(error => console.error('Error fetching dokter data:', error));
    }, []);

    const [activeRow, setActiveRow] = useState(null);
    const [activePasien, setActivePasien] = useState(null)

    const handleRowClick = (id) => {
        setActiveRow(activeRow === id ? null : id);
    };
    const handlePasienClick = (id) => {

        setActivePasien(activePasien === id ? null : id);
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return date.toLocaleDateString('id-ID', options);
    };

    const seenIds = new Set();

    useEffect(() => {
        console.log('p: ', activePasien)
        console.log('r: ', activeRow)
    }, [activePasien, activeRow])

    const formatDate2 = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('id-ID', options);
    };
    const formatDate3 = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return date.toLocaleDateString('id-ID', options);
    };

    const [isSmallScreen, setIsSmallScreen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) { // Adjust the size threshold as needed
                setIsSmallScreen(true);
            } else {
                setIsSmallScreen(false);
            }
        };

        // Check the screen size when the component mounts
        handleResize();

        // Add event listener for window resize
        window.addEventListener('resize', handleResize);

        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const [currentDate, setCurrentDate] = useState('');

    const handleButtonClick = () => {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = now.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;

        setCurrentDate(formattedDate);
    };

    const [isVisible, setIsVisible] = useState(false);
    const boxRef = useRef(null);

    const handleToggle = () => {
        handleButtonClick()
        setIsVisible(!isVisible);
    };

    const handleBlur = (event) => {
        if (boxRef.current && !boxRef.current.contains(event.relatedTarget)) {
            setIsVisible(false);
        }
        setCurrentDate('')
    };

    useEffect(() => {
        if (isVisible && boxRef.current) {
            boxRef.current.focus();
        }
    }, [isVisible]);



    return (
        <div className="flex flex-col items-center max-w-3xl mx-auto p-4 rounded-xl shadow-md my-2 text-md sm:text-lg">
            <h1 className="text-2xl font-bold mb-4">Rekam Medis</h1>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-100 ">
                        <th className="border border-gray-300 sm:px-4  px-auto py-2">Id</th>
                        <th className="border border-gray-300 sm:px-4  px-auto py-2">Pasien </th>
                        <th className="border border-gray-300 sm:px-4  px-auto py-2">Dokter </th>
                        <th className="border border-gray-300 sm:px-4  px-auto py-2">Poliklinik</th>
                        {isSmallScreen ? '' : <th className="border border-gray-300 sm:px-4  px-auto py-2">Waktu Rekam</th>}
                    </tr>
                </thead>
                <tbody>
                    {rekamData.filter(item => {
                        if (!seenIds.has(rekamData[item.rekam_medis_id - 1]?.pasien_id)) {
                            seenIds.add(rekamData[item.rekam_medis_id - 1]?.pasien_id);
                            return true;
                        }
                        return false;
                    })
                        .map((rD, index) => (
                            <>
                                <tr
                                    key={rD.rekam_medis_id}
                                    className="hover:bg-gray-50 cursor-pointer"
                                    onClick={() => handlePasienClick(rD.pasien_id)}
                                >
                                    <td className="border border-gray-300 sm:px-4  px-auto py-2 text-center">{rD.rekam_medis_id}</td>
                                    <td className="border border-gray-300 sm:px-4  px-auto py-2 text-center">{pasienData.find(p => p.pasien_id === rekamData.find(r=> r.rekam_medis_id === rD.rekam_medis_id)?.pasien_id)?.nama_pasien}</td>
                                    <td className="border border-gray-300 sm:px-4  px-auto py-2 text-center">{dokterData[rD.dokter_id - 1]?.nama_dokter}</td>
                                    <td className="border border-gray-300 sm:px-4  px-auto py-2 text-center">{poliData[rD.poliklinik_id - 1]?.nama_poliklinik}</td>
                                    {isSmallScreen ? '' : <td className="border border-gray-300 sm:px-4  px-auto py-2 text-center">{formatDate(rD.waktu_rekam)}</td>}
                                </tr>
                                {activePasien === rD.pasien_id && (
                                    <>
                                        <tr >
                                            <td className="bg-gray-100 px-4 p-5" colSpan="7">

                                                <div className=" flex items-center mb-2" >
                                                    <div className=" min-w-40 ">Nama </div>:
                                                    <div className="px-4">{pasienData.find(p => p.pasien_id === rekamData.find(r=> r.rekam_medis_id === rD.rekam_medis_id)?.pasien_id)?.nama_pasien}</div>
                                                </div>

                                                <div className=" flex items-center mb-2" >
                                                    <div className=" min-w-40">Tanggal Lahir</div>:
                                                    <div className="px-4">{formatDate2(pasienData.find(p => p.pasien_id === rekamData.find(r=> r.rekam_medis_id === rD.rekam_medis_id)?.pasien_id)?.tanggal_lahir)}</div>
                                                </div>
                                                <div className=" flex items-center mb-2" >
                                                    <div className=" min-w-40">Jenis Kelamin</div>:
                                                    <div className=" px-4">{pasienData.find(p => p.pasien_id === rekamData.find(r=> r.rekam_medis_id === rD.rekam_medis_id)?.pasien_id)?.jenis_kelamin}</div>
                                                </div>
                                                <div className="flex flex-col mb-2 sm:flex-col " >
                                                    <div className="flex mb-2">
                                                        <p className="min-w-48">Riwayat RM</p>
                                                        <span>:</span>
                                                    </div>
                                                    <div className="flex w-full flex-wrap ">


                                                        {rekamData.filter(r => r.pasien_id === activePasien)
                                                        .map((r) => (
                                                           




                                                                <div
                                                                    className={`h-20 w-full sm:w-48 min-w-48 p-2 m-1 cursor-pointer rounded-lg shadow-md flex  flex-col border border-black ${activeRow === r.rekam_medis_id ? 'bg-gray-300  ' : 'hover:bg-gray-100 bg-white '}`}
                                                                    key={r}
                                                                    onClick={() => handleRowClick(r.rekam_medis_id)}
                                                                >
                                                                
                                                                    <div className={` w-fit h-fit px-2 rounded-md ${activeRow === r.rekam_medis_id ? 'bg-white border border-black text-black' : 'bg-white border border-black text-black'}`}>{formatDate3(r.waktu_rekam)}</div>
                                                                    <div className=" overflow-auto">{rekamData[r.rekam_medis_id - 1]?.diagnosis === null ? '-' : rekamData[r.rekam_medis_id - 1]?.diagnosis}</div>


                                                                </div>


                                                            
                                                        ))}
                                                    </div>
                                                </div>


                                            </td>
                                        </tr>
                                        {rekamData.map((rekam) => (
                                            activeRow === rekam.rekam_medis_id && (
                                                <tr key={rekam.rekam_medis_id}>
                                                    <td colSpan="5" className="border border-gray-300 sm:px-4  px-auto py-2">
                                                        <div className="bg-gray-100 p-4">
                                                            <div className="flex items-center my-5 justify-between">
                                                                <div className="flex">
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
                                                                    <p>RS UPAYA SEHAT </p>
                                                                </div>
                                                                <p className="mr-10">Kode RM : {rekam.rekam_medis_id}</p>
                                                            </div>

                                                            {/* Content of the dropdown container */}
                                                            <table className="w-full">
                                                                <tr>
                                                                    <td className="border p-2 border-gray-400 w-1/4">Nama pasien :</td>
                                                                    <td className="border p-2 border-gray-400" >{pasienData.find(p => p.pasien_id === rekamData.find(r=> r.rekam_medis_id === rD.rekam_medis_id)?.pasien_id)?.nama_pasien}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="border p-2 border-gray-400">Dokter :</td>
                                                                    <td className="border p-2 border-gray-400" >{dokterData[rekam.dokter_id - 1]?.nama_dokter}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="border p-2 border-gray-400">Poliklinik :</td>
                                                                    <td className="border p-2 border-gray-400" >{poliData[rekam.poliklinik_id - 1]?.nama_poliklinik}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="border p-2 border-gray-400">Jenis Rawat :</td>
                                                                    <td className="border p-2 border-gray-400" >{rekam.jenis_rawat}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="border p-2 border-gray-400">Diagnosis :</td>
                                                                    <td className="border p-2 border-gray-400" >{rekam.diagnosis}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="border p-2 border-gray-400">Tindakan Medis :</td>
                                                                    <td className="border p-2 border-gray-400" >{rekam.tindakan_medis}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="border p-2 border-gray-400">Resep :</td>
                                                                    <td className="border p-2 border-gray-400 flex" >
                                                                        <ol className="w-9/12">
                                                                            {resepData.map((resep, index) => (
                                                                                resep.rekam_medis_id === rekam.rekam_medis_id && (

                                                                                    <li className=" p-1 border-gray-400 " key={index}>{resep.jumlah} {obat.find(obj => obj.obat_id === resep.obat_id)?.nama_obat} {resep.dosis}</li>



                                                                                )
                                                                            ))}
                                                                        </ol>

                                                                        <div className="flex items-center justify-center"

                                                                        >
                                                                            <button className="border border-black rounded-lg p-2" onClick={handleToggle}>Lihat Resep</button>
                                                                            {isVisible && (
                                                                                <div className="fixed inset-0 bg-gray-500 bg-opacity-30 flex items-center justify-center"
                                                                                   
                                                                                >

                                                                                    <div className="p-5 bg-white min-w-72 h-3/4 relative"
                                                                                     ref={boxRef}
                                                                                     tabIndex={-1}
                                                                                     onBlur={handleBlur}
                                                                                     onFocus={() => setIsVisible(true)}
                                                                                    >
                                                                                        <div className="flex gap-2 items-center justify-center border-b p-2">
                                                                                            <svg className="mx-1" width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                                                                                            <h1 className="text-3xl">RS Upaya Sehat</h1>

                                                                                            <h1></h1>
                                                                                        </div>
                                                                                        <div className="py-3 border-b ">
                                                                                            <p className="text-center ">Resep Dokter</p>
                                                                                            <div className="flex mt-4">
                                                                                                <p className="flex min-w-24">Dokter</p>:
                                                                                                <p className="ml-2"> {dokterData.find(n => n.dokter_id === rekam.dokter_id)?.nama_dokter}</p>
                                                                                            </div>
                                                                                            <div className="flex mt-2">
                                                                                                <p className=" min-w-24">Diagnosis </p>:
                                                                                                <p className="ml-2"> {rekam.diagnosis}</p>
                                                                                            </div>
                                                                                            <div className="flex mt-2">
                                                                                                <p className=" min-w-24">tanggal </p>:
                                                                                                <p className="ml-2"> {currentDate}</p>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="mt-5 flex flex-col justify-around" >
                                                                                            <ol className="w-full mb-auto">
                                                                                                {resepData.map((resep, index) => (
                                                                                                    resep.rekam_medis_id === rekam.rekam_medis_id && (

                                                                                                        <li className="font-playwrite text-center p-1 border-gray-400 " key={index}>{resep.jumlah} {obat.find(obj => obj.obat_id === resep.obat_id)?.nama_obat} {resep.dosis}</li>



                                                                                                    )
                                                                                                ))}
                                                                                            </ol>
                                                                                            
                                                                                        </div>
                                                                                        <div className="absolute bottom-5 left-0 w-full p2  flex flex-col justify-center items-center">
                                                                                            <img className="w-28" src="https://upload.wikimedia.org/wikipedia/commons/6/68/Meryl_Streep_Signature.svg" alt="" />
                                                                                            <div className="border-t w-fit">{dokterData.find(d=>d.dokter_id === rekam.dokter_id)?.nama_dokter}</div>
                                                                                        </div>
                                                                                    </div>

                                                                                </div>)}
                                                                        </div>
                                                                    </td>
                                                                </tr>

                                                                <tr>
                                                                    <td className="border p-2 border-gray-400">Catatan:</td>
                                                                    <td className="border p-2 border-gray-400" >{rekam.catatan_perkembangan}</td>
                                                                </tr>



                                                            </table>
                                                            <p className="m-4">Dibuat pada : {formatDate(rekam.waktu_rekam)}</p>
                                                            <button className="flex mx-auto w-1/2 border-2 p-2 items-center justify-center gap-2 my-6 hover:bg-purple-400" >print <MdPrint className='' /></button>


                                                            {/* Add more details as needed */}
                                                        </div>
                                                    </td>
                                                </tr>

                                            )
                                        ))}

                                    </>)}
                            </>
                        ))}
                </tbody>
            </table>
        </div>

    );
}

export default RekamMedis;