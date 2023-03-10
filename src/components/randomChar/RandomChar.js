import { Component } from 'react';
import MarvelServices from '../../services/MarvelServices';
import Spinner from '../spiner/Spiner';
import ErrorMessage from '../error/ErrorMessage';

import './randomChar.scss';
// import thor from '../../resources/img/thor.jpeg';
import mjolnir from '../../resources/img/mjolnir.png';

class RandomChar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            char: {},
            loading: true,
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

    onError = () => {
        this.setState({
            loading: false,
            error: true,
        });
    }

    updateChar = () => {
        this.setState({
            loading: true
        });

        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);

        this.marvelServices
            .getCharacter(id)
            .then(this.onCharLoaded)
            .catch(this.onError);
    }

    componentDidMount(){
        this.updateChar();
    }

    render() {
        const {char, loading, error} = this.state;
        const errorMessage = error ? <ErrorMessage/> : null;
        const spiner = loading ? <Spinner/> : null;
        const content = !(spiner || error) ? <ViweChar char={char}/> : null;

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
                            onClick={this.updateChar}>
                        <div className="inner">try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
                </div>
            </div>
        )
    }

}

const ViweChar = ({char}) =>{
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