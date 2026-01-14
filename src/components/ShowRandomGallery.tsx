"use client"
import { useEffect, useState } from "react"
import { Gallery3DOrbit } from "./Gallery3DOrbit";
import { Gallery3DPentagon } from "./Gallery3DPentagon";
import { Gallery3DDeck } from "./Gallery3DDeck";
import { Gallery3DFloat } from "./Gallery3DFloat";
import { Gallery3DOrbs } from "./Gallery3DOrbs";
import { GalleryDataItem } from "../types/Gallery";
import { ApiResponse } from "../types/ApiResponse";

export const ShowRandomGallery = ({galleryContent}:{galleryContent:ApiResponse<GalleryDataItem>}) => {

    const [randomNumber, setRandomNumber] = useState(Math.floor(Math.random() * 5) + 1)

    useEffect(() => {
          setRandomNumber(Math.floor(Math.random() * 5) + 1);
    },[])

    return (
        <>
            {randomNumber === 1 && <Gallery3DOrbit images={galleryContent.docs} />}
            {randomNumber === 2 && <Gallery3DPentagon images={galleryContent.docs}/>}
            {randomNumber === 3 && <Gallery3DDeck images={galleryContent.docs} />}
            {randomNumber === 4 && <Gallery3DFloat images={galleryContent.docs} />}
            {randomNumber === 5 && <Gallery3DOrbs images={galleryContent.docs} />}
        </>
    )
}