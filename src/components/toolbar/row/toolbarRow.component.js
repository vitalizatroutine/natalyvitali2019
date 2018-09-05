import React, {Component} from 'react';
import PropTypes from 'prop-types';

/**
 * ToolbarRow Component
 */
class ToolbarRow extends Component {

    /**
     * Render ToolbarRow component
     * @returns {*}
     */
    render() {
        const {children} = this.props;

        return (
            <div className='toolbar_row'>{children}</div>
        );
    }
}

ToolbarRow.propTypes = {
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
};

export default ToolbarRow;