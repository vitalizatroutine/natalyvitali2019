import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {getClassName} from '../../../utils/react.util';
import './tableTopPane.component.css';

/**
 * TableTopPane Component
 */
class TableTopPane extends PureComponent {

    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);

        this.state = {
            shouldRender: props.isActive || false
        };

        this.isTransitioning = false;
    }

    /**
     * ComponentDidUpdate
     */
    componentDidUpdate(prevProps) {
        const {isActive} = this.props;

        if (prevProps.isActive !== isActive) {
            this.handleSetShouldRender(isActive);
        }
    }

    /**
     * ComponentDidUpdate
     */
    componentWillUnmount() {
        this.isTransitioning = false;
    }

    /**
     * Handle un-mounting the component
     * @param shouldRender
     */
    handleSetShouldRender = (shouldRender) => {
        if (this.isTransitioning) {
            return;
        }

        this.isTransitioning = true;
        setTimeout(() => {
            this.isTransitioning && this.setState({shouldRender});
            this.isTransitioning = false;
        }, 1000);
    };

    /**
     * Render TableTopPane Component
     * @returns {*}
     */
    render() {
        const {className, children, isActive} = this.props;
        const {shouldRender} = this.state;

        const baseClassName = getClassName('table-top-pane', [
            {condition: className, trueClassName: className},
            {condition: isActive, trueClassName: 'table-top-pane--active'}
        ]);

        return (
            <section className={baseClassName}>
                <div className='table-top-pane_inner'>
                    {shouldRender && children}
                </div>
            </section>
        )
    }
}

TableTopPane.propTypes = {
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    isActive: PropTypes.bool.isRequired
};

TableTopPane.defaultProps = {
    isActive: false
};

export default TableTopPane;