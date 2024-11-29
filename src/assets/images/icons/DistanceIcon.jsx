import { useTheme } from '@mui/material'
import React from 'react'

const DistanceIcon = () => {
    const theme = useTheme();
    return (
        <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_1064_4474)">
                <path d="M12.5003 9.9995C12.5003 11.1025 11.6033 11.9995 10.5003 11.9995H4.42733L5.44983 10.9995H10.5008C11.0523 10.9995 11.5008 10.551 11.5008 9.9995C11.5008 9.448 11.0523 8.9995 10.5008 8.9995H8.00083C6.89783 8.9995 6.00083 8.1025 6.00083 6.9995C6.00083 6.036 6.68583 5.23 7.59433 5.0415L8.57383 5.9995H8.00083C7.44933 5.9995 7.00083 6.448 7.00083 6.9995C7.00083 7.551 7.44933 7.9995 8.00083 7.9995H10.5008C11.6038 7.9995 12.5003 8.8965 12.5003 9.9995ZM11.7678 4.2675L10.0003 5.9965L8.23633 4.2715C7.25783 3.2925 7.25783 1.707 8.23233 0.732C8.70483 0.26 9.33283 0 10.0003 0C10.6678 0 11.2958 0.26 11.7678 0.732C12.7428 1.707 12.7428 3.293 11.7678 4.2675ZM4.76783 6.732C5.74283 7.707 5.74283 9.293 4.76783 10.2675L3.00033 11.9965L1.23633 10.2715C0.257829 9.2925 0.257829 7.707 1.23233 6.732C1.70483 6.26 2.33283 6 3.00033 6C3.66783 6 4.29583 6.26 4.76783 6.732Z" fill={theme.palette.primary.main} />
            </g>
            <defs>
                <clipPath id="clip0_1064_4474">
                    <rect width="12" height="12" fill="white" transform="translate(0.5)" />
                </clipPath>
            </defs>
        </svg>

    )
}

export default DistanceIcon