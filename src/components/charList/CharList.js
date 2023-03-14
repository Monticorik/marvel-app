import { Component } from 'react';
import MarvelServices from '../../services/MarvelServices';
import Spinner from '../spiner/Spiner';
import ErrorMessage from '../error/ErrorMessage';

import './charList.scss';
// import abyss from '../../resources/img/abyss.jpg';

class CharList extends Component {
    constructor(props){
        super(props)
        this.state = {
            limit: 9,
            charList: [],
            loading: true,
            error: false,
        }
    }
    
    marvelServices = new MarvelServices();

    updateCharList = () => {
        this.marvelServices
        .getAllCharacters(this.state.limit)
        .then(this.onCharListLoaded)
        .catch(this.onError);
    }

    onCharListLoaded = (charList) => {
        this.setState({
            charList,
            loading: false,
        })
    } 

    onError = () => {
        this.setState({
            loading: false,
            error: true,
        });
    }

    componentDidMount(){
        this.updateCharList();
    }

    componentDidUpdate(){
    }

    viewCharList = (charList) => {
        const characters = charList.map(({name, thumbnail, id}) => {
            let imgStyle = null;
            if(thumbnail === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg" ){
                imgStyle = {objectFit: 'unset'};
            }
            return (<li className="char__item"
                        key={id} 
                        onClick={() => this.props.onCharUpdate(id)}>
                        <img src={thumbnail} alt={name} style={imgStyle}/>
                        <div className="char__name">{name}</div>
                    </li>)
        })
    
        return (
            <ul className="char__grid">
                {characters}
            </ul>
        )
    }

    render() {
        const {charList, loading, error} = this.state;
        const errorMessage = error ? <ErrorMessage/> : null;
        const spiner = loading ? <Spinner/> : null;
        const content = !(spiner || error) ? this.viewCharList(charList) : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spiner}
                {content}
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}


export default CharList;