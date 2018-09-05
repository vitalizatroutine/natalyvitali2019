import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {uniq, groupBy} from 'lodash';
import {Scrollbars} from 'react-custom-scrollbars';
import {renderDarkThumb, renderTrackVertical} from '../../../resources/theme/q4.custom-scrollbar';
import './autocomplete.component.css';

class Autocomplete extends Component {

    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);

        this.state = {
            value: props.value ? props.value : '',
            isOpen: false,
            isSelected: false,
            selectedIndex: props.openOnFocus ? 1 : 0
        };

        this.componentReference = React.createRef();
        this.scrollbarsReference = React.createRef();
        this.inputReference = React.createRef();
    }

    /**
     * ComponentDidMount
     */
    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
        document.addEventListener('keydown', this.handleKeyDown);
    }

    /**
     * ComponentWillUnmount
     */
    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    /**
     * Handle input change
     * @param event
     */
    handleInputChange = (event) => {
        const {openOnFocus, minLength, buffer, onQueryChange} = this.props;
        const target = event.target;
        const value = target.value && target.value.trim();
        const name = target.name;

        this.setState({
            [name]: value,
            isOpen: openOnFocus || (value && value.length >= (minLength || 0)),
            isSelected: false,
            selectedIndex: 1
        });

        if (value.length >= (minLength || 0)) {
            this.queryTimeout && clearTimeout(this.queryTimeout);
            this.queryTimeout = setTimeout(() => {
                onQueryChange && onQueryChange(value);
            }, (buffer === 0 || buffer) ? buffer : 400);
        }
    };

    /**
     * Handle text input focus
     * @param event
     */
    handleInputFocus = (event) => {
        const {openOnFocus, onInputFocus} = this.props;

        const value = event.target.value;
        event.target.value = '';
        event.target.value = value;

        if (openOnFocus) {
            this.setState({
                isOpen: true
            });
        }

        onInputFocus && onInputFocus();
    };

    /**
     * Handle text input blur
     */
    handleInputBlur = () => {
        const {onInputBlur} = this.props;
        onInputBlur && onInputBlur();
    };

    /**
     * Handle refocusing of input
     */
    handleRefocusInput = () => {
        const Input = this.inputReference && this.inputReference.current;
        Input && Input.focus();
    };

    /**
     * If clicked on outside of element, close the results
     */
    handleClickOutside = (event) => {
        const componentWrap = this.componentReference && this.componentReference.current;

        if (componentWrap && !componentWrap.contains(event.target)) {
            this.state.isOpen && this.setState({isOpen: false});
        }
    };

    /**
     * Handle keydown event
     * @param event
     */
    handleKeyDown = (event) => {
        event = event || window.event;

        switch(event.key) {
            case 'Escape':
            case 'Esc':
                return this.componentReference && this.handleCancel();
            case 'ArrowUp':
                event.preventDefault();
                return this.handleArrowNavigation('up');
            case 'ArrowDown':
                event.preventDefault();
                return this.handleArrowNavigation('down');
            case 'Enter':
                return (
                    this.state.isOpen &&
                    this.state.selectedIndex &&
                    this.handleSelect(this.props.items[this.state.selectedIndex - 1])
                );
            default:
                return;
        }
    };

    /**
     * Handle Autocomplete Up / Down arrow navigation
     * @param direction
     */
    handleArrowNavigation = (direction) => {
        const {items} = this.props;
        const {selectedIndex} = this.state;

        switch(direction) {
            case 'up':
                if (selectedIndex > 1) {
                    this.setState({
                        selectedIndex : selectedIndex - 1
                    }, () => this.handleScroll(this.state.selectedIndex, 'up'));
                }
                break;
            case 'down':
                if (selectedIndex < items.length) {
                    this.setState({
                        selectedIndex : selectedIndex + 1
                    }, () => this.handleScroll(this.state.selectedIndex, 'down'));
                }
                break;
            default:
                return;
        }
    };

    /**
     * Handle Autocomplete Scrolling Logic
     * @param selectedIndex
     * @param direction
     */
    handleScroll = (selectedIndex, direction) => {
        // todo: ensure perfect scrolling with categorized results
        const {categoryKey, itemHeight, resultHeight} = this.props;
        const scrollbarsComponent = this.scrollbarsReference && this.scrollbarsReference.current;

        if (!scrollbarsComponent || !resultHeight) {
            return;
        }

        if (!selectedIndex) {
            return scrollbarsComponent.scrollTop(0);
        }

        const defaultItemHeight = categoryKey ? 25 : 40;
        const preferredHeight = itemHeight || defaultItemHeight;
        const resultScrollTop = scrollbarsComponent.getScrollTop();
        const withinBounds = (
            (preferredHeight * selectedIndex - preferredHeight >= resultScrollTop) &&
            (preferredHeight * selectedIndex <= resultScrollTop + resultHeight)
        );

        let scrollTop = preferredHeight * selectedIndex - preferredHeight;

        switch(direction) {
            case 'up':
                !withinBounds && scrollbarsComponent.scrollTop(scrollTop);
                break;
            case 'down':
                scrollTop = preferredHeight * selectedIndex - resultHeight;
                !withinBounds && scrollbarsComponent.scrollTop(scrollTop);
                break;
            default:
                return;
        }
    };

    /**
     * Handle Autocomplete result selection
     * @param item
     */
    handleSelect = (item) => {
        if (!item) {
            return;
        }

        const {items, keepOpenOnSelect, rememberQueryOnSelect, emptyOnSelect, onSelect, onQueryChange} = this.props;
        const {value, selectedIndex} = this.state;

        this.setState({
            value: emptyOnSelect ? (rememberQueryOnSelect ? value : '') : this.getLabel(item),
            isOpen: !!keepOpenOnSelect,
            isSelected: !emptyOnSelect,
            selectedIndex: keepOpenOnSelect ? (selectedIndex >= items.length ? items.length - 1 : selectedIndex) : 0
        });

        onSelect && onSelect(item);

        // todo: investigate why this works with onKeyDown but not with onClick
        if (rememberQueryOnSelect) {
            this.handleRefocusInput();
            onQueryChange && onQueryChange(value);
        }

        if (!keepOpenOnSelect) {
            this.handleScroll();
        }
    };

    /**
     * Handle Autocomplete selection clear
     */
    handleClear = () => {
        const {onClear} = this.props;
        this.setState({
            value: '',
            isOpen: false,
            isSelected: false
        });

        this.handleRefocusInput();
        onClear && onClear();
    };

    /**
     * Handle Autocomplete Cancel
     */
    handleCancel = () => {
        const {onInputBlur} = this.props;

        this.setState({
            isOpen: false,
            selectedIndex: 0
        }, () => {
            onInputBlur && onInputBlur();
        });
    };

    /**
     * Get Height of the results
     * @param resultHeight
     * @param itemHeight
     * @param items
     * @param categoryKey
     * @param categoryHeight
     * @param noData
     * @returns {number}
     */
    getResultsHeight = (resultHeight, itemHeight, items, categoryKey, categoryHeight, noData) => {
        const defaultItemHeight = categoryKey ? 25 : 40;
        itemHeight = (!(isNaN(itemHeight)) && itemHeight) || defaultItemHeight;

        // always return standard 40px if no data
        if (noData) {
            return 40;
        }

        const totalItemHeight = items.length * itemHeight;

        if (categoryKey) {
            const defaultCategoryHeight = categoryHeight || 35;
            const categoryCount = uniq(items.map((item) => item[categoryKey])).length;
            const categorizedResultsFiller = (categoryCount * defaultCategoryHeight) + 18;

            if (resultHeight) {
                const determinedHeight = (resultHeight > totalItemHeight) ? totalItemHeight : resultHeight;
                return determinedHeight + categorizedResultsFiller;
            } else {
                return totalItemHeight + categorizedResultsFiller;
            }
        } else {
            return resultHeight ? (resultHeight > totalItemHeight) ? totalItemHeight : resultHeight : totalItemHeight;
        }
    };

    /**
     * Get Autocomplete component styles
     * @param items
     * @param noData
     * @returns {Object}
     */
    getStyles = (items, noData) => {
        const {width, height, itemHeight, resultHeight, categoryKey, categoryHeight, zIndex} = this.props;
        const {isOpen} = this.state;

        const defaultWidth = 160;
        const defaultHeight = 40;
        const defaultItemHeight = categoryKey ? 25 : 40;
        const defaultCategoryHeight = categoryHeight || 35;

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
            input: {
                height: height ? height : defaultHeight,
                lineHeight: height ? `${height}px` : `${defaultHeight}px`,
                padding: height ? `0 ${height + 15}px 0 15px` : `0 ${defaultHeight + 15}px 0 15px`
            },
            icon: {
                width: height ? height : defaultHeight,
                lineHeight: height ? `${height}px` : `${defaultHeight}px`
            },
            results: {
                height: isOpen ? this.getResultsHeight(resultHeight, itemHeight, items, categoryKey, categoryHeight, noData) : 0
            },
            category: {
                height: categoryHeight ? categoryHeight : defaultCategoryHeight,
                lineHeight: categoryHeight ? `${categoryHeight}px` : `${defaultCategoryHeight}px`
            },
            item: {
                height: itemHeight ? itemHeight : defaultItemHeight,
                lineHeight: itemHeight ? `${itemHeight}px` : `${defaultItemHeight}px`
            }
        };
    };

    /**
     * Get Autocomplete item label
     * @param item
     * @returns {*}
     */
    getLabel = (item) => {
        const {itemKey, customRender} = this.props;
        let label = item;

        if (itemKey && !customRender) {
            label = item[itemKey];
        } else if (customRender) {
            label = customRender(label);
        }

        return label;
    };

    /**
     * Render the inner portion of the Autocomplete component
     * @param value
     * @param placeholder
     * @param isSelected
     * @param disabled
     * @param loading
     * @param styles
     * @returns {XML}
     */
    renderInner = (value, placeholder, isSelected, disabled, loading, styles) => {
        return isSelected ? (
            <div className='autocomplete_inner' style={styles.inner}>
                <div className='autocomplete_value' style={styles.input}>{value}</div>
                <div className='autocomplete_icon' style={styles.icon} onClick={this.handleClear}>
                    <i className='q4i-close-4pt'/>
                </div>
            </div>
        ) : (
            <div className='autocomplete_inner' style={styles.inner}>
                <input ref={this.inputReference}
                       className='autocomplete_input'
                       style={styles.input}
                       name='value'
                       placeholder={placeholder || 'Begin typing...'}
                       maxLength={32}
                       value={value}
                       readOnly={isSelected || disabled}
                       onFocus={this.handleInputFocus}
                       onBlur={this.handleInputBlur}
                       onChange={this.handleInputChange}
                />
                <div className='autocomplete_icon autocomplete_icon--disabled' style={styles.icon}>
                    {loading ? <i className='autocomplete_spinner'/> : <i className='q4i-search-2pt'/>}
                </div>
            </div>
        );
    };

    /**
     * Render Items
     * @param items
     * @param styles
     * @returns {XML}
     */
    renderItems = (items, styles) => {
      return (
          <ul className='autocomplete_list'>
              {(items || []).map((item, index) => {
                  const className = [
                      'autocomplete_item',
                      index === (this.state.selectedIndex - 1) ? 'autocomplete_item--selected' : ''
                  ].join(' ').trim();

                  return (
                      <li
                          key={`autocomplete-item--${index}`}
                          className={className}
                          style={styles.item}
                          onClick={() => this.handleSelect(item)}
                          onMouseOver={() => this.setState({selectedIndex: index + 1})}
                      >
                          {this.getLabel(item)}
                      </li>
                  );
              })}
          </ul>
      );
    };

    /**
     * Render Categorized items
     * @param items
     * @param styles
     */
    renderCategorizedItems = (items, styles) => {
        const {categoryKey, categoryIcons} = this.props;

        const processedItems = items.map((item, index) => Object.assign({}, item, {originalIndex: index}));
        const categorizedItems = groupBy(processedItems, (item) => item[categoryKey]);

        return Object.keys(categorizedItems).map((category) => {
            return (
                <div className='autocomplete_category' key={`autocomplete-category--${category}`}>
                    <div className='autocomplete_category-title' style={styles.category}>
                        {categoryIcons && categoryIcons[category] && <i className={categoryIcons[category]} />}
                        <span>{category}</span>
                    </div>
                    <ul className='autocomplete_list'>
                        {(categorizedItems[category]).map((item) => {
                            const className = [
                                'autocomplete_item',
                                item.originalIndex === (this.state.selectedIndex - 1) ? 'autocomplete_item--selected' : ''
                            ].join(' ');

                            return (
                                <li
                                    key={`autocomplete-item--${item.originalIndex}`}
                                    className={className}
                                    style={styles.item}
                                    onClick={() => this.handleSelect(item)}
                                    onMouseOver={() => this.setState({selectedIndex: item.originalIndex + 1})}
                                >
                                    {this.getLabel(item)}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            );
        });
    };

    /**
     * Render Autocomplete Component
     * @returns {*}
     */
    render() {
        const {className, items, categoryKey, theme, disabled, loading, resultPosition, placeholder, noResultsText} = this.props;
        const {value, isOpen, isSelected} = this.state;
        const noData = !(items && items.length);
        const styles = this.getStyles(items, noData);

        const componentClass = [
            className ? className : '',
            isOpen ? 'autocomplete autocomplete--is-open' : 'autocomplete',
            noData ? 'autocomplete--no-data' : '',
            disabled ? 'autocomplete--disabled' : '',
            loading ? 'autocomplete--loading' : '',
            theme ? `autocomplete--${theme}` : '',
            resultPosition ? `autocomplete--from-${resultPosition}` : '',
            categoryKey ? 'autocomplete--categorized' : '',
            value ? '' : 'autocomplete--empty'
        ].join(' ');

        return (
            <div className={componentClass.trim()} style={styles.base} ref={this.componentReference}>
                {this.renderInner(value, placeholder, isSelected, disabled, loading, styles)}
                <div className='autocomplete_items' style={styles.results}>
                    {noData ? (
                        <span className='autocomplete_no-data-text'>{noResultsText || 'No results available'}</span>
                    ) : (
                        <Scrollbars
                            ref={this.scrollbarsReference}
                            className='react-scrollbar'
                            hideTracksWhenNotNeeded
                            renderThumbVertical={renderDarkThumb}
                            renderTrackVertical={renderTrackVertical}
                        >
                            {categoryKey ? this.renderCategorizedItems(items, styles) : this.renderItems(items, styles)}
                        </Scrollbars>
                    )}
                </div>
            </div>
        );
    }
}

Autocomplete.propTypes = {
    className: PropTypes.string,
    theme: PropTypes.string,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    itemHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    resultHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    resultPosition: PropTypes.string,
    zIndex: PropTypes.number,

    placeholder: PropTypes.string,
    noResultsText: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.object]),
    items: PropTypes.array.isRequired,
    itemKey: PropTypes.string,
    customRender: PropTypes.func,

    categoryKey: PropTypes.string,
    categoryIcons: PropTypes.object,
    categoryHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

    minLength: PropTypes.number,
    buffer: PropTypes.number,
    openOnFocus: PropTypes.bool,
    emptyOnSelect: PropTypes.bool,
    keepOpenOnSelect: PropTypes.bool,
    rememberQueryOnSelect: PropTypes.bool,
    loading: PropTypes.bool,
    disabled: PropTypes.bool,

    onInputFocus: PropTypes.func,
    onInputBlur: PropTypes.func,
    onRemove: PropTypes.func,
    onQueryChange: PropTypes.func,
    onSelect: PropTypes.func,
};

export default Autocomplete;