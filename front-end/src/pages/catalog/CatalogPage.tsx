

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import axios, { AxiosError } from "axios";

import "../../common/common.css"
import "./CatalogPage.css";
import { buildBackendUrl } from "../../common/backendClient";
import { buildMinioUrl } from "../../common/minioClient";

interface HeroData {
    id: number;
    nickname: string;
    images: string[];
}

interface Response {
    data: HeroData[];
    totalCount: number;
}

interface Pagination {
    page: number;
    limit: number;
}

export default function CatalogPage() {

    const [heroesData, setHeroesData] = useState<HeroData[]>([]);
    const [isFetching, setFetching] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<Pagination>(
        {
            page: 1,
            limit: 5,
        }
    );
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {

        const fetchData = async () => {
            try {
                const url = buildBackendUrl('/heroes/catalog');

                const response = await axios.get(
                    url,
                    {
                        params: {
                            page: pagination.page,
                            limit: pagination.limit
                        }
                    }
                )
                
                const data = await response.data as Response;
                console.log(data);

                setHeroesData(data.data); 
                setTotalCount(data.totalCount);

            } catch (error) {
                if (error instanceof AxiosError) {
                    console.error("Error:", error.response?.data || error.message);
                    setError(error.message);
                }
            } finally {
                setFetching(false);
            }
        }

        fetchData(); 
    }, [pagination])

    function setPage(page: number) {
        const newPag = {
            ...pagination
        }
        newPag.page = page;
        setPagination(newPag);
    }

    const heroes = heroesData.map(
        h => 
            <Link to={String(h.id)} className="hero-link">
            <div className="gradient-box gradient-size">
                <div className="hero-item">
                    <div className="box image-box">
                        <img src={buildMinioUrl(h.images[0])} className="hero-image"/>
                    </div>
                    <div className="hero-name"><h4>{h.nickname}</h4></div>
                </div>
            </div>
            </Link>
    )

    const pages = [];
    const pageCount = totalCount / pagination.limit;
    for (let i = 0; i < pageCount; i++) {
        let pageClass = "page";
        if (i+1 === pagination.page) {
            pageClass += " page-chosen";
        }
        pages.push(
            <button 
                type="button"
                className={pageClass}
                onClick={() => setPage(i+1)}
                key={i}
            >{i+1}</button>
        );
    }

    return <div className="catalog">
        { error && <div className="error-message"><h2>Error: {error}</h2></div> }

        <div className={`content-wrapper ${isFetching ? 'loading' : ''}`}>
            {isFetching && <div className="loader-overlay">Loading...</div>}

            <div className="heroes">
                {heroes}
            </div>
            
            <div className="pagination">
                <div className="page-numbers">
                    {pages}
                </div>
            </div>

        </div>
    </div>

}