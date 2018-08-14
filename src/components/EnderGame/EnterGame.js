import React from 'react';

import '../../App.css';
import './style.css';

export default function EnterGame(props) {

    const classError = 'enter-game__input-error';

    return (
        <div className="container container--col enter-game">
            <h2 className={`enter-game__title container__item ${ classError }`}>В данный момент вы не находитесь в игре, хотите присоединиться ?</h2>
            <div className="enter-game__body container__item">
                <h3>Введите своё имя</h3>
                <input className="enter-game__input" type="text" onChange={ props.onNameChange }/>
            </div>
            <button className="enter-game__button container__item" onClick={ props.enter }>Начать игру!</button>
        </div>
    )
}