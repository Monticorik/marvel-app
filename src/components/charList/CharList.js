import React, { Component } from 'react';
import PropTypes from 'prop-types'
import MarvelServices from '../../services/MarvelServices';
import Spinner from '../spiner/Spiner';
import ErrorMessage from '../error/ErrorMessage';

import './charList.scss';
// import abyss from '../../resources/img/abyss.jpg';

class CharList extends Component {
    constructor(props){
        super(props);
        this.state = {
            charList: [],
            loading: true,
            error: false,
            newItemLoading: false,
            offset: 210,
            charEnded: false,
        };
        this.charRef = React.createRef();
    }
    
    marvelServices = new MarvelServices();

    componentDidMount(){
        this.onRequaest();

        if(this.charRef.current !== null){
            
        }
    }

    onRequaest = (offset) => {
        this.onCharListLoading()
        this.marvelServices
        .getAllCharacters(offset)
        .then(this.onCharListLoaded)
        .catch(this.onError);
    } 

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true,
        })
    } 

    onCharListLoaded = (newCharList) => {
        let ended = false;
        if(newCharList.length < 9){
            ended = true;
        }

        this.setState(({charList, offset}) => ({
            charList: [...charList, ...newCharList],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended,
        }))
    } 

    onError = () => {
        this.setState({
            loading: false,
            error: true,
        });
    }

    highlightChar = e => {
        if(this.charRef.current !== null){
            this.charRef.classList.remove('char__item_selected');
        }

        this.charRef = e.currentTarget;
        this.charRef.classList.add('char__item_selected');
        this.charRef.onfocus = 0;
    }

    viewCharList = (charList) => {
        const characters = charList.map(({name, thumbnail, id}) => {
            let imgStyle = null;
            if(thumbnail === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg" ){
                imgStyle = {objectFit: 'unset'};
            }
            return (<li className="char__item"
                        key={id} 
                        tabIndex = "0"
                        onFocus={this.highlightChar}
                        onClick={(e) => {
                            this.props.onCharUpdate(id);
                            this.highlightChar(e);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === ' ' || e.key === "Enter") {
                                this.props.onCharUpdate(id);
                            }
                        }}>
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

    loadMoreChar = () =>{
        this.setState({
            limit: this.state.limit + 9,
        });

        this.updateCharList();
    }

    render() {
        const {charList, loading, error, newItemLoading, offset, charEnded} = this.state;
        const errorMessage = error ? <ErrorMessage/> : null;
        const spiner = loading ? <Spinner/> : null;
        const content = !(spiner || error) ? this.viewCharList(charList) : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spiner}
                {content}
                <button 
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{display: charEnded ? 'none' : 'block'}}
                onClick={() => this.onRequaest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onCharUpdate: PropTypes.func,
}


export default CharList;