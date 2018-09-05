import React, {Component} from 'react';
import './chips.component.css';

/**
 * Chips Component
 */
class Chips extends Component {

    /**
     * When clicking on the Chip's label
     * @param index
     */
    onSelect = (index) => {
        const {onSelect} = this.props;
        onSelect && onSelect(index);
    };

    /**
     * When clicking on the Chip's close icon
     * @param index
     */
    onRemove = (index) => {
        const {onRemove} = this.props;
        onRemove && onRemove(index);
    };

    /**
     * Render Chips
     * @returns {*}
     */
    render() {
        const {className, theme, direction, size, items, itemKey, onSelect} = this.props;

        const componentClass = [
            className,
            'chips',
            theme ? `chips--${theme}` : '',
            direction ? `chips--${direction}` : 'chips--horizontal',
            size ? `chips--${size}` : '',
            onSelect ? 'chips--selectable' : ''
        ].join(' ').trim();

        return (
            <div className={componentClass}>
                {(items || []).map((chip, index) => {
                    const label = itemKey ? chip[itemKey] : chip;
                    return (
                        <article key={`chip-${index}`} className='chips_chip'>
                            <label className='chips_label' onClick={() => this.onSelect(index)}>{label}</label>
                            <span className='chips_close' onClick={() => this.onRemove(index)}>
                                <i className='q4i-close-4pt'/>
                            </span>
                        </article>
                    );
                })}
            </div>
        );
    }
}

export default Chips;