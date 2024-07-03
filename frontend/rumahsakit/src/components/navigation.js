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

    const location = useLocation();
    return (
        <div className="navi">
            <nav className="text-black" >
                <div className="w-full p-4  flex justify-between items-center border-b-2 border-b-gray relative">

                    <div className="text-black text-2xl  flex items-center">

                        <svg className="mx-5" width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                        <NavLink to="/">RS UPAYA SEHAT</NavLink>
                    </div>
                    <div className="items-center hidden md:flex space-x-4 px-10">

                        {role === 'admin' &&
                            <>
                                <NavLink to='/pendaftaran' className={`hover:bg-purple-50 rounded-lg text-black p-2 ${location.pathname === '/pendaftaran' && 'p-2 m-2 rounded-lg border-2 border-purple-400'}`}>
                                    Pendaftaran
                                </NavLink>
                                <NavLink to='/antrian' className={`hover:bg-purple-50 rounded-lg text-black p-2 ${location.pathname === '/antrian' && 'p-2 m-2 rounded-lg border-2 border-purple-400'}`}>
                                    Antrian
                                </NavLink>
                                <NavLink to='/entitas' className={`hover:bg-purple-50 rounded-lg text-black p-2 ${location.pathname === '/entitas' && 'p-2 m-2 rounded-lg border-2 border-purple-400'}`}>
                                    Entitas
                                </NavLink>

                                <NavLink to={user !== '' ? ('/RekamMedis') : ('/otentifikasi')} className={`hover:bg-purple-50 rounded-lg text-black p-2 ${location.pathname === '/RekamMedis' && 'p-2 m-2 rounded-lg border-2 border-purple-400'}`}>
                                    Rekam Medis
                                </NavLink>
                                <NavLink to={user !== '' ? ('/RawatInap') : ('/otentifikasi')} className={` hover:bg-purple-50 rounded-lg text-black p-2 ${location.pathname === '/RawatInap' && 'p-2 m-2 rounded-lg border-2 border-purple-400'}`}>
                                    Rawat Inap
                                </NavLink>
                                <NavLink to={user !== '' ? ('/RawatJalan') : ('/otentifikasi')} className={` hover:bg-purple-50 rounded-lg text-black p-2 ${location.pathname === '/RawatJalan' && 'p-2 m-2 rounded-lg border-2 border-purple-400'}`}>
                                    Rawat Jalan
                                </NavLink>
                            </>

                        }
                        {role === 'petugas pendaftaran' &&
                            <>
                                <NavLink to='/pendaftaran' className={`hover:bg-purple-50 rounded-lg text-black p-2 ${location.pathname === '/pendaftaran' && 'p-2 m-2 rounded-lg border-2 border-purple-400'}`}>
                                    Pendaftaran
                                </NavLink>

                                <NavLink to='/entitas' className={`hover:bg-purple-50 rounded-lg text-black p-2 ${location.pathname === '/entitas' && 'p-2 m-2 rounded-lg border-2 border-purple-400'}`}>
                                    Entitas
                                </NavLink>


                            </>

                        }
                        {role === 'petugas antrian' &&
                            <>

                                <NavLink to='/antrian' className={`hover:bg-purple-50 rounded-lg text-black p-2 ${location.pathname === '/antrian' && 'p-2 m-2 rounded-lg border-2 border-purple-400'}`}>
                                    Antrian
                                </NavLink>

                            </>

                        }
                        {role === 'petugas entitas' &&
                            <>

                                <NavLink to='/entitas' className={`hover:bg-purple-50 rounded-lg text-black p-2 ${location.pathname === '/entitas' && 'p-2 m-2 rounded-lg border-2 border-purple-400'}`}>
                                    Entitas
                                </NavLink>

                            </>

                        }

                        {role === 'petugas rekam medis' &&
                            <>


                                <NavLink to={user !== '' ? ('/RekamMedis') : ('/otentifikasi')} className={`hover:bg-purple-50 rounded-lg text-black p-2 ${location.pathname === '/RekamMedis' && 'p-2 m-2 rounded-lg border-2 border-purple-400'}`}>
                                    Rekam Medis
                                </NavLink>

                            </>

                        }
                        {role === 'petugas rawat inap' &&
                            <>

                                <NavLink to={user !== '' ? ('/RawatInap') : ('/otentifikasi')} className={` hover:bg-purple-50 rounded-lg text-black p-2 ${location.pathname === '/RawatInap' && 'p-2 m-2 rounded-lg border-2 border-purple-400'}`}>
                                    Rawat Inap
                                </NavLink>

                            </>

                        }
                        {role === 'petugas rawat jalan' &&
                            <>

                                <NavLink to={user !== '' ? ('/RawatJalan') : ('/otentifikasi')} className={` hover:bg-purple-50 rounded-lg text-black p-2 ${location.pathname === '/RawatJalan' && 'p-2 m-2 rounded-lg border-2 border-purple-400'}`}>
                                    Rawat Jalan
                                </NavLink>
                            </>

                        }

                        {role === 'dokter' &&
                            <>
                                <NavLink to={user !== '' ? ('/RekamMedis') : ('/otentifikasi')} className={` hover:bg-purple-50 rounded-lg text-black p-2 ${location.pathname === '/RekamMedis' && 'p-2 m-2 rounded-lg border-2 border-purple-400'}`}>
                                    Rekam Medis
                                </NavLink>
                                <NavLink to={user !== '' ? ('/RawatInap') : ('/otentifikasi')} className={` hover:bg-purple-50 rounded-lg text-black p-2 ${location.pathname === '/RawatInap' && 'p-2 m-2 rounded-lg border-2 border-purple-400'}`}>
                                    Rawat Inap
                                </NavLink>
                                <NavLink to={user !== '' ? ('/RawatJalan') : ('/otentifikasi')} className={` hover:bg-purple-50 rounded-lg text-black p-2 ${location.pathname === '/RawatJalan' && 'p-2 m-2 rounded-lg border-2 border-purple-400'}`}>
                                    Rawat Jalan
                                </NavLink>

                            </>

                        }

                        <div className=" flex items-center">
                            {user !== '' ? (
                                <>
                                    <svg onClick={togglePop} className={`w-8 hover:bg-purple-200 rounded-full p-1 cursor-pointer ${popUser && 'bg-purple-200'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>

                                </>


                            ) : (
                                <NavLink to='/otentifikasi' className='navPendaftaran block text-black px-4 p-2 rounded-full border-2 border-purple-400'>
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

                    <div className={`${popUser ? 'flex' : 'hidden'} absolute -bottom-48 right-5 p-5 w-80 border-2 rounded-lg bg-purple-400`} onBlur={() => { setPopUser(false) }} tabIndex={1}>
                        <div className="text-white b">
                            <h2 className="font-bold mb-2">{user}</h2>
                            <p>{nama_lengkap}</p>
                            <p>Terdaftar sebagai :
                                <span className="font-bold"> {role}</span></p>
                            <button className="border-2 p-3 bg-white rounded-full mt-3 text-black" onClick={logout}>Logout</button>
                        </div>
                        <div className="border-purple-300" style={{
                            width: 0,
                            height: 0,
                            borderLeft: '15px solid transparent',
                            borderRight: '15px solid transparent',
                            borderBottom: '25px solid #c084fc ',
                            position: 'absolute',
                            top: '-20px',
                            right: '38px'
                        }}></div>
                    </div>

                </div>
                <div className={`${isOpen ? 'flex' : 'hidden'} md:hidden justify-center items-center flex-col border-b-2 border-b-gray`}>

                    {user === '' &&
                        <NavLink to='/otentifikasi' className='my-5 navPendaftaran block text-black px-4 p-2 rounded-full border-2 border-purple-400'>
                            Login
                        </NavLink>
                    }
                    {role === 'admin' &&
                        <>
                            <NavLink onClick={() => setIsOpen(false)} to='/pendaftaran' className={`w-40 text-center text-black py-2 ${location.pathname === '/pendaftaran' && 'p-2 m-2 rounded-lg border-2 border-black'}`}>
                                Pendaftaran
                            </NavLink>

                            <NavLink onClick={() => setIsOpen(false)} to={user !== '' ? ('/RekamMedis') : ('/otentifikasi')} className={`w-40 text-center text-black py-2 ${location.pathname === '/RekamMedis' && 'p-2 m-2 rounded-lg border-2 border-black'}`}>
                                Rekam Medis
                            </NavLink>
                            <NavLink onClick={() => setIsOpen(false)} to={user !== '' ? ('/RawatInap') : ('/otentifikasi')} className={`w-40 text-center text-black py-2 ${location.pathname === '/RawatInap' && 'p-2 m-2 rounded-lg border-2 border-black'}`}>
                                Rawat Inap
                            </NavLink>
                            <NavLink onClick={() => setIsOpen(false)} to={user !== '' ? ('/RawatJalan') : ('/otentifikasi')} className={`w-40 text-center text-black py-2 ${location.pathname === '/RawatJalan' && 'p-2 m-2 rounded-lg border-2 border-black'}`}>
                                Rawat Jalan
                            </NavLink>
                            <div className="flex justify-evenly items-center p-2 border rounded-lg my-2 w-52">
                                <svg onClick={togglePop} className={`h-10 w-10 hover:bg-purple-200 border rounded-full p-1 cursor-pointer ${popUser && 'bg-purple-200'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                                <button className="border-2 p-3 bg-white rounded-full text-black" onClick={logout}>Logout</button>
                            </div>

                        </>

                    }
                    {role === 'dokter' &&
                        <>

                            <NavLink onClick={() => setIsOpen(false)} to={user !== '' ? ('/RekamMedis') : ('/otentifikasi')} className={`w-40 text-center text-black py-2 ${location.pathname === '/RekamMedis' && 'p-2 m-2 rounded-lg border-2 border-black'}`}>
                                Rekam Medis
                            </NavLink>
                            <NavLink onClick={() => setIsOpen(false)} to={user !== '' ? ('/RawatInap') : ('/otentifikasi')} className={`w-40 text-center text-black py-2 ${location.pathname === '/RawatInap' && 'p-2 m-2 rounded-lg border-2 border-black'}`}>
                                Rawat Inap
                            </NavLink>
                            <NavLink onClick={() => setIsOpen(false)} to={user !== '' ? ('/RawatJalan') : ('/otentifikasi')} className={`w-40 text-center text-black py-2 ${location.pathname === '/RawatJalan' && 'p-2 m-2 rounded-lg border-2 border-black'}`}>
                                Rawat Jalan
                            </NavLink>
                            <button className="border-2 p-3 bg-white rounded-full my-4 text-black" onClick={logout}>Logout</button>
                        </>

                    }
                    {role === 'petugas rawat jalan' &&
                        <>

                            <NavLink onClick={() => setIsOpen(false)} to={user !== '' ? ('/RawatJalan') : ('/otentifikasi')} className={`w-40 text-center text-black py-2 ${location.pathname === '/RawatJalan' && 'p-2 m-2 rounded-lg border-2 border-black'}`}>
                                Rawat Jalan
                            </NavLink>
                            <button className="border-2 p-3 bg-white rounded-full my-4 text-black" onClick={logout}>Logout</button>
                        </>

                    }
                    {role === 'petugas rawat inap' &&
                        <>

                            <NavLink onClick={() => setIsOpen(false)} to={user !== '' ? ('/RawatInap') : ('/otentifikasi')} className={`w-40 text-center text-black py-2 ${location.pathname === '/RawatInap' && 'p-2 m-2 rounded-lg border-2 border-black'}`}>
                                Rawat Inap
                            </NavLink>

                            <button className="border-2 p-3 bg-white rounded-full my-4 text-black" onClick={logout}>Logout</button>
                        </>

                    }
                    {role === 'petugas rekam medis' &&
                        <>

                            <NavLink onClick={() => setIsOpen(false)} to={user !== '' ? ('/RekamMedis') : ('/otentifikasi')} className={`w-40 text-center text-black py-2 ${location.pathname === '/RekamMedis' && 'p-2 m-2 rounded-lg border-2 border-black'}`}>
                                Rekam Medis
                            </NavLink>

                            <button className="border-2 p-3 bg-white rounded-full my-4 text-black" onClick={logout}>Logout</button>
                        </>

                    }
                    {role === 'petugas entitas' &&
                        <>
                            <NavLink onClick={() => setIsOpen(false)} to='/entitas' className={`w-40 text-center text-black py-2 ${location.pathname === '/otentifikasi' && 'p-2 m-2 rounded-lg border-2 border-black'}`}>
                                Entitas
                            </NavLink>

                            <button className="border-2 p-3 bg-white rounded-full my-4 text-black" onClick={logout}>Logout</button>
                        </>

                    }
                    {role === 'petugas antrian' &&
                        <>

                            <NavLink onClick={() => setIsOpen(false)} to='/antrian' className={`w-40 text-center text-black py-2 ${location.pathname === '/otentifikasi' && 'p-2 m-2 rounded-lg border-2 border-black'}`}>
                                Antrian
                            </NavLink>

                            <button className="border-2 p-3 bg-white rounded-full my-4 text-black" onClick={logout}>Logout</button>
                        </>

                    }
                    {role === 'petugas pendaftaran' &&
                        <>
                            <NavLink onClick={() => setIsOpen(false)} to='/pendaftaran' className={`w-40 text-center text-black py-2 ${location.pathname === '/pendaftaran' && 'p-2 m-2 rounded-lg border-2 border-black'}`}>
                                Pendaftaran
                            </NavLink>
                            <NavLink onClick={() => setIsOpen(false)} to='/antrian' className={`w-40 text-center text-black py-2 ${location.pathname === '/otentifikasi' && 'p-2 m-2 rounded-lg border-2 border-black'}`}>
                                Antrian
                            </NavLink>

                            <button className="border-2 p-3 bg-white rounded-full my-4 text-black" onClick={logout}>Logout</button>
                        </>

                    }

                </div>
            </nav >

        </div >);
}

export default Navigation;