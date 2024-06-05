import { useEffect, useState } from "react";
import { MdPrint } from 'react-icons/md';
const RekamMedis = () => {
    const [rekamData, setRekamData] = useState([])
    const [dokterData, setDokterData] = useState([])
    const [poliData, setPoliData] = useState([])
    const [pasienData, setPasienData] = useState([])


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

    const [activeRow, setActiveRow] = useState(null);

    const handleRowClick = (id) => {
        setActiveRow(activeRow === id ? null : id);
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return date.toLocaleDateString('id-ID', options);
    };
    return (
        <div className="flex flex-col items-center max-w-3xl mx-auto p-4 rounded-xl shadow-md my-2">
            <h1 className="text-2xl font-bold mb-4">Rekam Medis</h1>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-100 ">
                        <th className="border border-gray-300 px-4 py-2">No</th>
                        <th className="border border-gray-300 px-4 py-2">Pasien </th>
                        <th className="border border-gray-300 px-4 py-2">Dokter </th>
                        <th className="border border-gray-300 px-4 py-2">Poliklinik</th>
                        <th className="border border-gray-300 px-4 py-2">Waktu Rekam</th>
                    </tr>
                </thead>
                <tbody>
                    {rekamData.map((rekamData, index) => (
                        <>
                            <tr
                                key={rekamData.rekam_medis_id - 1}
                                className="hover:bg-gray-50 cursor-pointer"
                                onClick={() => handleRowClick(rekamData.rekam_medis_id)}
                            >
                                <td className="border border-gray-300 px-4 py-2 text-center">{rekamData.rekam_medis_id}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">{pasienData[rekamData.pasien_id-1]?.nama_pasien}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">{dokterData[rekamData.dokter_id-1]?.nama_dokter}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">{poliData[rekamData.poliklinik_id-1]?.nama_poliklinik}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">{formatDate(rekamData.waktu_rekam)}</td>
                            </tr>
                            {activeRow === rekamData.rekam_medis_id && (
                                <tr key={`${rekamData.rekam_medis_id}-details`}>
                                    <td colSpan="5" className="border border-gray-300 px-4 py-2">
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
                                                <p className="mr-10">Kode RM : {rekamData.rekam_medis_id}</p>
                                            </div>

                                            {/* Content of the dropdown container */}
                                            <table className="w-full">
                                                <tr>
                                                    <td className="border p-2 border-gray-400 w-1/4">Nama pasien :</td>
                                                    <td className="border p-2 border-gray-400" >{pasienData[rekamData.pasien_id-1]?.nama_pasien}</td>
                                                </tr>
                                                <tr>
                                                    <td className="border p-2 border-gray-400">Dokter :</td>
                                                    <td className="border p-2 border-gray-400" >{dokterData[rekamData.dokter_id]?.nama_dokter}</td>
                                                </tr>
                                                <tr>
                                                    <td className="border p-2 border-gray-400">Poliklinik :</td>
                                                    <td className="border p-2 border-gray-400" >{poliData[rekamData.poliklinik_id-1]?.nama_poliklinik}</td>
                                                </tr>
                                                <tr>
                                                    <td className="border p-2 border-gray-400">Jenis Rawat :</td>
                                                    <td className="border p-2 border-gray-400" >{rekamData.jenis_rawat}</td>
                                                </tr>
                                                <tr>
                                                    <td className="border p-2 border-gray-400">Diagnosis :</td>
                                                    <td className="border p-2 border-gray-400" >{rekamData.diagnosis}</td>
                                                </tr>
                                                <tr>
                                                    <td className="border p-2 border-gray-400">Tindakan Medis :</td>
                                                    <td className="border p-2 border-gray-400" >{rekamData.tindakan_medis}</td>
                                                </tr>
                                                <tr>
                                                    <td className="border p-2 border-gray-400">Resep :</td>
                                                    <td className="border p-2 border-gray-400" >
                                                        {index===0 && <ol>
                                                            <li>paracetamol <strong>3 x 1</strong></li>
                                                            <li>ibuprofein <strong>2 x 1</strong> </li>
                                                        </ol>}
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td className="border p-2 border-gray-400">Catatan:</td>
                                                    <td className="border p-2 border-gray-400" >{rekamData.catatan_perkembangan}</td>
                                                </tr>



                                            </table>
                                            <p className="m-4">Dibuat pada : {formatDate(rekamData.waktu_rekam)}</p>
                                            <button className="flex mx-auto w-1/2 border-2 p-2 items-center justify-center gap-2 my-6 hover:bg-purple-400" >print <MdPrint className='' /></button>


                                            {/* Add more details as needed */}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </>
                    ))}
                </tbody>
            </table>
        </div>

    );
}

export default RekamMedis;