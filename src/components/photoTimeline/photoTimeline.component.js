import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import './photoTimeline.component.css';

class PhotoTimeline extends Component {

    constructor(props) {
        super(props);

        this.state = {
            chapterIndex: 0,
            componentTop: 0,
            selectedPhotoIndex: 0,
            isPhotoModalOpen: false
        };

        this.componentContainer = React.createRef();
        this.backgroundContainer = React.createRef();
        this.handleScroll = this.handleScroll.bind(this);
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
        this.getChapterData();
    }

    handleScroll = () => {
        const Component = this.componentContainer && this.componentContainer.current;
        const componentHeight = Component && Component.clientHeight;

        if (componentHeight !== this.state.componentHeight) {
            this.getChapterData();
        }

        // Check to see if you're within the boundary
        if ((this.state.componentTop > window.scrollY) || (window.scrollY > this.state.componentTop + this.state.componentHeight)) {
            return;
        }

        const chapterData = this.state.chapterData;

        if (!chapterData || !chapterData.length) {
            return;
        }

        // Check current chapter first
        if (this.processChapter(window.scrollY, chapterData[this.state.chapterIndex])) {
            return;
        }

        // Proceed to checking the rest of the chapters with the loop
        for (let i = 0; i < chapterData.length; i++) {
            this.processChapter(window.scrollY, chapterData[i]);
        }
    };

    handlePhotoClick = (index) => {
        this.setState({
            selectedPhotoIndex: index
        }, this.handlePhotoModalOpen());
    };

    handlePhotoModalOpen = () => {
        this.setState({
            isPhotoModalOpen: true
        });
    };

    handlePhotoModalClose = () => {
        this.setState({
            isPhotoModalOpen: false
        });
    };

    /**
     * Process the chapter and set correct chapter index / chapter progress
     * @param scrollTop
     * @param chapter
     * @returns {boolean}
     */
    processChapter = (scrollTop, chapter) => {
        if (scrollTop >= chapter.start && scrollTop <= chapter.end) {
            this.setState({
                chapterIndex: chapter.index,
                chapterProgress: (scrollTop - chapter.start) / (chapter.end - chapter.start) * 100
            });

            return true;
        }

        return false;
    };

    getChapterData = () => {
        const {chapters, photos} = this.props;

        if (!chapters || !chapters.length || !photos || !photos.length) {
            return;
        }

        const Component = this.componentContainer && this.componentContainer.current;
        const componentTop = Component && Component.offsetTop;
        const componentHeight = Component && Component.clientHeight;
        let start = componentTop;

        const data = chapters.map((chapter, index) => {
            // const photoCount = photos.filter((photo) => photo.chapter === index).length;
            const photoCount = photos.filter((photo) => (photo.chapter - 1) === index).length;
            const allocation = photoCount && (photoCount / photos.length);
            const end = (componentHeight * allocation) + start;

            const chapterData = {
                index,
                start,
                end
            };

            start = end;

            return chapterData;
        });

        this.setState({
            componentTop,
            componentHeight,
            chapterData: data
        });
    };

    render() {
        const {photos, chapters} = this.props;
        const {chapterIndex, chapterProgress, isPhotoModalOpen, selectedPhotoIndex} = this.state;

        if (!photos || !photos.length || !chapters || !chapters.length) {
            return null;
        }

        const selectedPhoto = (photos && photos[selectedPhotoIndex]) || {};
        const styles = {
            background: {
                // backgroundImage: `url(${chapters[chapterIndex].image})`,
                backgroundImage: `url(${chapters[chapterIndex].source})`,
                backgroundPositionY: `${chapterProgress}%`
            }
        };

        return (
            <div className='photo-timeline' ref={this.componentContainer}>
                <div className='photo-timeline_background'ref={this.backgroundContainer} style={styles.background}/>
                <section className='photo-timeline_items'>
                    {photos.length > 0 && photos.map((photo, index) => {
                        return (
                            <article key={`${photo.title}--${index}`} className='photo-timeline_item'>
                                <img
                                    className='photo-timeline_image'
                                    src={photo.thumbnail}
                                    alt={photo.title}
                                    onClick={() => this.handlePhotoClick(index)}
                                />
                                <section className='photo-timeline_details'>
                                    <div className='photo-timeline_card'>
                                        <h3 className='photo-timeline_title'>{photo.title}</h3>
                                        {photo.description && (
                                            <p className='photo-timeline_description'>{photo.description}</p>
                                        )}
                                    </div>
                                </section>
                            </article>
                        );
                    })}
                </section>
                <aside className='photo-timeline_navigation'>

                </aside>
                <Modal
                    isOpen={isPhotoModalOpen}
                    onRequestClose={this.handlePhotoModalClose}
                    portalClassName={`modal modal--photo ${isPhotoModalOpen ? 'modal--open' : ''}`}
                    className='modal_container'
                    overlayClassName='modal_mask'
                    bodyOpenClassName='body--modal-open'
                    htmlOpenClassName='html--modal-open'
                >
                    <div className='photo-timeline_modal'>
                        <img
                            className='photo-timeline_modal-image'
                            src={selectedPhoto.source}
                            alt={selectedPhoto.title}
                        />
                        <div className='photo-timeline_modal-details'>
                            <h3 className='photo-timeline_title'>{selectedPhoto.title}</h3>
                            {selectedPhoto.description && (
                                <p className='photo-timeline_modal-description'>{selectedPhoto.description}</p>
                            )}
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}

PhotoTimeline.propTypes = {
    photos: PropTypes.array.isRequired,
    chapters: PropTypes.array.isRequired
};

export default PhotoTimeline;