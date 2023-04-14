import { useState } from "react";

import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import ErrorBoundary from "../errorBoundary/ErrorBoundary";

import decoration from '../../resources/img/vision.png';

const MainPage = () => {

    const [charId, setCharId] = useState(null);

    const onCharUpdate = (id) => {
        setCharId(id);
    }

    return (
        <>
            <ErrorBoundary>
                <RandomChar/>
            </ErrorBoundary>
            <div className="char__content">
                <ErrorBoundary>
                    <CharList onCharUpdate={onCharUpdate}/>
                </ErrorBoundary>
                <ErrorBoundary>
                    <CharInfo charId={charId}/>
                </ErrorBoundary>
            </div>
            <img className="bg-decoration" src={decoration} alt="vision"/>
        </>
    )
}

export default MainPage;