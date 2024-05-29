import { useEffect, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { useAuth } from '../AuthContext';

const Navigation = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, role, nama_lengkap, logout } = useAuth();
    const [popUser, setPopUser] = useState(false)

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };
    const togglePop = () => {
        setPopUser(!popUser)
    }

    useEffect(() => {
        if (user == '') {
            setPopUser(false)
        }
        console.log(user, role)
    }, [user])

    return (
        <div className="navi">
            <nav className="text-black" >
                <div className="w-full p-4  flex justify-between items-center border-b-2 border-b-gray relative">

                    <div className="text-black text-2xl  flex items-center">
                        <img src="https://sippn.menpan.go.id/images/article/large/logo-sorong2.png" className="px-5 h-10" alt="" />
                        <NavLink to="/">RS UPAYA SEHAT</NavLink>
                    </div>
                    <div className="hidden md:flex space-x-4 px-10">

                        {role.role !== 'dokter' &&
                            <NavLink to='/pendaftaran' className='navPendaftaran block text-black py-2'>
                                Pendaftaran
                            </NavLink>
                        }

                        {role.role === 'pasien' &&

                            <>
                                <NavLink to={user !== '' ? ('/RekamMedis') : ('/otentifikasi')} className='navPendaftaran block text-black py-2'>
                                    Rekam Medis
                                </NavLink>

                            </>

                        }

                        {role.role === 'dokter' &&
                            <>
                                <NavLink to={user !== '' ? ('/RawatInap') : ('/otentifikasi')} className='navPendaftaran block text-black py-2'>
                                    Rawat Inap
                                </NavLink>
                                <NavLink to={user !== '' ? ('/RawatJalan') : ('/otentifikasi')} className='navPendaftaran block text-black py-2'>
                                    Rawat Jalan
                                </NavLink>
                                <NavLink to={user !== '' ? ('/pasien') : ('/otentifikasi')} className='navPendaftaran block text-black py-2'>
                                    Pasien
                                </NavLink>
                            </>

                        }

                        <div className=" flex items-center">
                            {user ? (
                                <>
                                    <svg onClick={() => { togglePop() }} className="w-8 hover:bg-blue-200 rounded-full p-1 cursor-pointer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>

                                </>


                            ) : (
                                <NavLink to='/otentifikasi' className='navPendaftaran block text-black py-2'>
                                    Login
                                </NavLink>
                            )}

                        </div>


                    </div>
                    <div className="md:hidden">
                        <button onClick={toggleMenu} className="text-black">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                        </button>
                    </div>

                    <div className={`${popUser ? 'flex' : 'hidden'} absolute -bottom-48 right-5 bg-white p-5 w-80 border-2`} onBlur={() => { setPopUser(false) }} tabIndex={1}>
                        <div className="text-black">
                            <h2 className="font-bold mb-2">{user.username}</h2>
                            <p>{nama_lengkap.nama_lengkap}</p>
                            <p>Terdaftar sebagai :
                                <span className="font-bold"> {role.role}</span></p>
                            <button className="border-2 p-3 rounded-full mt-3" onClick={logout}> </button>
                        </div>
                    </div>

                </div>
                <div className={`${isOpen ? 'flex' : 'hidden'} md:hidden justify-center items-center flex-col border-b-2 border-b-gray`}>
                    <NavLink to='/pendaftaran' className='navPendaftaran  text-black py-2'>
                        Pendaftaran
                    </NavLink>
                    <NavLink to='/otentifikasi' className='navPendaftaran block text-black py-2'>
                        Login
                    </NavLink>
                </div>
            </nav >

        </div >);
}

export default Navigation;