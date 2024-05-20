import React from 'react'

function Header({ userData, user, logout }) {
    console.log("userData", userData, user);
    return (
        <div className='bg-themeColor75 pb-24'>
            <div className='container mx-auto'>
                <div className=' flex justify-between items-center text-white py-5'>
                    <div className='flex items-center gap-2'>
                        <img width={40} className='rounded-full' src={userData?.personalInfo?.image} alt="" />
                        <h2>{user?.email}</h2>
                    </div>
                    <button
                        className='bg-red-400 text-white py-2 px-4 rounded-xl'
                        onClick={logout}
                    >
                        Log out
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Header