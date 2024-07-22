import { useEffect, useState,useRef } from "react";

const Entitas = () => {
    const [selectedEntitas, setSelectedEntitas] = useState('pasien');
    const [poliData, setPoliData] = useState([]);
    const [entities, setEntities] = useState({ pasien: [], dokter: [], perawat: [] });
    const [expandedRow, setExpandedRow] = useState(null); // Track which row is expanded
    const [editingEntity, setEditingEntity] = useState(null);
    const [newEntity, setNewEntity] = useState({});

    useEffect(() => {
        fetch('http://localhost:3000/poliklinik')
            .then(response => response.json())
            .then(data => setPoliData(data))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        const fetchEntities = async (type) => {
            try {
                const response = await fetch(`http://localhost:3000/${type}`);
                const data = await response.json();
                setEntities((prevEntities) => ({ ...prevEntities, [type]: data }));
            } catch (err) {
                console.error(err);
            }
        };

        fetchEntities('dokter');
        fetchEntities('pasien');
        fetchEntities('perawat');
    }, [editingEntity, newEntity]);

    useEffect(() => {
        setExpandedRow(null);
    }, [selectedEntitas]);

    const handleRowClick = (index, entity) => {
        if (expandedRow === index) {
            setExpandedRow(null);
            setEditingEntity(null);
        } else {
            setExpandedRow(index);
            setEditingEntity(entity);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditingEntity((prevEntity) => ({ ...prevEntity, [name]: value }));
    };

    const handleNewInputChange = (e) => {
        const { name, value } = e.target;
        setNewEntity((prevEntity) => ({ ...prevEntity, [name]: value }));
    };

    const handleSaveChanges = async () => {
        const response = await fetch(`http://localhost:3000/${selectedEntitas}/${editingEntity[`${selectedEntitas}_id`]}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(editingEntity),
        });

        if (response.ok) {
            const updatedEntities = entities[selectedEntitas].map((entity) =>
                entity[`${selectedEntitas}_id`] === editingEntity[`${selectedEntitas}_id`] ? editingEntity : entity
            );
            setEntities((prevEntities) => ({ ...prevEntities, [selectedEntitas]: updatedEntities }));
        } else {
            console.error('Failed to update entity');
        }
    };

    const handleAddNew = async () => {
        const response = await fetch(`http://localhost:3000/${selectedEntitas}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newEntity),
        });

        if (response.ok) {
            const addedEntity = await response.json();
            setEntities((prevEntities) => ({ ...prevEntities, [selectedEntitas]: [...prevEntities[selectedEntitas], addedEntity] }));
        } else {
            console.error('Failed to add new entity');
        }
    };

    const handleDelete = async (id) => {
        const response = await fetch(`http://localhost:3000/${selectedEntitas}/${Number(id)}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            setEntities((prevEntities) => ({
                ...prevEntities,
                [selectedEntitas]: prevEntities[selectedEntitas].filter(entity => entity[`${selectedEntitas}_id`] !== id),
            }));
        } else {
            console.error('Failed to delete entity');
        }
    };

    function formatForInput(date) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
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

    const renderRows = () => {
        return entities[selectedEntitas].map((entity, index) => (
            <>
                <tr key={index}>
                    <td className="border border-gray-300 px-4 py-2 text-center">{entity[`${selectedEntitas}_id`]}</td>
                    <td onClick={() => handleRowClick(index, entity)} className="cursor-pointer hover:bg-gray-50 border border-gray-300 px-4 py-2 text-left">{entity[`nama_${selectedEntitas}`]}</td>
                    {(selectedEntitas === 'dokter' || selectedEntitas === 'perawat') &&
                        <td className="border border-gray-300 px-4 py-2 text-center">
                            {entity.poliklinik_id ? poliData.find(e => e.poliklinik_id === entity.poliklinik_id)?.nama_poliklinik : '-'}
                        </td>
                    }
                    <td className="flex items-center justify-center p-2 cursor-pointer">
                        <div onClick={() => handleDelete(entity[`${selectedEntitas}_id`])} className="hover:bg-red-400 flex items-center justify-center p-2 border rounded-lg w-10 h-10">-</div>
                    </td>
                </tr>
                {expandedRow === index && (
                    <tr key={`${index}-form`} className="bg-gray-50">
                        <td colSpan={4} className="border border-gray-300 px-4 py-2">
                            <div className="mb-2">
                                <label className="block mb-1">Nama:</label>
                                <input
                                    type="text"
                                    name={`nama_${selectedEntitas}`}
                                    value={editingEntity[`nama_${selectedEntitas}`] || ''}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                            {selectedEntitas !== 'pasien' &&
                                <div className="mb-2">
                                    <label className="block mb-1">Poliklinik:</label>
                                    <select
                                        name="poliklinik_id"
                                        value={editingEntity.poliklinik_id || ''}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                    >
                                        <option value="">Pilih Poliklinik</option>
                                        {poliData.sort((a, b) =>
                                            a.poliklinik_id === editingEntity.poliklinik_id ? -1 :
                                                b.poliklinik_id === editingEntity.poliklinik_id ? 1 :
                                                    0
                                        )
                                            .map((p, index) =>
                                                <option key={index} value={p.poliklinik_id}>
                                                    {p.nama_poliklinik}
                                                </option>
                                            )}
                                    </select>
                                </div>
                            }
                            {selectedEntitas === 'pasien' && (
                                <>
                                    <div className="mb-2">
                                        <label className="block mb-1">Tanggal Lahir:</label>
                                        <input
                                            type="date"
                                            name="tanggal_lahir"
                                            defaultValue={formatForInput(editingEntity.tanggal_lahir) || ''}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label className="block mb-1">Jenis Kelamin:</label>
                                        <input
                                            type="text"
                                            name="jenis_kelamin"
                                            value={editingEntity.jenis_kelamin || ''}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label className="block mb-1">Alamat:</label>
                                        <input
                                            type="text"
                                            name="alamat"
                                            value={editingEntity.alamat || ''}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label className="block mb-1">No KTP:</label>
                                        <input
                                            type="text"
                                            name="no_ktp"
                                            value={editingEntity.no_ktp || ''}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label className="block mb-1">No Telepon:</label>
                                        <input
                                            type="text"
                                            name="no_telepon"
                                            value={editingEntity.no_telepon || ''}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                
                                {isVisible &&
                                <div className="fixed inset-0 bg-gray-500 bg-opacity-30 flex items-center justify-center"
                                    
                                >
                                    <div className='shadow-md p-4 bg-white min-w-96 w-fit w-fit h-fit relative rounded-lg'
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
                                        <div className='flex items-center h-44 mt-5 '>
                                            <div className="p-2 w-40 h-36 border-2 border-black mr-4 rounded-lg items-center flex">
                                                <img src="https://cdn2.iconfinder.com/data/icons/e-commerce-line-4-1/1024/user4-512.png" alt="" />
                                            </div>
                                            <div className='w-full'>
                                                <div className="p-1 flex">
                                                    
                                                    ID Pasien : {editingEntity.pasien_id}
                                                </div>
                                                <div className="p-1">
                                                    Nama Pasien : {editingEntity.nama_pasien}
                                                </div>
                                                <div className="p-1">
                                                    Jenis Kelamin : {editingEntity.jenis_kelamin  }
                                                </div>
                                                <div className="p-1">
                                                    Alamat : {editingEntity.alamat }
                                                </div>
                                                <div className="p-1">
                                                    No Telepon : {editingEntity.no_telepon  }
                                                </div>
                                            </div>
                                        </div>

                                    </div>


                                </div>
    }
                                </>)}
                                
                            <div className={`flex ${ selectedEntitas === 'pasien' ? 'justify-between':'justify-end'}`}>
                                { selectedEntitas === 'pasien' && <button className="px-4 py-2 border text-black rounded-lg" onClick={handleToggle}>Lihat Kartu</button>}
                                <button onClick={handleSaveChanges} className="px-4 py-2 bg-purple-400 text-white rounded-lg">Simpan Perubahan</button>
                            </div>
                        </td>
                    </tr>
                )}
            </>
        ));
    };

    return (
        <div className="flex flex-col items-center max-w-3xl mx-auto p-4 rounded-xl shadow-md my-2 text-md sm:text-lg">
            <h1 className="text-2xl font-bold mb-4">Entitas</h1>
            <div className="flex w-full md:justify-between justify-center items-center mb-2 sm:flex-nowrap flex-wrap">
                <div className="flex p-2 gap-2">
                    <div onClick={() => setSelectedEntitas('pasien')} className={`p-2 border border-gray-400 shadow-md rounded-lg cursor-pointer ${selectedEntitas === 'pasien' && 'bg-purple-400 text-white'}`}>
                        Pasien
                    </div>
                    <div onClick={() => setSelectedEntitas('dokter')} className={`p-2 border border-gray-400 shadow-md rounded-lg cursor-pointer ${selectedEntitas === 'dokter' && 'bg-purple-400 text-white'}`}>
                        Dokter
                    </div>
                    <div onClick={() => setSelectedEntitas('perawat')} className={`p-2 border border-gray-400 shadow-md rounded-lg cursor-pointer ${selectedEntitas === 'perawat' && 'bg-purple-400 text-white'}`}>
                        Perawat
                    </div>
                </div>
                {(selectedEntitas === 'dokter' || selectedEntitas === 'perawat') &&
                    <div className="flex items-center p-2 gap-2">
                        <input
                            className="w-52 p-2 border rounded-lg shadow-md"
                            type="text"
                            name={`nama_${selectedEntitas}`}
                            placeholder="nama"
                            value={newEntity[`nama_${selectedEntitas}`] || ''}
                            onChange={handleNewInputChange}
                        />
                        <select
                            className="w-20 p-2 border rounded-lg shadow-md"
                            name="poliklinik_id"
                            value={newEntity.poliklinik_id || ''}
                            onChange={handleNewInputChange}
                        >
                            <option value="">Pilih Poliklinik</option>
                            {poliData.map((p, index) => (
                                <option key={index} value={p.poliklinik_id}>
                                    {p.nama_poliklinik}
                                </option>
                            ))}
                        </select>
                        <div className="flex items-center border border-black shadow-md h-10 w-10 justify-center rounded-lg cursor-pointer hover:bg-green-400" onClick={handleAddNew}>+</div>
                    </div>
                }
                {selectedEntitas === 'pasien' &&
                    <div className="flex items-center p-2 gap-2">
                        <input
                            className="w-52 p-2 border rounded-lg shadow-md"
                            type="text"
                            name={`nama_${selectedEntitas}`}
                            placeholder="nama"
                            value={newEntity[`nama_${selectedEntitas}`] || ''}
                            onChange={handleNewInputChange}
                        />
                        <div className="flex items-center border border-black shadow-md h-10 w-10 justify-center rounded-lg cursor-pointer hover:bg-green-400" onClick={handleAddNew}>+</div>
                    </div>
                }
            </div>
            <table className="w-full border-collapse">
                <thead>
                    <tr className="">
                        <th className="border border-gray-300 sm:px-4 px-auto py-2 w-20">Id</th>
                        <th className="border border-gray-300 sm:px-4 px-auto pl-2 w-auto">Nama</th>
                        {(selectedEntitas === 'dokter' || selectedEntitas === 'perawat') && <th className="border border-gray-300 sm:px-4 sm:w-80 w-auto py-2">Poli</th>}
                        <th className="sm:w-20 w-auto"></th>
                    </tr>
                </thead>
                <tbody>
                    {renderRows()}
                </tbody>
            </table>
        </div>
    );
}

export default Entitas;
