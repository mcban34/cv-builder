import React from 'react'

function Loading() {
    return (
        <div className='h-[100vh] w-full flex justify-center items-center'>
            <div className='animate-pulse animate-infinite'>
                <span className='bg-themeColor100 text-white p-5'>Loading..</span>
            </div>
        </div>
    )
}

export default Loading