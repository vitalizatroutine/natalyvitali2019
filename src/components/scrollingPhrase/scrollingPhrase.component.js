import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './scrollingPhrase.component.css';

class ScrollingPhrase extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedIndex: 0
        };

        this.innerContainer = React.createRef();
    }

    componentDidMount() {
        const {transitionTime} = this.props;
        setTimeout(() => {
            this.timer = setInterval(this.handlePhraseCycle, transitionTime || 1000);
        }, this.props.delay);
    }

    componentWillUnmount() {
        this.timer && clearInterval(this.timer);
    }

    handlePhraseCycle = () => {
        const {selectedIndex} = this.state;
        const {phrases, loop} = this.props;

        if (!phrases.length) {
            return;
        }

        const newIndex = selectedIndex + 1;

        if (newIndex >= phrases.length) {
            if (loop) {
                this.setState({
                    selectedIndex: 0
                });
            } else {
                this.timer && clearInterval(this.timer);
            }
        } else {
            this.setState({
                selectedIndex: newIndex
            });
        }
    };

    render() {
        const {selectedIndex} = this.state;
        const {phrases, beforeText, afterText, colors, fontSize} = this.props;

        let addColor = !!(colors && colors.length);

        if (!phrases.length || (addColor && colors.length !== phrases.length)) {
            return null;
        }


        const innerContainer = this.innerContainer && this.innerContainer.current;
        const styles = {
            all: {
                height: fontSize ? fontSize : null
            },
            base: {
                fontSize: fontSize ? fontSize : null,
                lineHeight: fontSize ? fontSize * 1.3 : null
            },
            inner: {
                top: innerContainer ? (selectedIndex * -(1 / phrases.length)) * innerContainer.clientHeight : 0
            }
        };

        return (
            <article className='scrolling-phrase' style={styles.base}>
                {beforeText && <span className='scrolling-phrase_before-text' style={styles.all}>{beforeText}&nbsp;</span>}
                <div className='scrolling-phrase_container' style={styles.all}>
                    <div className='scrolling-phrase_inner' ref={this.innerContainer} style={styles.inner}>
                        {phrases.map((phrase, index) => {
                            const style = {
                                    color: addColor ? colors[index] : null
                            };
                            return (
                                <div key={`phrase--${phrase}`} style={style} className='scrolling-phrase_text'>{phrase}</div>
                            );
                        })}
                    </div>
                </div>
                {afterText && <span className='scrolling-phrase_after-text' style={styles.all}>&nbsp;{afterText}</span>}
            </article>
        );
    }
}

ScrollingPhrase.propTypes = {
    phrases: PropTypes.array.isRequired,
    beforeText: PropTypes.string,
    afterText: PropTypes.string,
    colors: PropTypes.array,
    loop: PropTypes.bool,
    transitionTime: PropTypes.number,
    delay: PropTypes.number,
    fontSize: PropTypes.number
};

export default ScrollingPhrase;