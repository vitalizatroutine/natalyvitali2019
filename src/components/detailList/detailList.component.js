import React, {Component} from 'react';
import PropType from 'prop-types';
import {isEmpty} from 'lodash';
import './detailList.component.css';

/**
 * DetailList Component
 */
class DetailList extends Component {

    /**
     * Render Detail List Component
     * @returns {*}
     */
    render() {
        const {title, items, labelWidth} = this.props;

        if (!title || !items || isEmpty(items)) {
            return null;
        }

        const labelStyle = {
            minWidth: labelWidth ? labelWidth : 70
        };

        return (
            <div className='detail-list q4-fade-in'>
                {title ? <h2 className='detail-list_title'>{title}</h2> : null}
                <ul className='detail-list_list'>
                    {items.map((item, index) => {
                        if (!item) {
                            return null;
                        }

                        return (
                            <li key={`${title}-detail-list_item--${index}`} className='detail-list_item'>
                                {item.icon ? (
                                    <i className={`detail-list_icon ${item.theme ? `detail-list_icon--${item.theme}` : ''} ${item.icon}`}/>
                                ) : null}
                                {item.label ? (
                                    <div className='detail-list_label' style={labelStyle}>{item.label}</div>
                                ) : null}
                                {typeof item.value === 'string' || typeof item.value === 'object' ? (
                                    <div className='detail-list_value'>{item.value}</div>
                                ) : (
                                    <div className='detail-list_value'>
                                        {item.value.map((value) => {
                                            return <span>{value}</span>;
                                        })}
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }
}

DetailList.propTypes = {
    title: PropType.string.isRequired,
    items: PropType.array.isRequired,
    labelWidth: PropType.number
};

export default DetailList;