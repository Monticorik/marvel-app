import { Component } from 'react';
import PropTypes from 'prop-types'
import MarvelServices from '../../services/MarvelServices';
import Spinner from '../spiner/Spiner';
import ErrorMessage from '../error/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';

import './charInfo.scss';

class CharInfo extends Component {
    constructor(props){
        super(props);
        this.state = {
            char: null,
            loading: false,
            error: false,
        }
    }

    marvelServices = new MarvelServices();

    onCharLoaded = (char) => {
        if(char.description.length > 200){
            char.description = char.description.slice(0, 200) + '...';
        } else if(char.description.length === 0){
            char.description = 'This character currently has no description';
        }

        this.setState({
            char, 
            loading: false
        });
    } 

    onLoading = () => {
        this.setState({ 
            loading: true,
            error: false,
        });
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true,
        });
    }

    updateChar = (id) => {
        const {charId} = this.props;
        if(!charId) return;

        this.onLoading();
        this.marvelServices
            .getCharacter(id)
            .then(this.onCharLoaded)
            .catch(this.onError);
    }

    componentDidMount(){
        this.updateChar();
    }

    componentDidUpdate(prevProps){
        if(prevProps.charId !== this.props.charId){
            this.updateChar(this.props.charId);
        }
    }

    render(){
        const {char, loading, error} = this.state;

        const skeleton = !(char || loading || error) ? <Skeleton/> : null;
        const errorMessage = error ? <ErrorMessage/> : null;
        const spiner = loading ? <Spinner/> : null;
        const content = !(spiner || error || !char) ? <View char={char}/> : null;

        return (
            <div className="char__info">
                {skeleton}
                {errorMessage}
                {spiner}
                {content}
            </div>
        )
    }
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