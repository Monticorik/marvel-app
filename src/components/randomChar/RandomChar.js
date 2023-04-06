import { useState, useEffect } from 'react';
import MarvelServices from '../../services/MarvelServices';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../error/ErrorMessage';

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

const RandomChar = (props) => {
    const [char, setChar] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    
    const marvelServices = new MarvelServices();

    const onCharLoaded = (newChar) => {
        if(newChar.description.length > 200){
            newChar.description = newChar.description.slice(0, 200) + '...';
        } else if(newChar.description.length === 0){
            newChar.description = 'This character currently has no description';
        }

        console.log(newChar)

        setChar(char => char = {...newChar});
        setLoading(false);
    } 

    const onError = () => {
        setLoading(false);
        setError(true);
    }

    const updateChar = () => {
        setLoading(true);
        setError(false);

        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);

        marvelServices
            .getCharacter(id)
            .then(res => onCharLoaded(res))
            .catch(onError);
    }

    useEffect(() => {
        updateChar();
    }, []);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spiner = loading ? <Spinner/> : null;
    const content = !(spiner || error) ? <ViewChar char={char}/> : null;

    return (
        <div className="randomchar">
            {errorMessage}
            {spiner}
            {content}
            <div className="randomchar__static">
                <p className="randomchar__title">
                    Random character for today!<br/>
                    Do you want to get to know him better?
                </p>
                <p className="randomchar__title">
                    Or choose another one
                </p>
                <button className="button button__main"
                        onClick={updateChar}>
                    <div className="inner">try it</div>
                </button>
                <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
            </div>
        </div>
    )
}

const ViewChar = ({char}) =>{
    const {name, description, thumbnail, homepage, wiki} = char;
    
    let imgStyle = null;

    if(thumbnail === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"){
        imgStyle = {objectFit: 'contain'};
    }

    return (
        <div className="randomchar__block">
            <img src={thumbnail} style={imgStyle} alt="Random character" className="randomchar__img"/>
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {description}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default RandomChar;