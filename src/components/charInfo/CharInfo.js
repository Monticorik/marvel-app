import {useState, useEffect} from 'react';
import PropTypes from 'prop-types'
import MarvelServices from '../../services/MarvelServices';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../error/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';

import './charInfo.scss';

const CharInfo = (props) => {
    const [char, setChar] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false)

    const marvelServices = new MarvelServices();

    const onCharLoaded = (newChar) => {
        if(newChar.description.length > 200){
            newChar.description = newChar.description.slice(0, 200) + '...';
        } else if(newChar.description.length === 0){
            newChar.description = 'This character currently has no description';
        }

        setChar(char => char = {...newChar});
        setLoading(false);
    } 

    const onLoading = () => {
        setLoading(true);
        setError(false);
    }

    const onError = () => {
        setLoading(false);
        setError(true);
    }

    const updateChar = (id) => {
        if(!id) return;

        onLoading();
        marvelServices
            .getCharacter(id)
            .then(onCharLoaded)
            .catch(onError);
    }

    useEffect(() => {
        updateChar(props.charId);
    }, [props.charId])

    const skeleton = !(char || loading || error) ? <Skeleton/> : null;
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(spinner || error || !char) ? <View char={char}/> : null;

    return (
        <div className="char__info">
            {skeleton}
            {errorMessage}
            {spinner}
            {content}
        </div>
    )
}

const View = ({char}) => {
    const {name, thumbnail, description, homepage, wiki, comics} = char;

    let imgStyle = null;

    if(thumbnail === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"){
        imgStyle = {objectFit: 'contain'};
    }

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} style={imgStyle} alt={name}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length > 0 ? null : "No comics available"}
                {
                        comics.map((elem, id) => {
                            if(id < 10){
                                return (
                                    <li className="char__comics-item"
                                    key={id}>
                                            {elem.name}
                                    </li>
                                )
                            }

                            return null;
                        }) || <span> No comics available</span>
                }
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number,
}

export default CharInfo;