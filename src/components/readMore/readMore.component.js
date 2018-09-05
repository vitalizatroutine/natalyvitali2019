import React, {Component} from 'react';
import Truncate from 'react-truncate';
import './readMore.component.css';

/**
 * Read More Component
 */
class ReadMore extends Component {

    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);

        this.state = {
            expanded: false
        };
    }

    /**
     * Handle More / Less Click Event
     */
    handleClick = () => {
        const {expanded} = this.state;
        this.setState({
            expanded: !expanded
        });
    };

    /**
     * Render Read More
     * @returns {*}
     */
    render() {
        const {text, lines, theme} = this.props;
        const {expanded} = this.state;
        const moreClass = `read-more_link ${theme ? `read-more_link--${theme}` : ''}`;
        const moreText = expanded ? 'Less' : 'More';

        return (
            <div className='read-more'>
                <Truncate lines={!expanded ? lines : false}
                          trimWhitespace
                          ellipsis={<span>... <span className={moreClass} onClick={this.handleClick}>{moreText}</span></span>}
                >
                    {text}
                </Truncate>
            </div>
        );
    }
}

export default ReadMore;