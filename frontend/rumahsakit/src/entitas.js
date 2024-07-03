import { useEffect, useState } from "react";

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
                                </>)}
                            <div className="flex justify-end">
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
