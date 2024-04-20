import React from 'react'
import { useParams } from 'react-router-dom'

function ShowCv() {
    const { id, themeId } = useParams()
    console.log(id,themeId);
    return (
        <div>ShowCv</div>
    )
}

export default ShowCv