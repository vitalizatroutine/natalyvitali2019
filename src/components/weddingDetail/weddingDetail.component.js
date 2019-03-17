import React from 'react';
import './weddingDetail.component.css';

/**
 * WeddingDetail functional component
 * @param props
 * @constructor
 */
const WeddingDetail = (props) => {
    const {details} = props;
    
    if (!details || !details.length) {
        return null;
    }
    
    return (
        <ul className='wedding-detail'>
            {details.map((detail) => {
                const {key, title, text} = detail;
                
                return (
                    <li key={`wedding-detail-item--${key}`} className='wedding-detail_item'>
                        <span className='wedding-detail_title'>{title}</span>
                        <span className='wedding-detail_text'>{text}</span>
                    </li>
                );
            })}
        </ul>
    );
};

export default WeddingDetail;