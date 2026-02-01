import { Link, useParams } from "react-router-dom"
import axios from "axios";

import "../../common/common.css"
import "./HeroPage.css"
import { useEffect, useState } from "react";
import { buildBackendUrl } from "../../common/backendClient";
import { buildMinioUrl } from "../../common/minioClient";

interface HeroData{
    id: number;
    nickname: string;
    realName: string;
    originDescription: string;
    superpowers: string[];
    images: string[];
}

export default function HeroPage() {

    const { heroId } = useParams();
    const [ hero, setHero ] = useState<HeroData | null>(null);

    useEffect(() => {

        async function fetchData() {
            const url = buildBackendUrl("/heroes/" + heroId)

            try {
                const response = await axios.get(url);

                const data = response.data as HeroData;
                setHero(data);          
                
            } catch (error) {
                console.log("Errro:", error);
            }
        }

        fetchData();
    }, [])

    const superpowers = hero?.superpowers.map(
        s => <li>{s}</li>
    );

    const images = hero?.images.slice(1).map(
        i => <div className="main-image">
            <img src={buildMinioUrl(i)}></img>
        </div>
    )

    async function deleteRequest() {
        const url = buildBackendUrl("/heroes")

            try {
                
                await axios.delete(url,{
                    data: {
                        id: heroId
                    }
                });
                
                alert("Hero had been deleted");
                
            } catch (error) {
                console.log("Errro:", error);
            }

    }

    return <div className="hero-page">
        <div className="gradient-box content">
            <div className="box content-parts">
                <div className="left-part">
                    <div className="main-info">
                        <div className="main-image">
                            <img src={buildMinioUrl(hero?.images[0] || '')}></img>
                        </div>
                        <div className="info">
                            <div className="names">
                                <div className="name"><b>Nickname:</b> {hero?.nickname}</div>
                                <div className="name"><b>Real name:</b> {hero?.realName}</div>
                                <div className="name"><b>Origin description:</b><br/> {hero?.originDescription}</div>
                                <div className="name"><b>Superpowers:</b></div>
                                <ul>
                                    {superpowers}
                                </ul>
                            </div>
                        </div>
                    </div> 
                    <div className="buttons">
                        <Link
                            to="edit"
                            className="gradient-box button"
                        >
                            Edit
                        </Link>
                        <button 
                            className="delete-button" 
                            type="button"
                            onClick={deleteRequest}
                        >
                            Delete
                        </button>
                    </div>

                              
                </div>
                <div className="rigth-part">
                    <div className="images">
                        {images}
                    </div>

                </div>
            </div>
        </div>

    </div>
}