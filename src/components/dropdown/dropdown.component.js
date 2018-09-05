import React, { Component } from 'react';
import {Scrollbars} from 'react-custom-scrollbars';
import {renderLightThumb, renderDarkThumb, renderTrackVertical} from "../../../resources/theme/q4.custom-scrollbar";
import './dropdown.component.css';

/**
 * Dropdown Component
 */
class Dropdown extends Component {

    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);

        this.state = {
            expanded: false
        };

        this.setWrapperReference = this.setWrapperReference.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    /**
     * Set the wrapper ref
     */
    setWrapperReference = (node) => {
        this.wrapperReference = node;
    };

    /**
     * Handle Dropdown expansion
     */
    handleToggle = () => {
        const {expanded} = this.state;
        const {disabled} = this.props;

        if (!disabled) {
            this.setState({
                expanded: !expanded
            });
        }
    };

    /**
     * Handle Dropdown selection
     * @param option
     */
    handleSelect = (option) => {
        const {onSelect} = this.props;
        this.setState({
            expanded: false
        });

        if (onSelect && typeof onSelect === 'function') {
            onSelect(option);
        }
    };

    /**
     * Alert if clicked on outside of element
     */
    handleClickOutside = (event) => {
        if (this.wrapperReference && !this.wrapperReference.contains(event.target)) {
            this.state.expanded && this.setState({expanded: false});
        }
    };

    /**
     * Get Dropdown Options height
     * @param height
     * @param itemHeight
     * @param options
     * @param noData
     * @returns {number}
     */
    getDropdownHeight = (height, itemHeight, options, noData) => {
        const defaultItemHeight = 40;
        const remainder = 6;

        if (noData) {
            return height + remainder;
        }

        itemHeight = (!(isNaN(itemHeight)) && itemHeight) || defaultItemHeight;

        if (height) {
            return height > options.length * itemHeight ? (options.length * itemHeight + remainder) : height + remainder;
        } else {
            return (options.length * itemHeight) + remainder;
        }
    };

    /**
     * Get Dropdown styles
     * @param options
     * @param noData
     * @returns {Object}
     */
    getStyles = (options, noData) => {
        const {width, height, itemHeight, zIndex, dropdownHeight} = this.props;
        const {expanded} = this.state;

        const defaultWidth = 160;
        const defaultHeight = 40;
        const defaultToggleSize = 12;
        const remainder = 6;

        return {
            base: {
                width: width ? width : defaultWidth,
                height: height ? height : defaultHeight,
                zIndex: zIndex ? zIndex : 5
            },
            inner: {
                height: height ? height : defaultHeight,
                lineHeight: height ? `${height}px` : `${defaultHeight}px`
            },
            options: {
                height: expanded ? this.getDropdownHeight(dropdownHeight, itemHeight, options, noData) : 0
            },
            scroller: {
                height: expanded ? this.getDropdownHeight(dropdownHeight, itemHeight, options, noData) - remainder : 0
            },
            option: {
                height: itemHeight ? itemHeight : defaultHeight,
                lineHeight: itemHeight ? `${itemHeight}px` : `${defaultHeight}px`
            },
            toggle: {
                fontSize: `${Math.floor(((height ? height : defaultHeight) > 30 ? height / 10 : 0) + defaultToggleSize)}px`
            }
        };
    };

    /**
     * Get Option label
     * @param option
     * @param key
     * @returns {*}
     */
    getLabel = (option, key) => {
        return key ? option[key] : option;
    };

    /**
     * Determine if theme is one of the darker variants
     * @param theme
     * @returns {boolean}
     */
    isDarkerTheme = (theme) => {
        return (
            theme === 'dark' ||
            theme === 'slate' ||
            theme === 'dark-slate' ||
            theme === 'charcoal' ||
            theme === 'steel' ||
            theme === 'q4-blue' ||
            theme === 'ink'
        );
    };

    /**
     * Render Read More
     * @returns {*}
     */
    render() {
        const {className, theme, value, options, optionKey, placeholder, defaultLabel, disabled} = this.props;
        const {expanded} = this.state;
        const renderThumb = this.isDarkerTheme(theme) ? renderLightThumb : renderDarkThumb;
        const noData = !(options && Array.isArray(options) && options.length);
        const label = value ? (optionKey ? (value[optionKey] || defaultLabel || 'N/A') : (value || defaultLabel || 'N/A')) : (placeholder ? placeholder : 'Select');
        const styles = this.getStyles(options, noData);

        let dropdownClass = [
            `${className ? className : ''}`,
            `${expanded ? 'dropdown dropdown--expanded' : 'dropdown'}`,
            `${disabled ? 'dropdown--disabled' : ''}`,
            `${theme ? `dropdown--${theme}` : ''}`,
            `${value ? '' : 'dropdown--empty'}`
        ].join(' ');

        return (
            <div className={dropdownClass} style={styles.base} ref={this.setWrapperReference}>
                <div className='dropdown_inner' style={styles.inner} onClick={this.handleToggle}>
                    <span className='dropdown_value'>{label}</span>
                    <div className='dropdown_toggle' style={styles.toggle}>
                        {expanded ? <i className='q4i-arrow-sm-up-4pt'/> : <i className='q4i-arrow-sm-down-4pt'/>}
                    </div>
                </div>
                <div className='dropdown_options' style={styles.options}>
                    <Scrollbars
                        style={styles.scroller}
                        className='react-scrollbar'
                        hideTracksWhenNotNeeded
                        renderThumbVertical={renderThumb}
                        renderTrackVertical={renderTrackVertical}>
                        <ul className='dropdown_list'>
                            {noData ? <li className='dropdown_option' style={styles.option}>No Data Available</li> :
                                (options || []).map((option, index) => {
                                    return (
                                        <li className='dropdown_option'
                                            style={styles.option}
                                            onClick={() => this.handleSelect(option)}
                                            key={index}>
                                            {this.getLabel(option, optionKey)}
                                        </li>
                                    );
                                })
                            }
                        </ul>
                    </Scrollbars>
                </div>
            </div>
        );
    }
}

export default Dropdown;