import { useEffect, useState, useRef } from "react";
import { MdPrint } from 'react-icons/md';
import SearchComponent from "./components/searchComponent";
import SearchComponent2 from "./components/searchComponent2";
import RawatJalan from "./rawatJalan";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import qR from './assets/qr.png'; 



const RawatInap = () => {
    const [rawatJalan, setRawatJalan] = useState([])
    const [rekamData, setRekamData] = useState([])
    const [pasienData, setPasienData] = useState([])
    const [dataLayanan, setDataLayanan] = useState([])
    const [poliData, setPoliData] = useState([])
    const [dokter, setDokter] = useState([])
    const [obat, setObat] = useState([])
    const [resepData, setResepData] = useState([])
    const [tarif, setTarif] = useState([])
    const [kamar, setKamar] = useState([])
    const [gelang, setGelang] = useState([])
    const [toggleRefetch, setToggleRefetch] = useState(0)
    useEffect(() => {
        fetch('http://localhost:3000/gelang')
            .then(response => response.json())
            .then(data => setGelang(data))
            .catch(error => console.error('Error fetching poliklinik data:', error));
    }, []);
    useEffect(() => {
        fetch('http://localhost:3000/kamar')
            .then(response => response.json())
            .then(data => setKamar(data))
            .catch(error => console.error('Error fetching poliklinik data:', error));
    }, []);
    useEffect(() => {
        fetch('http://localhost:3000/rawatInap')
            .then(response => response.json())
            .then(data => setRawatJalan(data))
            .catch(error => console.error('Error fetching poliklinik data:', error));
    }, [toggleRefetch]);
    useEffect(() => {
        fetch('http://localhost:3000/rekamMedis')
            .then(response => response.json())
            .then(data => setRekamData(data))
            .then(console.log('togled'))
            .catch(error => console.error('Error fetching poliklinik data:', error));
    }, [toggleRefetch]);
    useEffect(() => {
        fetch('http://localhost:3000/pasien')
            .then(response => response.json())
            .then(data => setPasienData(data))
            .catch(error => console.error('Error fetching poliklinik data:', error));
    }, []);
    useEffect(() => {
        fetch('http://localhost:3000/layanan')
            .then(response => response.json())
            .then(data => setDataLayanan(data))
            .catch(error => console.error('Error fetching poliklinik data:', error));
    }, []);
    useEffect(() => {
        fetch('http://localhost:3000/poliklinik')
            .then(response => response.json())
            .then(data => setPoliData(data))
            .catch(error => console.error('Error fetching poliklinik data:', error));
    }, []);
    useEffect(() => {
        fetch('http://localhost:3000/tarif')
            .then(response => response.json())
            .then(data => setTarif(data))
            .catch(error => console.error('Error fetching poliklinik data:', error));
    }, [toggleRefetch]);
    useEffect(() => {
        fetch('http://localhost:3000/dokter')
            .then(response => response.json())
            .then(data => setDokter(data))
            .catch(error => console.error('Error fetching dokter data:', error));
    }, []);
    useEffect(() => {
        fetch('http://localhost:3000/obat')
            .then(response => response.json())
            .then(data => setObat(data))
            .catch(error => console.error('Error fetching dokter data:', error));
    }, []);
    useEffect(() => {
        fetch('http://localhost:3000/resep')
            .then(response => response.json())
            .then(data => setResepData(data))
            .catch(error => console.error('Error fetching dokter data:', error));
    }, [toggleRefetch]);


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('id-ID', options);
    };

    function formatForInput(date) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const [activeRow, setActiveRow] = useState(null);
    const [activePasien, setActivePasien] = useState(null)
    const resetInput = () => {
        setResep([])
        setLayanans([])
        setDeletedResep([])
        setDeletedLayanans([])

        setPoliklinik('')
        setNamaDokter('')
        setDiagnosis('')
        setTindakan('')
        setCatatan('')
        setCurrentKamar('')
        setTanggalKunjungan('')
        setActiveRow(null)
    }
    const [totalDays, setTotalDays] = useState(1);
    const handleRowClick = (id, r) => {
        console.log(r.tanggal_masuk)
        resetInput()
        setActiveRow(activeRow === id ? null : id);

        const calculateDaysDifference = (start, end) => {
            const startDate = new Date(start);
            const endDate = new Date(end);
            const timeDiff = endDate - startDate;
            const dayDiff = timeDiff / (1000 * 3600 * 24);
            return dayDiff;
        };

        if (r.tanggal_masuk && r.tanggal_keluar) {
            const diffInDays = calculateDaysDifference(r.tanggal_masuk, r.tanggal_keluar);
            { diffInDays > 0 && setTotalDays(diffInDays) }
        }



    };
    const handlePasienClick = (id) => {
        resetInput()
        setActivePasien(activePasien === id ? null : id);
    };


    //input change
    const [namaPasien, setNamaPasien] = useState('')
    const [tanggalKunjungan, setTanggalKunjungan] = useState('')
    const [namaDokter, setNamaDokter] = useState('')
    const [poliklinik, setPoliklinik] = useState('')
    const [jenisRawat, setJenisRawat] = useState(false)
    const [diagnosis, setDiagnosis] = useState('')
    const [tindakan, setTindakan] = useState('')
    const [catatan, setCatatan] = useState('')
    const [warnaGelang, setWarnaGelang] = useState('')
    const [currentKamar, setCurrentKamar] = useState('')
    const [tanggalMasuk, setTanggalMasuk] = useState('')
    const [tanggalKeluar, setTanggalKeluar] = useState('')

    const [resep, setResep] = useState([])
    const [layanans, setLayanans] = useState([])

    //search obat
    const [nama_obat, setnama_obat] = useState('');
    const [obat_id, setobat_id] = useState('');
    const [jumlah, setjumlah_obat] = useState('')
    const [dosis, setdosis_obat] = useState('')
    const [recommendations, setRecommendations] = useState([]);

    const handleInputChange = (event) => {
        const value = event.target.value;
        console.log(value)
        setnama_obat(value);

        // Filter the data based on the input value
        if (value) {
            const filteredRecommendations = obat.filter(item =>
                item.nama_obat.toLowerCase().includes(value.toLowerCase())
            );
            setRecommendations(filteredRecommendations);

        } else {
            setRecommendations([]);
        }
    };
    const handleAddObat = (e, rawatJalan) => {
        e.preventDefault();
        const pasien_id = pasienData[rekamData[rawatJalan.rekam_medis_id - 1]?.pasien_id - 1]?.pasien_id;
        const rekam_medis_id = rawatJalan.rekam_medis_id;
        if (pasien_id && rekam_medis_id && obat_id && jumlah && dosis) {
            const newObat = { pasien_id, rekam_medis_id, obat_id, jumlah, dosis };
            setResep(prevResep => [...prevResep, newObat]);
        }
    }

    const handleRecommendationClick = (nama, id) => {
        setnama_obat(nama);
        setobat_id(id)
        setRecommendations([]);
    };

    //search layanan
    const [inputValue2, setInputValue2] = useState('');
    const [tarif_id, settarif_id] = useState('');
    const [recommendations2, setRecommendations2] = useState([]);

    const handleInputChange2 = (event) => {
        const value = event.target.value;
        setInputValue2(value);

        // Filter the data based on the input value
        if (value) {
            const filteredRecommendations = dataLayanan.filter(item =>
                item.nama_layanan.toLowerCase().includes(value.toLowerCase())
            );

            setRecommendations2(filteredRecommendations);
        } else {
            setRecommendations2([]);
        }
    };
    const handleAddLayanan = (e, rawatJalan) => {
        e.preventDefault();

        const layananPasien = pasienData[rekamData[rawatJalan.rekam_medis_id - 1]?.pasien_id - 1]?.pasien_id;
        const rekam_medis_id = rawatJalan.rekam_medis_id;

        const newLayanan = { layananPasien, rekam_medis_id, tarif_id };
        setLayanans([...layanans, newLayanan])

    }

    const handleRecommendationClick2 = (nama, id) => {
        setInputValue2(nama);
        settarif_id(id)
        setRecommendations2([]);
    };

    const [succes, setSucces] = useState(false)
    const [failed, setFailed] = useState(false)



    const handleSubmit = async (e, rawatJalan) => {
        e.preventDefault();
        const currentPage = 'rawat_inap'
        const currentRekam = rawatJalan.rekam_medis_id;
        console.log('current : ', currentRekam, resep);


        try {
            const response = await fetch('http://localhost:3000/rawatJalanUpdate', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    currentKamar,
                    warnaGelang,
                    tanggalMasuk,
                    tanggalKeluar,
                    currentPage,
                    currentRekam,
                    activePasien,
                    activeRow,
                    jenisRawat,
                    tanggalKunjungan,
                    namaDokter,
                    poliklinik,
                    diagnosis,
                    tindakan,
                    catatan,
                    resep,
                    deletedResep,
                    layanans,
                    deletedLayanans
                }),
            });

            console.log(response.status);

            if (response.ok) {
                resetInput();
                setSucces(true)
                { toggleRefetch === 0 ? setToggleRefetch(1) : setToggleRefetch(0) }
            }
            const data = await response.json();
            console.log(data);
        } catch (error) {
            setFailed(true)
            console.error('Fetch error:', error);
        }

    };

    useEffect(() => {
        if (succes) {
            setTimeout(() => {
                setSucces(false);
            }, 3000);
        } else {
            setTimeout(() => {
                setFailed(false);
            }, 3000);
        }
    }, [succes, failed])

    const handlePoli = (value, rawatJalan) => {
        setPoliklinik(value)
        const filtered = dokter
            .filter(dokter =>
                dokter.poliklinik_id === value

            )
            .sort((a, b) =>
                a.dokter_id === rekamData[rawatJalan.rekam_medis_id - 1]?.dokter_id ? -1 :
                    b.dokter_id === rekamData[rawatJalan.rekam_medis_id - 1]?.dokter_id ? 1 :
                        0
            )
        setNamaDokter(filtered[0].dokter_id)

    }
    const [deletedLayanans, setDeletedLayanans] = useState([])
    const [deletedResep, setDeletedResep] = useState([])
    useEffect(() => {
        console.log(
            currentKamar,
            warnaGelang,
            tanggalMasuk,
            tanggalKeluar,
            activeRow,
            activePasien,
            tanggalKunjungan,
            namaDokter,
            poliklinik,
            diagnosis,
            tindakan,
            catatan, jenisRawat, resep, deletedResep, layanans, deletedLayanans)
    }, [
        currentKamar,
        warnaGelang,
        tanggalMasuk,
        tanggalKeluar,
        activeRow,
        activePasien,
        tanggalKunjungan,
        namaDokter,
        poliklinik,
        diagnosis,
        tindakan,
        catatan, jenisRawat, resep, deletedResep, layanans, deletedLayanans])



    const removeItemById = (e, id) => {
        e.preventDefault()
        console.log(e.target.id)
        console.log(id)
        if (e.target.id === "resep" || e.target.id === "resepData") {
            if (e.target.id === "resep") {
                setResep(prevItems => prevItems.filter(item => item.obat_id !== id));

            } else {
                setResepData(prevItems => prevItems.filter(item => item.obat_id !== id.obat_id));
                setDeletedResep([...deletedResep, id.resep_id])
            }

        } else if (e.target.id === "tarif" || e.target.id === "layanans") {
            if (e.target.id === "layanans") {
                setLayanans(prevItems => prevItems.filter(item => item !== id));

            } else {
                setTarif(prevItems => prevItems.filter(item => item.tarif_pasien_id !== id.tarif_pasien_id));
                setDeletedLayanans([...deletedLayanans, id.tarif_pasien_id])
            }
        }



    };

    const seenIds = new Set();

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

    const formatDate3 = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return date.toLocaleDateString('id-ID', options);
    };

    function formatNumber(value) {
        return new Intl.NumberFormat('en-US').format(value);
    }

    const changeDokter = (id) => {

        setNamaDokter(id)
        setPoliklinik(dokter.find(d => d.dokter_id == id)?.poliklinik_id)
    }

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

    const gelangRef = useRef(null)

    const downloadPDF = async (ref, filename) => {
        const input = ref.current;
        html2canvas(input).then(canvas => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF({
            orientation: `${filename === 'gelang' ? 'landscape':'portrait'}`,
            unit: 'pt',
            format: [canvas.width, canvas.height]
          });
    
          pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
          pdf.save(`${filename}.pdf`);
        }).catch(error => {
          console.error('Error generating PDF: ', error);
        });
      };

    return (
        <div className="flex flex-col items-center max-w-4xl mx-auto p-4 px-8 rounded-xl shadow-md my-2 text-sm sm:text-lg">
            <button className="p-4 bg-purple-500 text-white rounded-md fixed bottom-5 left-5" hidden onClick={() => { console.log(rawatJalan[0].tanggal_keluar) }}> LOG </button>
            <h1 className="text-2xl font-bold mb-4">Rawat Inap</h1>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-300 sm:px-4  px-auto py-2">Id</th>
                        <th className="border border-gray-300 sm:px-4  px-auto py-2">Pasien </th>
                        <th className="border border-gray-300 sm:px-4  px-auto py-2">Tanggal Masuk</th>
                        <th className="border border-gray-300 sm:px-4  px-auto py-2">Tanggal Keluar</th>
                        {isSmallScreen ? '' : <th className="border border-gray-300 sm:px-4  px-auto py-2">Dokter</th>}
                        {isSmallScreen ? '' : <th className="border border-gray-300 px-auto py-2">Diagnosis</th>}
                        <th className="border border-gray-300 sm:px-4  px-auto py-2">Ruangan</th>

                    </tr>
                </thead>
                <tbody>
                    {rawatJalan.filter(item => {
                        if (!seenIds.has(rekamData[item.rekam_medis_id - 1]?.pasien_id)) {
                            seenIds.add(rekamData[item.rekam_medis_id - 1]?.pasien_id);
                            return true;
                        }
                        return false;
                    })
                        .map((rJ, index) => (
                            <>

                                <tr
                                    key={index}
                                    className="hover:bg-gray-50 cursor-pointer relative border-2"
                                    onClick={() => handlePasienClick(rekamData.find(r => r.rekam_medis_id === rJ.rekam_medis_id)?.pasien_id)}
                                >
                                    <td className="border border-gray-300 sm:px-4  px-auto py-2 text-center">{rekamData.find(r => r.rekam_medis_id === rJ.rekam_medis_id)?.pasien_id}</td>
                                    <td className="border border-gray-300 sm:px-4  px-auto py-2 text-center">{pasienData.find(p => p.pasien_id === rekamData.find(rD => rD.rekam_medis_id === rJ.rekam_medis_id)?.pasien_id)?.nama_pasien}</td>
                                    <td className="border border-gray-300 sm:px-4  px-auto py-2 text-center">{rJ.tanggal_masuk == null ? "-" : formatDate(rJ.tanggal_masuk)}</td>
                                    <td className="border border-gray-300 sm:px-4  px-auto py-2 text-center">{rJ.tanggal_keluar == null ? "-" : formatDate(rJ.tanggal_keluar)}</td>
                                    {isSmallScreen ? '' : <td className="border border-gray-300 sm:px-4  px-auto py-2 text-center">{dokter[rekamData[rJ.rekam_medis_id - 1]?.dokter_id - 1]?.nama_dokter}</td>}
                                    {isSmallScreen ? '' : <td className="border border-gray-300 sm:px-4  px-auto py-2 text-center">{rekamData[rJ.rekam_medis_id - 1]?.diagnosis === null ? '-' : rekamData[rJ.rekam_medis_id - 1]?.diagnosis}</td>}
                                    <td className="border border-gray-300 sm:px-4  px-auto py-2 text-center">{kamar.find(tipe => tipe.kamar_id === rJ.kamar_id)?.kelas}</td>



                                </tr>

                                {activePasien === rekamData[rJ.rekam_medis_id - 1]?.pasien_id && (
                                    <>
                                        <tr >
                                            <td className="bg-gray-100 px-4 p-5 max-w-32 " colSpan="7">

                                                <div className=" flex items-center mb-2" >
                                                    <div className=" min-w-40 ">Nama </div>:
                                                    <div className="px-4">{pasienData.find(p => p.pasien_id === rekamData.find(rD => rD.rekam_medis_id === rJ.rekam_medis_id)?.pasien_id)?.nama_pasien}</div>
                                                </div>
                                                <div className=" flex items-center mb-2" >
                                                    <div className=" min-w-40">Tanggal Lahir</div>:
                                                    <div className="px-4">{formatDate(pasienData.find(p => p.pasien_id === rekamData.find(rD => rD.rekam_medis_id === rJ.rekam_medis_id)?.pasien_id)?.tanggal_lahir)}</div>
                                                </div>
                                                <div className=" flex items-center mb-2" >
                                                    <div className=" min-w-40">Jenis Kelamin</div>:
                                                    <div className=" px-4">{pasienData.find(p => p.pasien_id === rekamData.find(rD => rD.rekam_medis_id === rJ.rekam_medis_id)?.pasien_id)?.jenis_kelamin}</div>
                                                </div>

                                                <div className=" flex mb-2 flex-col" >
                                                    <div className="flex mb-2">
                                                        <p className="min-w-40">Rawat Jalan Pasien</p>
                                                        <span>:</span>
                                                    </div>
                                                    <div className="block sm:flex flex-wrap gap-2 ">

                                                        {rawatJalan.map((r, index) => (
                                                            activePasien === rekamData[r.rekam_medis_id - 1]?.pasien_id && (
                                                                rekamData[r.rekam_medis_id - 1]?.pasien_id === activePasien && (
                                                                    <div className="border min-w-72  mr-6 rounded-lg " onClick={() => handleRowClick(r.rawat_inap_id, r)} style={activeRow === r.rawat_inap_id ? { borderColor: `${gelang.find(g => g.gelang_id === r.gelang_id)?.warna}`, borderWidth: '2px', borderStyle: 'solid' } : {}}>


                                                                        <div
                                                                            className={`h-full relative p-2 mr-4 cursor-pointer flex-wrap flex-col rounded-l-lg shadow-md flex bg-white`}
                                                                            key={r.rawat_inap_id}


                                                                        >
                                                                            <div className={`h-fit px-2 rounded-md w-fit ${activeRow === r.rawat_inap_id ? 'bg-white border border-black text-black' : 'bg-white border border-black text-black'}`}>{formatDate3(r.tanggal_masuk)}</div>
                                                                            <div className=" overflow-auto">{rekamData[r.rekam_medis_id - 1]?.diagnosis === null ? '-' : rekamData[r.rekam_medis_id - 1]?.diagnosis}</div>
                                                                            <div className={`absolute -right-4 top-0 w-4 h-full p-2 rounded-r-md`} style={{ backgroundColor: `${gelang.find(g => g.gelang_id === r.gelang_id)?.warna}` }}></div>

                                                                        </div>
                                                                    </div>
                                                                )
                                                            )
                                                        ))}


                                                    </div>

                                                </div>
                                            </td>
                                        </tr>
                                        {rawatJalan.map((r, index) => (
                                            activeRow === r.rawat_inap_id && (
                                                <tr key={r.rawat_inap_id}>
                                                    <td colSpan="7" className="border border-gray-300 sm:px-4  px-auto py-2">
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
                                                                <div className="flex">
                                                                    <p className="mr-4 border border-black rounded-lg p-2">ID Rawat Inap : {r.rawat_inap_id}</p>
                                                                    <p className="mr-4 border border-black rounded-lg p-2">ID RM : {r.rekam_medis_id}</p>
                                                                </div>

                                                            </div>
                                                            {/* form data*/}
                                                            {/* className="border-2 border-red-500" */}
                                                            <form >
                                                                <table className="w-full">
                                                                    <tr>
                                                                        <td className="border p-2 border-gray-400 w-1/4">Nama pasien : </td>
                                                                        <td className="border  border-gray-400 p-2" >
                                                                            {pasienData.find(p => p.pasien_id === rekamData.find(rD => rD.rekam_medis_id === rJ.rekam_medis_id)?.pasien_id)?.nama_pasien}
                                                                        </td>

                                                                    </tr>
                                                                    <tr >
                                                                        <td className="border p-2 border-gray-400 w-1/4">Tanggal masuk : </td>

                                                                        <td className="border border-gray-400 p-2" >
                                                                            <input name="tanggal_kunjungan" onChange={(e) => { setTanggalKunjungan(e.target.value) }} className="h-10 w-full pl-2" type="date" defaultValue={formatForInput(r.tanggal_masuk)} />

                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="border p-2 border-gray-400 w-1/4">Tanggal keluar : </td>

                                                                        <td className="border border-gray-400 p-2" >
                                                                            <input name="tanggal_kunjungan" onChange={(e) => { setTanggalKeluar(e.target.value) }} className="h-10 w-full pl-2" type="date" defaultValue={r.tanggal_keluar === null ? '' : formatForInput(r.tanggal_keluar)} />

                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="border p-2 border-gray-400 w-1/4">Jenis Rawat : </td>
                                                                        <td className="border  border-gray-400" >
                                                                            <select name="jenis_rawat" className="p-2 border w-full h-12" onChange={(e) => {
                                                                                const value = e.target.value === 'true';
                                                                                setJenisRawat(value);
                                                                            }} defaultValue={jenisRawat}>
                                                                                <option value="false">Rawat Inap</option>
                                                                                <option value="true">Rawat Jalan</option>

                                                                            </select>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="border p-2 border-gray-400 w-1/4">Poliklinik : </td>
                                                                        <td className="border  border-gray-400" >
                                                                            <select name="poliklinik" className="p-2 border w-full h-12" onChange={(e) => handlePoli(Number(e.target.value), r)} >
                                                                                {poliData
                                                                                    .sort((a, b) =>
                                                                                        a.poliklinik_id === rekamData[r.rekam_medis_id - 1]?.poliklinik_id ? -1 :
                                                                                            b.poliklinik_id === rekamData[r.rekam_medis_id - 1]?.poliklinik_id ? 1 :
                                                                                                0
                                                                                    )
                                                                                    .map((poli, index) => (
                                                                                        <option key={index} value={poli.poliklinik_id}>
                                                                                            {poli.nama_poliklinik}
                                                                                        </option>
                                                                                    ))
                                                                                }
                                                                            </select>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="border p-2 border-gray-400 w-1/4">Nama dokter : </td>

                                                                        <td className="border  border-gray-400" >
                                                                            <select name="nama_dokter" className="h-10 w-full pl-2" defaultValue={rekamData[r.rekam_medis_id - 1]?.dokter_id} onChange={(e) => { changeDokter(Number(e.target.value)) }} >
                                                                                {dokter
                                                                                    .filter(dokter =>
                                                                                        poliklinik !== ''
                                                                                            ? dokter.poliklinik_id === poliklinik
                                                                                            : dokter.poliklinik_id === rekamData[r.rekam_medis_id - 1]?.poliklinik_id
                                                                                    )



                                                                                    .sort((a, b) =>
                                                                                        a.dokter_id === rekamData[r.rekam_medis_id - 1]?.dokter_id ? -1 :
                                                                                            b.dokter_id === rekamData[r.rekam_medis_id - 1]?.dokter_id ? 1 :
                                                                                                0
                                                                                    )
                                                                                    .map((dokter, index) => (
                                                                                        <option key={index} value={dokter.dokter_id}>
                                                                                            {dokter.nama_dokter}
                                                                                        </option>
                                                                                    ))
                                                                                }
                                                                            </select>
                                                                        </td>
                                                                    </tr>

                                                                    <tr>
                                                                        <td className="border p-2 border-gray-400 w-1/4" >Diagnosis </td>

                                                                        <td className="border  border-gray-400" ><input name="diagnosis" className="h-10 w-full pl-2" type="text" defaultValue={rekamData[r.rekam_medis_id - 1]?.diagnosis} onChange={(e) => { setDiagnosis(e.target.value) }} /></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="border p-2 border-gray-400 w-1/4">Tindakan Medis </td>

                                                                        <td className="border  border-gray-400" ><input name="tindakan_medis" className="h-10 w-full pl-2" type="text" defaultValue={rekamData[r.rekam_medis_id - 1]?.tindakan_medis} onChange={(e) => { setTindakan(e.target.value) }} /></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="border p-2 border-gray-400 w-1/4">Catatan </td>

                                                                        <td className="border  border-gray-400" ><input name="catatan" className="h-10 w-full pl-2" type="text" defaultValue={rekamData[r.rekam_medis_id - 1]?.catatan_perkembangan} onChange={(e) => { setCatatan(e.target.value) }} /></td>
                                                                    </tr>
                                                                    <tr >
                                                                        <td className="border p-2 border-gray-400 w-1/4">Kamar : </td>

                                                                        <td className="border  border-gray-400 " >
                                                                            <select name="nama_dokter" className="h-10 w-full pl-2" onChange={(e) => setCurrentKamar(Number(e.target.value))} >
                                                                                {kamar
                                                                                    .sort((a, b) =>
                                                                                        a.kamar_id === r.kamar_id ? -1 :
                                                                                            b.kamar_id === r.kamar_id ? 1 :
                                                                                                0
                                                                                    )
                                                                                    .map((g, index) => (
                                                                                        <option className="p-20 h-40 flex border border-black" key={index} value={g.kamar_id} >
                                                                                            {g.kelas}
                                                                                        </option>
                                                                                    ))
                                                                                }
                                                                            </select>

                                                                        </td>
                                                                    </tr>
                                                                    <tr >
                                                                        <td className="border p-2 border-gray-400 w-1/4">Warna Gelang : </td>

                                                                        <td className="border  border-gray-400 flex justify-center  items-center" >
                                                                            <select name="nama_dokter" className="h-10 w-4/6 pl-2 rounded-md" style={{ backgroundColor: `${warnaGelang !== '' ? gelang.find(g => g.gelang_id === warnaGelang)?.warna : gelang.find(g => g.gelang_id === r.gelang_id)?.warna}` }} defaultValue={gelang.find(g => g.gelang_id === r.gelang_id)?.warna} onChange={(e) => { setWarnaGelang(Number(e.target.value)) }} >

                                                                                {gelang
                                                                                    .sort((a, b) =>
                                                                                        a.gelang_id === r.gelang_id ? -1 :
                                                                                            b.gelang_id === r.gelang_id ? 1 :
                                                                                                0
                                                                                    )
                                                                                    .map((g, index) => (
                                                                                        <option className="p-20 h-40 w-40 flex border border-black" key={g.gelang_id} value={g.gelang_id} style={{ backgroundColor: `${g.warna}` }}>

                                                                                        </option>
                                                                                    ))
                                                                                }
                                                                            </select>
                                                                            {isVisible && 
                                                                            <div className="z-20 fixed inset-0 bg-gray-500 bg-opacity-30 flex items-center justify-center"

                                                                            >
                                                                                <div style={{ backgroundColor: `${warnaGelang !== '' ? gelang.find(g => g.gelang_id === warnaGelang)?.warna : gelang.find(g => g.gelang_id === r.gelang_id)?.warna}` }} className='shadow-md p-4 min-w-96 w-full h-fit relative rounded-lg justify-center flex'
                                                                                    ref={boxRef}
                                                                                    tabIndex={-1}
                                                                                    onBlur={handleBlur}
                                                                                    onFocus={() => setIsVisible(true)}
                                                                                >
                                                                                    <div ref={gelangRef}  className="bg-white p-4 w-fit rounded-lg flex border" style={{ border: `10px solid ${warnaGelang !== '' ? gelang.find(g => g.gelang_id === warnaGelang)?.warna : gelang.find(g => g.gelang_id === r.gelang_id)?.warna}` }}>
                                                                                        <div className="border p-2">
                                                                                            <div>nama : {pasienData.find(p => p.pasien_id === rekamData.find(rD => rD.rekam_medis_id === rJ.rekam_medis_id)?.pasien_id)?.nama_pasien}</div>
                                                                                            <div>diagnosis : {rekamData[r.rekam_medis_id - 1]?.diagnosis}</div>
                                                                                            <div>dokter : {dokter.find(d => d.dokter_id === rekamData[r.rekam_medis_id - 1]?.dokter_id)?.nama_dokter}</div>
                                                                                            <div>tanggal masuk : {formatDate(r.tanggal_masuk)}</div>
                                                                                        </div>
                                                                                        <img className="p-2 w-32 h-32" src={qR} alt="" />

                                                                                    </div>
                                                                                </div>
                                                                                <button onClick={()=> downloadPDF(gelangRef, 'gelang')} className="absolute bottom-44 bg-white p-4">download</button>
                                                                            </div>
                                                                            
                                                                            }
                                                                            <div onClick={handleToggle} className="p-2 border border-black m-2 cursor-pointer rounded-md">Lihat Gelang</div>
                                                                        </td>
                                                                    </tr>



                                                                </table>

                                                                <p className="my-4">Resep : </p>
                                                                <div className="flex my-2">
                                                                    <div className="flex w-full">
                                                                        <SearchComponent

                                                                            nama_obat={nama_obat}
                                                                            handleInputChange={handleInputChange}
                                                                            recommendations={recommendations}
                                                                            handleRecommendationClick={handleRecommendationClick} />
                                                                        <input className="ml-2 p-2 w-1/5" type="text" placeholder="jumlah" onChange={(e) => { setjumlah_obat(Number(e.target.value)) }} />
                                                                        <input className="ml-2 p-2 w-1/5" type="text" placeholder="dosis" onChange={(e) => { setdosis_obat(e.target.value) }} />
                                                                    </div>

                                                                    <button onClick={(e) => handleAddObat(e, r)} className="ml-4 px-2 border w-10 border-black rounded-md hover:bg-green-400" >+</button>
                                                                </div>
                                                                <table className="w-full">
                                                                    <thead>
                                                                        <tr>
                                                                            <th className="border p-2 border-gray-400 w-2/5">Nama Obat</th>
                                                                            <th className="border p-2 border-gray-400">Jumlah</th>
                                                                            <th className="border p-2 border-gray-400">Dosis</th>
                                                                            <th className="border p-2 border-gray-400">Harga</th>
                                                                            <th className="p-2 "></th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {resepData.map((resepData, index) => (
                                                                            resepData.rekam_medis_id === r.rekam_medis_id && (
                                                                                <tr className="relative" key={index}>
                                                                                    <td className="border p-2 border-gray-400 w-2/5">{obat.find(obj => obj.obat_id === resepData.obat_id)?.nama_obat}</td>
                                                                                    <td className="border text-center pr-5 border-gray-400">{resepData.jumlah}</td>
                                                                                    <td className="border text-center pr-5 border-gray-400">{resepData.dosis}</td>
                                                                                    <td className="border text-end pr-5 border-gray-400">{formatNumber(resepData.harga)}</td>
                                                                                    <button onClick={(e) => removeItemById(e, resepData)} id="resepData" className="ml-auto rounded-md cursor-pointer top-1 flex items-center justify-center h-8 w-8 border border-gray-700 hover:bg-red-400 text-center">-</button>
                                                                                </tr>
                                                                            )
                                                                        ))}

                                                                        {resep.map((resepId, index) => (
                                                                            <tr key={index}>
                                                                                <td className="border p-2 border-gray-400 w-2/5">{obat[resepId.obat_id - 1].nama_obat}</td>
                                                                                <td className="border text-center pr-5 border-gray-400">{resep[index].jumlah}</td>
                                                                                <td className="border text-center pr-5 border-gray-400">{resep[index].dosis}</td>
                                                                                <td className="border text-end pr-5 border-gray-400">{formatNumber(obat[resepId.obat_id - 1]?.harga * resep[index].jumlah)}</td>
                                                                                <button onClick={(e) => removeItemById(e, resepId.obat_id)} id="resep" className="ml-auto rounded-md cursor-pointer top-1 flex items-center justify-center h-8 w-8 border border-gray-700 hover:bg-red-400 text-center ">-</button>
                                                                            </tr>
                                                                        ))}


                                                                        <tr>
                                                                            <td className="border p-2 border-gray-400 font-bold " colSpan="3">Total Harga</td>
                                                                            <td className="border text-end pr-5 border-gray-400 font-bold" >
                                                                                {formatNumber(resepData
                                                                                    .filter(resepDataItem => resepDataItem.rekam_medis_id === r.rekam_medis_id)
                                                                                    .reduce((sum, resepDataItem) => sum + resepDataItem.harga, 0) +
                                                                                    resep.reduce((sum, resepId) => sum + (obat[resepId.obat_id - 1]?.harga * resep.find(r => r.obat_id === resepId.obat_id).jumlah), 0))}
                                                                            </td>
                                                                        </tr>

                                                                    </tbody>
                                                                </table>

                                                                <p className="my-4">Layanan : </p>
                                                                <div className="flex my-2">
                                                                    <SearchComponent2
                                                                        inputValue2={inputValue2}
                                                                        handleInputChange={handleInputChange2}
                                                                        recommendations={recommendations2}
                                                                        handleRecommendationClick={handleRecommendationClick2} /> <button onClick={(e) => handleAddLayanan(e, r)} className="mx-4 px-2 border w-10 border-black rounded-md hover:bg-gray-400" >+</button>
                                                                </div>
                                                                <table className="w-full">
                                                                    <thead>
                                                                        <tr>
                                                                            <th className="border p-2 border-gray-400 w-2/5">Nama Layanan</th>
                                                                            <th className="border p-2 border-gray-400">Harga</th>
                                                                            <th className="p-2"></th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody >
                                                                        {tarif.map((tarifData, index) => (
                                                                            tarifData.rekam_medis_id === r.rekam_medis_id && (
                                                                                <tr key={index} className="relative" >
                                                                                    <td className="border p-2 border-gray-400 w-2/5">{dataLayanan[tarifData.layanan_id - 1]?.nama_layanan || `Kamar Kelas ${kamar.find(k => k.kamar_id === (currentKamar === '' ? tarifData.kamar_id : currentKamar))?.kelas} (${totalDays} hari)`}</td>
                                                                                    <td className="border text-end pr-5 border-gray-400 w-2/4">
                                                                                        {formatNumber(dataLayanan[tarifData.layanan_id - 1]?.harga ||

                                                                                            kamar.find(k => k.kamar_id === (currentKamar === '' ? tarifData.kamar_id : currentKamar))?.biaya_ruangan * totalDays)}
                                                                                    </td>
                                                                                    <button onClick={(e) => removeItemById(e, tarifData)} id="tarif" className="ml-auto rounded-md cursor-pointer top-1 flex items-center justify-center h-8 w-8 border border-gray-700 hover:bg-red-400 text-center ">-</button>
                                                                                </tr>
                                                                            )
                                                                        ))}

                                                                        {layanans.map((layanan, index) => (
                                                                            <tr key={index}>
                                                                                <td className="border p-2 border-gray-400 w-2/5">{dataLayanan[layanan.tarif_id - 1]?.nama_layanan || kamar[layanan.kamar_id]?.kelas}</td>
                                                                                <td className="border text-end pr-5 border-gray-400 w-2/4">
                                                                                    {formatNumber(dataLayanan[layanan.tarif_id - 1]?.harga)}
                                                                                </td>
                                                                                <button onClick={(e) => removeItemById(e, layanan)} id="layanans" className="ml-auto rounded-md cursor-pointer top-1 flex items-center justify-center h-8 w-8 border border-gray-700 hover:bg-red-400 text-center 5">-</button>
                                                                            </tr>
                                                                        ))}

                                                                        <tr>
                                                                            <td className="border p-2 border-gray-400 font-bold">Total Harga</td>
                                                                            <td className="border text-end pr-5 border-gray-400 font-bold">
                                                                                {
                                                                                    formatNumber(tarif
                                                                                        .filter(tarifData => tarifData.rekam_medis_id === r.rekam_medis_id)
                                                                                        .reduce((sum, tarifData) => {
                                                                                            const layananCost = dataLayanan[tarifData.layanan_id - 1]?.harga || 0;
                                                                                            return sum + layananCost;
                                                                                        }, 0) +
                                                                                        (
                                                                                            tarif
                                                                                                .filter(tarifData => tarifData.rekam_medis_id === r.rekam_medis_id)
                                                                                                .reduce((_, tarifData) => {
                                                                                                    const kamarId = currentKamar === '' ? tarifData.kamar_id : currentKamar;
                                                                                                    const kamarCost = kamar.find(k => k.kamar_id === kamarId)?.biaya_ruangan || 0;
                                                                                                    const totalKamarCost = kamarCost * totalDays;
                                                                                                    return totalKamarCost;
                                                                                                }, 0)
                                                                                        ) +
                                                                                        layanans.reduce((sum, layanan) => {
                                                                                            return sum + (dataLayanan[layanan.tarif_id - 1]?.harga || 0);
                                                                                        }, 0))
                                                                                }
                                                                            </td>



                                                                        </tr>
                                                                    </tbody>
                                                                </table>


                                                                <div className="mx-auto max-w-max my-5">
                                                                    <button className="p-2 border border-black mt-4 rounded-lg shadow-md mx-1">Cancel</button>
                                                                    <button className="p-2 border border-black mt-4 rounded-lg  shadow-md mx-1 bg-purple-500 text-white" type="submit" onClick={(e) => handleSubmit(e, r)}>Simpan Perubahan</button>
                                                                </div>


                                                                <button className="flex mx-auto w-1/2 border-2 p-2 items-center justify-center gap-2 my-6 hover:bg-purple-400" >print <MdPrint className='' /></button>

                                                            </form>
                                                            {/* Add more details as needed */}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )

                                        ))}

                                    </>


                                )}

                            </>
                        ))}

                </tbody>
            </table>
            {succes && <div className="fixed top-20 bg-green-500 p-4 rounded-md text-white shadow-md animate-slideDown">
                Perubahan Berhasil
            </div>}
            {failed && <div className="fixed top-20 bg-red-500 p-4 rounded-md text-white shadow-md animate-slideDown">
                Perubahan Gagal
            </div>}
        </div>
    );
}

export default RawatInap;