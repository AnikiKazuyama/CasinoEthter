import React from 'react';

import '../../css/card.css';

function Card(props) {
    const { onClick, number } =  props;

    return(
        <div className="card"
             onClick={ onClick }>
            <div className="card__number">
                { number }
            </div>
        </div>
    );
}

export default Card;