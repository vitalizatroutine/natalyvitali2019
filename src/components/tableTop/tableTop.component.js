import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {throttle} from 'lodash';
import {getClassName} from '../../utils/react.util';
import TableTopPane from './pane/tableTopPane.component';
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

        const {startingPos} = props;
        const pos = {x: 0, y: 0};

        if (startingPos) {
            Object.assign(pos, {
                x: startingPos[0],
                y: startingPos[1]
            })
        }

        this.state = {
            pos,
            isMoving: false
        };

        this.handleKeyDown = throttle(this.handleKeyDown, 1050);
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

        const newState = {
            isMoving: true
        };

        switch(event.key) {
            case 'ArrowLeft':
                newState.pos = {
                    ...pos,
                    x: pos.x > 0 ? pos.x - 1 : 0
                };
                break;
            case 'ArrowRight':
                newState.pos = {
                        ...pos,
                        x: pos.x < (size[0] - 1) ? pos.x + 1 : (size[0] - 1)
                };
                break;
            case 'ArrowUp':
                newState.pos = {
                        ...pos,
                        y: pos.y > 0 ? pos.y - 1 : 0
                };
                break;
            case 'ArrowDown':
                newState.pos = {
                    ...pos,
                    y: pos.y < (size[1] - 1) ? pos.y + 1 : (size[1] - 1)
                };
                break;
            default:
                break;
        }

        this.setState(newState, () => {
            setTimeout(() => this.setState({isMoving: false}), 1000);
        })
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
                width: `calc(${size[0]}00vw + ${size[0] * 40}px)`,
                height: `calc(${size[1]}00vw + ${size[1] * 40}px)`,
                transform: `translate(calc(-${100 * x}vw - ${40 * x + 20}px), calc(-${100 * y}vh - ${40 * y + 20}px))`
            }
        };
    };

    /**
     * Render TableTop Component
     * @returns {*}
     */
    render() {
        const {className, panes} = this.props;
        const {pos, isMoving} = this.state;
        const {x, y} = pos;

        const baseClassName = getClassName('table-top', [
            {condition: className, trueClassName: className}
        ]);
        const surfaceClassName = isMoving ? 'table-top_surface table-top_surface--moving' : 'table-top_surface';

        const styles = this.getStyles();

        return (
            <main className={baseClassName}>
                <div className={surfaceClassName} style={styles.surface}>
                    {(panes || []).map((pane) => {
                        const isActive = ((pane.x === x) && (pane.y === y));

                        return (
                            <TableTopPane key={`table-top-pane--${pane.id}`} isActive={isActive}>
                                {pane.view}
                            </TableTopPane>
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
    panes: PropTypes.arrayOf(PropTypes.shape({
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