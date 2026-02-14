"use client"
import { Gallery3DOrbit } from "./Gallery3DOrbit";
import { Gallery3DPentagon } from "./Gallery3DPentagon";
import { Gallery3DDeck } from "./Gallery3DDeck";
import { Gallery3DFloat } from "./Gallery3DFloat";
import { Gallery3DOrbs } from "./Gallery3DOrbs";
import { GalleryList } from "./GalleryList";
import { GalleryDataItem } from "../types/Gallery";
import { ApiResponse } from "../types/ApiResponse";
import { useState, useEffect } from "react";

export const ShowRandomGallery = ({galleryContent}:{galleryContent:ApiResponse<GalleryDataItem>}) => {

    const [randomNumber, setRandomNumber] = useState<number | null>(null)

    useEffect(() => {
        const timer = setTimeout(() => {
            setRandomNumber(Math.floor(Math.random() * 6) + 1)
        }, 5000)
        return () => clearTimeout(timer)
    }, [])

    if (!randomNumber) {
        return <div className='absolute top-0 left-0 w-full h-full flex items-center justify-center'>
          <span className="loader"></span>
        </div>
    }

    return (
        <>
            {randomNumber === 1 && <Gallery3DOrbit images={galleryContent.docs} />}
            {randomNumber === 2 && <Gallery3DPentagon images={galleryContent.docs}/>}
            {randomNumber === 3 && <Gallery3DDeck images={galleryContent.docs} />}
            {randomNumber === 4 && <Gallery3DFloat images={galleryContent.docs} />}
            {randomNumber === 5 && <Gallery3DOrbs images={galleryContent.docs} />}
            {randomNumber === 6 && <GalleryList images={galleryContent.docs} />}
        </>
    )
}