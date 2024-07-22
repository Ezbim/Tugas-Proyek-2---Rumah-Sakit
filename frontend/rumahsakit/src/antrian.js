
import { useEffect, useState } from "react";

const Antrian = (e) => {

    const [antrianData, setAntrianData] = useState([])
    const [pasienData, setPasienData] = useState([])
    const [poliklinikData, setPoliklinikData] = useState([])
    const [selectedPoli, setSelectedPoli] = useState(1)
    const [refetch, setRefetch] = useState(0)
    useEffect(() => {
        fetch('http://localhost:3000/antrian')
            .then(response => response.json())
            .then(data => setAntrianData(data))
            .catch(err => console.log(err))
    }, [refetch])
    useEffect(() => {
        fetch('http://localhost:3000/pasien')
            .then(response => response.json())
            .then(data => setPasienData(data))
            .catch(err => console.log(err))
    }, [])
    useEffect(() => {
        fetch('http://localhost:3000/poliklinik')
            .then(response => response.json())
            .then(data => setPoliklinikData(data))
            .catch(err => console.log(err))
    }, [])



    // Filter the data to get all elements where selesai is 'belum'
    const isPoli = antrianData.filter(e => e.poliklinik_id === selectedPoli)
    const filteredAntrian = isPoli.filter(a => a.selesai === 'belum');

    // Take the first element from the filtered results
    const firstAntrian = filteredAntrian.length > 0 ? filteredAntrian[0] : null;



    const nextAntrian = async (e) => {

        e.preventDefault()


        if (firstAntrian !== null) {
            const antrianId = firstAntrian.antrian_id
            const poliId = firstAntrian.poliklinik_id
            const pasienId = firstAntrian.pasien_id
            const dokterId = firstAntrian.dokter_id
            const layananId = firstAntrian.layanan_id

            const response = await fetch('http://localhost:3000/nextAntrian', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    antrianId,
                    poliId,
                    pasienId,
                    dokterId,
                    layananId

                })
            })
            if (response.ok) {
                {  refetch === 0 ? setRefetch(1) : setRefetch(0) }
            }
        }


    }
    const skipAntrian = async(e) => {

        e.preventDefault()

   
        if (firstAntrian !== null) {
            const antrianId = firstAntrian.antrian_id

            const response = await fetch('http://localhost:3000/skipAntrian', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    antrianId,

                })
            })
            if (response.ok) {
                { refetch === 0 ? setRefetch(1) : setRefetch(0) }
            }
        }


    }
    useEffect(() => {
        console.log(antrianData)
        console.log(firstAntrian)
    }, [antrianData])

    const displayPoli = (value) =>{
        console.log(value)
        setSelectedPoli(value)
    }

    return (
        <div>
            <h1 className="text-2xl font-bold  mx-auto w-fit">Antrian</h1>
            <div className="mx-auto max-w-4xl p-4">
                <div className="flex items-center justify-between my-2"><p>Display antrian</p>
                <select className="border border-black my-2 p-2 rounded-lg" onChange={(e)=>displayPoli(Number(e.target.value))}>
                    {poliklinikData.map(p=>
                    <option key={p.poliklinik_id} value={p.poliklinik_id}>Poliklinik {p.nama_poliklinik}</option>
                )
                    }
                </select></div>
                
                <div className="flex flex-col justify-evenly p-2 h-96 border border-black rounded-lg ">
                    <div className="p2 flex w-full justify-center" >
                        {
                            firstAntrian ? (
                                <div className="my-8 flex justify-center text-center flex-col">
                                    <p className="text-5xl font-bold mb-2">{poliklinikData.find(p => p.poliklinik_id === selectedPoli)?.nama_poliklinik}</p>
                                    <p className="text-2xl mb-4">Urutan Antrian :</p>
                                    <p className="text-8xl">{firstAntrian.urutan_antrian}</p>
                                </div>
                            ) : (
                                <div className="my-8 flex justify-center text-center flex-col">
                                    <p className="text-5xl font-bold mb-2">Poliklinik {poliklinikData.find(p => p.poliklinik_id === selectedPoli)?.nama_poliklinik}</p>
                                    <p className="text-2xl mb-4">Urutan Antrian :</p>
                                    <p className="text-5xl">-</p>
                                </div>
                            )
                        }
                    </div>
                    <div className="flex justify-center gap-5">
                        <button onClick={(e) => skipAntrian(e)} className="p-2 px-4 rounded-lg border border-black hover:bg-purple-300">Skip {'>'}</button>
                        <button onClick={(e) => nextAntrian(e)} className="p-2 px-4 rounded-lg border border-black hover:bg-purple-300">Selanjutnya {'>'}</button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center max-w-4xl mx-auto p-4 rounded-xl shadow-md my-2 text-sm sm:text-lg">
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100 ">
                            <th className="border border-gray-300 sm:sm:px-4 w-10 px-auto  px-auto  py-2">Urutan Antrian</th>
                            <th className="border border-gray-300 sm:sm:px-4  px-auto  px-auto  py-2">Nama Pasien</th>
                            <th className="border border-gray-300 sm:sm:px-4  px-auto  px-auto  py-2">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {firstAntrian /* && selectedPoli  */? (
                            antrianData.filter(antri => antri.poliklinik_id === selectedPoli)
                                .map((antri, index) => {
                                    return (
                                        <tr key={index} className={antri.antrian_id === firstAntrian.antrian_id ? `border-4 border-purple-500` : ''}>
                                            <td className="border text-center border-gray-300 sm:px-4 px-auto py-2">
                                                {antri.urutan_antrian}
                                            </td>
                                            <td className="border text-center border-gray-300 sm:px-4 px-auto py-2">
                                                {pasienData.find(pD => pD.pasien_id === antri.pasien_id)?.nama_pasien}
                                            </td>
                                            <td className="border text-center border-gray-300 sm:px-4 px-auto py-2">
                                                {antri.antrian_id === firstAntrian.antrian_id ? 'Harap Masuk Ruangan' : antri.selesai}
                                            </td>
                                        </tr>
                                    );
                                })
                        ) : 
                        antrianData.filter(antri => antri.poliklinik_id === selectedPoli)
                        .map((a)=>{
                            return (
                                <tr key={a}>
                                    <td className="border text-center border-gray-300 sm:px-4 px-auto py-2">
                                        {a.urutan_antrian}
                                    </td>
                                    <td className="border text-center border-gray-300 sm:px-4 px-auto py-2">
                                        {pasienData.find(pD => pD.pasien_id === a.pasien_id)?.nama_pasien}
                                    </td>
                                    <td className="border text-center border-gray-300 sm:px-4 px-auto py-2">
                                        {a.selesai}
                                    </td>
                                </tr>
                            );
                        })
                        }


                    </tbody>
                </table>
            </div>
        </div>

    );
}

export default Antrian;