import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './slideshow.component.css';

class SlideShow extends Component {

    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);

        this.state = {
            slideShowIndex: 0,
            slideShowSrc: '',
            loading: false,
            initialLoad: false
        };

        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    componentDidMount() {
        this.fetchImage();

        this.setState({
            timer: setInterval(this.handleNextSlide.bind(this), this.props.transitionTime)
        });

        document.addEventListener('keydown', this.handleKeyDown);
    }

    componentWillUnmount() {
        if (this.state.timer) {
            clearInterval(this.state.timer);
        }

        document.removeEventListener('keydown', this.handleNextSlide);
    }
    /**
     * Fetch image for Slideshow
     */
    fetchImage = () => {
        const {slideShowIndex, initialLoad} = this.state;
        const {images} = this.props;

        this.setState({
            loading: true
        });

        const image = new Image();
        const src = images[slideShowIndex];
        image.src = src;

        image.onload = () => {
            if (initialLoad) {
                this.setState({
                    slideShowSrc: src,
                    loading: false
                });
            } else {
                this.setState({
                    slideShowSrc: src,
                    loading: false
                }, () => {
                    this.setState({initialLoad: true});
                });
            }
        }
    };

    /**
     * Handle transition to previous Slide
     */
    handlePreviousSlide = () => {
        const {slideShowIndex} = this.state;
        const {images} = this.props;

        let newIndex = slideShowIndex - 1;

        if (newIndex <= 0) {
            newIndex = images.length;
        }

        this.setState({
            slideShowIndex: newIndex
        }, () => {
            this.fetchImage();
        });
    };

    /**
     * Handle transition to next Slide
     */
    handleNextSlide = () => {
        const {loading, slideShowIndex} = this.state;
        const {images} = this.props;

        if (loading) {
            return;
        }

        let newIndex = slideShowIndex + 1;

        if (newIndex >= images.length) {
            newIndex = 0;
        }

        this.setState({
            slideShowIndex: newIndex
        }, () => {
            this.fetchImage();
        });
    };

    /**
     * Handle keydown event
     * @param event
     */
    handleKeyDown = (event) => {
        event = event || window.event;

        switch(event.key) {
            case 'ArrowLeft':
                return this.handlePreviousSlide();
            case 'ArrowRight':
                return this.handleNextSlide();
            default:
                return;
        }
    };

    /**
     * Render Read More
     * @returns {*}
     */
    render() {
        const {className} = this.props;
        const {slideShowSrc, initialLoad} = this.state;

        const baseClassName = [
            className ? `${className} slideshow` : 'slideshow',
            initialLoad ? ' slideshow--visible' : ''
        ].join('');

        return (
            <div
                className={baseClassName}
                style={{backgroundImage: `url("${slideShowSrc}")`}}
            />
        );
    }
}

SlideShow.propTypes = {
    className: PropTypes.string,
    transitionTime: PropTypes.number,
    images: PropTypes.array.isRequired,
};

SlideShow.defaultProps = {
    className: '',
    transitionTime: 5000,
    images: []
};

export default SlideShow;