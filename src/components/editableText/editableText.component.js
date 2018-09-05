import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './editableText.component.css';

class EditableText extends Component {

    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);

        this.state = {
            value: props.value ? props.value : '',
            storedValue: props.value ? props.value : '',
            editing: false
        };

        this.setWrapperReference = this.setWrapperReference.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
        document.addEventListener('keydown', this.handleKeyDown);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    /**
     * Set the wrapper ref
     */
    setWrapperReference = (node) => {
        this.wrapperReference = node;
    };

    /**
     * Set the wrapper ref
     */
    setInputReference = (node) => {
        this.inputReference = node;
    };

    /**
     * Handle input change
     * @param event
     */
    handleInputChange = (event) => {
        const {onQueryChange} = this.props;
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });

        if (this.isValid(value) && onQueryChange) {
            onQueryChange(value);
        }
    };

    /**
     * Handle edit click
     */
    handleEdit = () => {
        this.setState({
            editing: true,
            storedValue: this.state.value
        }, () => {
            this.inputReference && this.inputReference.focus();
        });
    };

    /**
     * Handle text or checkbox input change
     * @param event
     */
    handleInputFocus = (event) => {
        const value = event.target.value;
        event.target.value = '';
        event.target.value = value;
    };

    /**
     * Handle EditableText Cancel
     * @param value
     */
    handleCancel = (value) => {
        const {storedValue} = this.state;
        const {onCancel} = this.props;

        this.setState({
            editing: false,
            value: storedValue
        });

        if (onCancel && typeof onCancel === 'function') {
            onCancel(value);
        }
    };

    /**
     * Handle EditableText Submit
     * @param value
     */
    handleSubmit = (value) => {
        if (!this.isValid(value)) {
            return;
        }

        const {onSubmit} = this.props;

        this.setState({
            editing: false
        });

        if (onSubmit && typeof onSubmit === 'function') {
            onSubmit(value);
        }
    };

    /**
     * If clicked on outside of element, exit edit mode
     */
    handleClickOutside = (event) => {
        if (this.wrapperReference && !this.wrapperReference.contains(event.target)) {
            this.state.editing && this.handleCancel();
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
                return this.wrapperReference && this.handleCancel();
            case 'Enter':
                event.preventDefault();
                return this.wrapperReference && this.handleSubmit(this.state.value);
            default:
                return;
        }
    };

    /**
     * Test to see that the value is valid for submission
     * @param value
     */
    isValid = (value) => {
        const {minLength} = this.props;
        return value.trim().length >= minLength;
    };

    /**
     * Get component styles
     * @returns {Object}
     */
    getStyles = () => {
        const {inputWidth, inputHeight, zIndex} = this.props;

        return {
            base: {
                zIndex: zIndex ? zIndex : 5
            },
            input: {
                width: inputWidth ? inputWidth : null,
                height: inputHeight ? inputHeight : null,
                lineHeight: inputHeight ? `${inputHeight}px` : null
            },
            button: {
                height: inputHeight ? inputHeight : null,
                lineHeight: inputHeight ? `${inputHeight}px` : null
            }
        };
    };

    /**
     * Render the editable portion of the EditableText component
     * @param value
     * @param placeholder
     * @param maxLength
     * @returns {XML}
     */
    renderEditableView = (value, placeholder, maxLength) => {
        const styles = this.getStyles();

        return (
            <div className='editable-text_editing-container q4-fade-in'>
                <div className='field field--text'>
                    <input
                        style={styles.input}
                        ref={this.setInputReference}
                        className='field_input'
                        type='text'
                        name='value'
                        value={value}
                        placeholder={placeholder}
                        maxLength={maxLength}
                        onFocus={this.handleInputFocus}
                        onChange={this.handleInputChange}
                    />
                    <button
                        style={styles.button}
                        className={`button button--rain button--tall button--square ${this.isValid(value) ? '' : 'button--disabled'}`}
                        onClick={() => this.handleSubmit(value)}
                    >
                        <i className='button_icon q4i-checkmark-4pt'/>
                    </button>
                </div>
            </div>
        );
    };

    /**
     * Render Read More
     * @returns {*}
     */
    render() {
        const {className, theme, customRender, placeholder, maxLength} = this.props;
        const {value, editing} = this.state;
        const styles = this.getStyles();

        const componentClass = [
            `${className ? className : ''}`,
            `${(editing) ? 'editable-text editable-text--editing' : 'editable-text'}`,
            `${theme ? `editable-text--${theme}` : ''}`,
            `${value ? '' : 'editable-text--empty'}`
        ].join(' ').trim();

        return (
            <div className={componentClass} style={styles.base} ref={this.setWrapperReference}>
                {editing ? this.renderEditableView(value, placeholder, maxLength) : customRender ? (
                    <div className='editable-text_value' onDoubleClick={this.handleEdit}>
                        {customRender(value)}
                    </div>
                ) : (
                    <span className='editable-text_value q4-fade-in' onDoubleClick={this.handleEdit}>{value}</span>
                )}
                {!editing && (
                    <div className='editable-text_edit-toggle'>
                        <i className='q4i-edit-4pt' onClick={this.handleEdit}/>
                    </div>
                )}
            </div>
        );
    }
}

EditableText.propTypes = {
    className: PropTypes.string,
    theme: PropTypes.string,
    inputWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    inputHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    zIndex: PropTypes.number,
    value: PropTypes.string.isRequired,
    customRender: PropTypes.func,
    minLength: PropTypes.number,
    maxLength: PropTypes.number,
    placeholder: PropTypes.string,
    onQueryChange: PropTypes.func,
    onSubmit: PropTypes.func
};

EditableText.defaultProps = {
    value: '',
    storedValue: '',
    placeholder: 'Enter title',
    minLength: 1,
    maxLength: 32
};

export default EditableText;