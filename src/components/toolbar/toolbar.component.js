import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ToolbarRow from './row/toolbarRow.component';
import './toolbar.component.css';

/**
 * Toolbar Component
 */
class Toolbar extends Component {

    /**
     * Render Toolbar component
     * @returns {*}
     */
    render() {
        const {theme, children} = this.props;
        const renderRow = (
            (React.isValidElement(children) && children.type && children.type.name !== 'ToolbarRow') || (
                (children && children.length) &&
                React.isValidElement(children[0]) && children[0].type && children[0].type.name !== 'ToolbarRow'
            )
        );

        return (
            <div className={`toolbar ${theme ? `toolbar--${theme}` : ''}`}>
                <div className='toolbar_inner'>
                    {renderRow ? (
                        <ToolbarRow>{children}</ToolbarRow>
                    ) : children}
                </div>
            </div>
        );
    }
}

Toolbar.propTypes = {
    theme: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
};

export default Toolbar;