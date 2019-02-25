import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {getClassName} from '../../../utils/react.util';
import './tableTopArrow.component.css';

/**
 * TableTopArrow Component
 */
class TableTopArrow extends PureComponent {

    /**
     * Handle TableTopArrow click event
     * @param event
     */
    handleArrowClick = (event) => {
        const {direction, onArrowClick} = this.props;
        onArrowClick && onArrowClick(direction, event);
    };

    /**
     * Render TableTopArrow Component
     * @returns {*}
     */
    render() {
        const {className, direction, label} = this.props;

        const baseClassName = getClassName('table-top-arrow', [
            {condition: className, trueClassName: className},
            {condition: direction, trueClassName: `table-top-arrow--${direction}`}
        ]);

        return (
            <aside className={baseClassName} onClick={this.handleArrowClick}>
                <div className='table-top-arrow_pointer'/>
                <div className='table-top-arrow_label'>{label}</div>
            </aside>
        )
    }
}

TableTopArrow.propTypes = {
    direction: PropTypes.oneOf(['up', 'right', 'down', 'left']).isRequired,
    label: PropTypes.string.isRequired,
    targetPos: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired
    }),
    onArrowClick: PropTypes.func
};

export default TableTopArrow;