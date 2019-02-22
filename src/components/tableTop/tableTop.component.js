import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {throttle} from 'lodash';
import {getClassName} from '../../utils/react.util';
import './tableTop.component.css';

/**
 * TableTop Component
 */
class TableTop extends PureComponent {

    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);

        this.state = {
            pos: {
                x: (props.startingPos && props.startingPos.x) || 0,
                y: (props.startingPos && props.startingPos.y) || 0,
            }
        };

        this.handleKeyDown = throttle(this.handleKeyDown, 1000);
    }

    /**
     * ComponentDidMount
     */
    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyDown);
    }

    /**
     * ComponentWillUnmount
     */
    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    /**
     * Handle keydown event
     * @param event
     */
    handleKeyDown = (event) => {
        const {size} = this.props;
        const {pos} = this.state;
        event = event || window.event;

        switch(event.key) {
            case 'ArrowLeft':
                return this.setState({
                    pos: {
                        ...pos,
                        x: pos.x > 0 ? pos.x - 1 : 0
                    }
                });
            case 'ArrowRight':
                return this.setState({
                    pos: {
                        ...pos,
                        x: pos.x < (size[0] - 1) ? pos.x + 1 : (size[0] - 1)
                    }
                });
            case 'ArrowUp':
                return this.setState({
                    pos: {
                        ...pos,
                        y: pos.y > 0 ? pos.y - 1 : 0
                    }
                });
            case 'ArrowDown':
                return this.setState({
                    pos: {
                        ...pos,
                        y: pos.y < (size[1] - 1) ? pos.y + 1 : (size[1] - 1)
                    }
                });
            default:
                return;
        }
    };

    /**
     * Handle start of TableTop hiding process
     * This is done to provide a fadeout animation
     */
    handleClick = (event) => {
        const {onTableTopClick} = this.props;

        event.target && event.target.blur();
        onTableTopClick && onTableTopClick(event);
    };

    /**
     * Get container styles
     * @returns {*}
     */
    getStyles = () => {
        const {size} = this.props;
        const {pos} = this.state;
        const {x, y} = pos;

        return {
            surface: {
                width: `${size[0]}00vw`,
                height: `${size[1]}00vh`,
                transform: `translate(-${100 * x}vw, -${100 * y}vh)`
            }
        };
    };

    /**
     * Render TableTop Component
     * @returns {*}
     */
    render() {
        const {className, panes} = this.props;
        const {x, y} = this.state.pos;

        const baseClassName = getClassName('table-top', [
            {condition: className, trueClassName: className}
        ]);

        const styles = this.getStyles();

        return (
            <main className={baseClassName}>
                <div className='table-top_surface' style={styles.surface}>
                    {(panes || []).map((pane) => {
                        const isActive = ((pane.x === x) && (pane.y === y));
                        const paneClassName = !isActive ? 'table-top_pane' : 'table-top_pane table-top_pane--active';

                        return (
                            <section key={`table-top-pane--${pane.id}`} className={paneClassName}>
                                <div className='table-top_pane-inner'>
                                    {pane.view}
                                </div>
                            </section>
                        );
                    })}
                </div>
            </main>
        )
    }
}

TableTop.propTypes = {
    size: PropTypes.arrayOf(PropTypes.number).isRequired,
    startingPos: PropTypes.arrayOf(PropTypes.number),
    panes: PropTypes.arrayOf(PropTypes.objectOf({
        id: PropTypes.string.isRequired,
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        view: PropTypes.oneOfType([
            PropTypes.func,
            PropTypes.object
        ])
    })),

    /**
     * A callback for when the user clicks the TableTop component
     */
    onTableTopClick: PropTypes.func
};

TableTop.defaultProps = {
    size: [1, 1],
    startingPos: [0, 0]
};

export default TableTop;