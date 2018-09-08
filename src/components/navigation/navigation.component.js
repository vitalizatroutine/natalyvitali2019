import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {handleScroll} from '../../utils/ui.util';
import './navigation.component.css';

class Navigation extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isOpen: false
        };
        
        this.containerReference = React.createRef();
        this.toggleReference = React.createRef();
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside = (event) => {
        const container = this.containerReference && this.containerReference.current;
        const toggle = this.toggleReference && this.toggleReference.current;

        if (!container || !toggle) {
            return;
        }

        if (!toggle.contains(event.target) && !container.contains(event.target)) {
            this.state.isOpen && this.handleToggleNavigation()
        }
    };

    handleToggleNavigation = () => {
        const {isOpen} = this.state;

        this.setState({
            isOpen: !isOpen
        });
    };

    render() {
        const {items, comingSoon, comingSoonText} = this.props;
        const {isOpen} = this.state;

        const baseClassName = [
            'navigation',
            isOpen ? 'navigation--open' : ''
        ].join(' ');

        return (
            <div className={baseClassName}>
                <div className='navigation_toggle' ref={this.toggleReference} onClick={this.handleToggleNavigation}>
                    <i className={isOpen ? 'q4i-close-2pt' : 'q4i-hamburger-q4inc-2pt'}/>
                </div>
                <div className='navigation_container' ref={this.containerReference}>
                    <ul className='navigation_list'>
                        {(items && items.length > 0) && items.map((item) => {
                            const {label, scrollTarget, onClick} = item;
                            const clickFunction = (scrollTarget || !isNaN(scrollTarget)) ? () => handleScroll(scrollTarget) : onClick;

                            return (
                                <li key={`navigation_${label}`} className='navigation_item' onClick={clickFunction}>{label}</li>
                            );
                        })}
                    </ul>
                    {comingSoon && (
                        <span className='navigation_coming-soon'>{comingSoonText || 'Come back for updates!'}</span>
                    )}
                </div>
            </div>
        );
    }
}

Navigation.propTypes = {
    items: PropTypes.array.isRequired,
    comingSoon: PropTypes.bool,
    comingSoonText: PropTypes.string
};

export default Navigation;