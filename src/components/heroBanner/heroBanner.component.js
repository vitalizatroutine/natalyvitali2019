import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import WeddingTimer from '../weddingTimer/weddingTimer.component';
import './heroBanner.component.css';

class HeroBanner extends PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            selectedIndex: 0,
            imgSrc: '',
            loading: false,
            initialLoad: false
        };
    }

    componentDidMount() {
        this.fetchImage();

        this.setState({
            timer: setInterval(this.handleNextSlide.bind(this), this.props.transitionTime)
        });
    }

    /**
     * Fetch image for Banner
     */
    fetchImage = () => {
        const {selectedIndex, initialLoad} = this.state;
        const {heroes} = this.props;

        if (!heroes || !heroes.length) {
            return;
        }

        this.setState({
            loading: true
        });

        const image = new Image();
        const src = heroes[selectedIndex] && heroes[selectedIndex].source;
        image.src = src;

        image.onload = () => {
            if (initialLoad) {
                this.setState({
                    imgSrc: src,
                    loading: false
                });
            } else {
                this.setState({
                    imgSrc: src,
                    loading: false
                }, () => {
                    this.setState({initialLoad: true});
                });
            }
        }
    };

    /**
     * Handle transition to next hero image
     */
    handleNextSlide = () => {
        const {loading, selectedIndex} = this.state;
        const {heroes} = this.props;

        if (loading) {
            return;
        }

        let newIndex = selectedIndex + 1;

        if (newIndex >= heroes.length) {
            newIndex = 0;
        }

        this.setState({
            selectedIndex: newIndex
        }, () => {
            this.fetchImage();
        });
    };

    render() {
        const {imgSrc, initialLoad} = this.state;
        const {className, children, heroes} = this.props;

        if (!heroes || !heroes.length) {
            return null;
        }

        const baseClassName = [
            className ? `${className} hero-banner` : 'hero-banner',
            initialLoad ? ' hero-banner--visible' : ''
        ].join('');

        return (
            <section className={baseClassName}>
                <div className='hero-banner_image' style={{backgroundImage: `url("${imgSrc}")`}}/>
                <div className='hero-banner_mask'/>
                <div className='hero-banner_inner'>
                    <section className='hero-banner_intro'>
                        <h3 className='hero-banner_subtitle'>Join us to celebrate the wedding of</h3>
                        <h1 className='hero-banner_title'>Nataly and Vitali</h1>
                        <ul className='hero-banner_detail-list'>
                            <li className='hero-banner_detail-item'>
                                <span className='hero-banner_detail-title'>Venue</span>
                                <span className='hero-banner_detail-text'>daVinci Banquet Hall</span>
                            </li>
                            <li className='hero-banner_detail-item'>
                                <span className='hero-banner_detail-title'>Date</span>
                                <span className='hero-banner_detail-text'>09.07.19</span>
                            </li>
                            <li className='hero-banner_detail-item'>
                                <span className='hero-banner_detail-title'>Days Until "I Do"</span>
                                <span className='hero-banner_detail-text'>
                                    <WeddingTimer stringOnly={true}/>
                                </span>
                            </li>
                        </ul>
                    </section>
                    {children}
                </div>
            </section>
        );
    }
}

HeroBanner.propTypes = {
    className: PropTypes.string,
    heroes: PropTypes.array.isRequired,
    transitionTime: PropTypes.number
};

HeroBanner.defaultProps = {
    transitionTime: 5000
};

export default HeroBanner;