import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {throttle} from 'lodash';
import {getClassName} from '../../utils/react.util';
import TableTopPane from './pane/tableTopPane.component';
import TableTopArrow from './arrow/tableTopArrow.component';
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
                x: startingPos.x,
                y: startingPos.y
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
        event = event || window.event;

        this.handlePaneTransition(event.key);
    };

    handlePaneTransition = (direction) => {
        const {size} = this.props;
        const {pos} = this.state;

        const newState = {
            isMoving: true
        };

        switch(direction) {
            case 'ArrowLeft':
            case 'left':
                newState.pos = {
                    ...pos,
                    x: pos.x > 0 ? pos.x - 1 : 0
                };
                break;
            case 'ArrowRight':
            case 'right':
                newState.pos = {
                    ...pos,
                    x: pos.x < (size[0] - 1) ? pos.x + 1 : (size[0] - 1)
                };
                break;
            case 'ArrowUp':
            case 'up':
                newState.pos = {
                    ...pos,
                    y: pos.y > 0 ? pos.y - 1 : 0
                };
                break;
            case 'ArrowDown':
            case 'down':
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
     * Get TableTopArrow props
     * @param panes
     * @param currentPane
     * @returns {Array}
     */
    getArrows = (panes, currentPane) => {
        const {x, y} = currentPane;

        return (panes || []).map((pane) => {
            if (!pane || !pane.label) {
                return false;
            }

            const upAvailable = (pane.x === x) && (pane.y === y - 1);
            const rightAvailable = (pane.y === y) && (pane.x === x + 1);
            const downAvailable = (pane.x === x) && (pane.y === y + 1);
            const leftAvailable = (pane.y === y) && (pane.x === x - 1);
            const arrow = {
                label: pane.label,
                onArrowClick: this.handlePaneTransition
            };

            if (upAvailable || rightAvailable || downAvailable || leftAvailable) {
                arrow.targetPos = {x: pane.x, y: pane.y}
            }

            if (upAvailable) {
                arrow.direction = 'up';
            }

            if (rightAvailable) {
                arrow.direction = 'right';
            }

            if (downAvailable) {
                arrow.direction = 'down';
            }

            if (leftAvailable) {
                arrow.direction = 'left';
            }

            return arrow;
        }).filter((pane) => pane && pane.targetPos);
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
                        const arrows = this.getArrows(panes, pane);

                        return (
                            <TableTopPane key={`table-top-pane--${pane.id}`} isActive={isActive}>
                                {(arrows || []).map((arrow) => {
                                    const {direction, label, onArrowClick} = arrow;

                                    return (
                                        <TableTopArrow
                                            direction={direction}
                                            label={label}
                                            onArrowClick={onArrowClick}
                                        />
                                    );
                                })}
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
    startingPos: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired
    }),
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