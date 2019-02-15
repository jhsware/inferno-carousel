import { Component } from 'inferno'
import { Children } from '../utilities/utilities'

const MIN_ZOOM_SCALE = 0;
const MAX_ZOOM_SCALE = 1;

export default class ScrollTransition extends Component {
  constructor(props) {
    super(props);

    this.getListStyles = this.getListStyles.bind(this);
  }

  getSlideDirection(start, end, isWrapping) {
    let direction = 0;
    if (start === end) return direction;

    if (isWrapping) {
      direction = start < end ? -1 : 1;
    } else {
      direction = start < end ? 1 : -1;
    }

    return direction;
  }

  /* eslint-disable complexity */
  getSlideTargetPosition(index, positionValue) {
    let targetPosition =
      (this.props.slideWidth + this.props.cellSpacing) * index;
    const startSlide = Math.min(
      Math.abs(Math.floor(positionValue / this.props.slideWidth)),
      this.props.slideCount - 1
    );

    let offset = 0;

    if (
      this.props.animation === 'zoom' &&
      (this.props.currentSlide === index + 1 ||
        (this.props.currentSlide === 0 &&
          index === this.props.children.length - 1))
    ) {
      offset = this.props.slideOffset;
    } else if (
      this.props.animation === 'zoom' &&
      (this.props.currentSlide === index - 1 ||
        (this.props.currentSlide === this.props.children.length - 1 &&
          index === 0))
    ) {
      offset = -this.props.slideOffset;
    }

    if (this.props.wrapAround && index !== startSlide) {
      const direction = this.getSlideDirection(
        startSlide,
        this.props.currentSlide,
        this.props.isWrappingAround
      );
      let slidesBefore = Math.floor((this.props.slideCount - 1) / 2);
      let slidesAfter = this.props.slideCount - slidesBefore - 1;

      if (direction < 0) {
        const temp = slidesBefore;
        slidesBefore = slidesAfter;
        slidesAfter = temp;
      }

      const distanceFromStart = Math.abs(startSlide - index);
      if (index < startSlide) {
        if (distanceFromStart > slidesBefore) {
          targetPosition =
            (this.props.slideWidth + this.props.cellSpacing) *
            (this.props.slideCount + index);
        }
      } else if (distanceFromStart > slidesAfter) {
        targetPosition =
          (this.props.slideWidth + this.props.cellSpacing) *
          (this.props.slideCount - index) *
          -1;
      }
    }

    return targetPosition + offset;
  }
  /* eslint-enable complexity */

  formatChildren(children) {
    const { top, left, currentSlide, slidesToShow } = this.props;
    const positionValue = this.props.vertical ? top : left;
    return Children.map(children, (child, index) => {
      const visible =
        index >= currentSlide && index < currentSlide + slidesToShow;
      return (
        <li
          className={`slider-slide${visible ? ' slide-visible' : ''}`}
          style={this.getSlideStyles(index, positionValue)}
          key={index}
        >
          {child}
        </li>
      );
    });
  }

  getSlideStyles(index, positionValue) {
    const targetPosition = this.getSlideTargetPosition(index, positionValue);
    const transformScale =
      this.props.animation === 'zoom' && this.props.currentSlide !== index
        ? Math.max(
            Math.min(this.props.zoomScale, MAX_ZOOM_SCALE),
            MIN_ZOOM_SCALE
          )
        : 1.0;
    return {
      'box-sizing': 'border-box',
      display: this.props.vertical ? 'block' : 'inline-block',
      height: 'auto',
      left: this.props.vertical ? 0 : `${targetPosition}px`,
      'list-style-type': 'none',
      'margin-bottom': this.props.vertical ? `${(this.props.cellSpacing / 2)}px` : 'auto',
      'margin-left': this.props.vertical ? 'auto' : `${(this.props.cellSpacing / 2)}px`,
      'margin-right': this.props.vertical ? 'auto' : `${(this.props.cellSpacing / 2)}px`,
      'margin-top': this.props.vertical ? `${(this.props.cellSpacing / 2)}px` : 'auto',
      '-moz-box-sizing': 'border-box',
      position: 'absolute',
      top: this.props.vertical ? `${targetPosition}px` : 0,
      transform: `scale(${transformScale})`,
      transition: 'transform .4s linear',
      'vertical-align': 'top',
      width: this.props.vertical ? '100%' : `${this.props.slideWidth}px`
    };
  }

  getListStyles(styles) {
    const { deltaX, deltaY } = styles;
    const listWidth =
      this.props.slideWidth * Children.count(this.props.children);
    const spacingOffset =
      this.props.cellSpacing * Children.count(this.props.children);
    const transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`;
    return {
      transform,
      '-webkit-transform': transform,
      '-ms-transform': `translate(${deltaX}px, ${deltaY}px)`,
      position: 'relative',
      display: 'block',
      margin: this.props.vertical
        ? `${(this.props.cellSpacing / 2) * -1}px 0px`
        : `0px ${(this.props.cellSpacing / 2) * -1}px`,
      padding: 0,
      height: `${this.props.vertical
        ? listWidth + spacingOffset
        : this.props.slideHeight}px`,
      width: this.props.vertical ? 'auto' : `${listWidth + spacingOffset}px`,
      cursor: this.props.dragging === true ? 'pointer' : 'inherit',
      'box-sizing': 'border-box',
      'moz-box-sizing': 'border-box',
      'touch-action': `pinch-zoom ${this.props.vertical ? 'pan-x' : 'pan-y'}`
    };
  }

  render() {
    const children = this.formatChildren(this.props.children);
    const deltaX = this.props.deltaX;
    const deltaY = this.props.deltaY;

    return (
      <ul
        className="slider-list"
        style={this.getListStyles({ deltaX, deltaY })}
      >
        {children}
      </ul>
    );
  }
}

/*
ScrollTransition.propTypes = {
  animation: PropTypes.oneOf(['zoom']),
  cellSpacing: PropTypes.number,
  currentSlide: PropTypes.number,
  deltaX: PropTypes.number,
  deltaY: PropTypes.number,
  dragging: PropTypes.bool,
  isWrappingAround: PropTypes.bool,
  left: PropTypes.number,
  slideCount: PropTypes.number,
  slideHeight: PropTypes.number,
  slideOffset: PropTypes.number,
  slideWidth: PropTypes.number,
  top: PropTypes.number,
  vertical: PropTypes.bool,
  wrapAround: PropTypes.bool,
  zoomScale: PropTypes.number
};
*/

ScrollTransition.defaultProps = {
  cellSpacing: 0,
  currentSlide: 0,
  deltaX: 0,
  deltaY: 0,
  dragging: false,
  isWrappingAround: false,
  left: 0,
  slideCount: 0,
  slideHeight: 0,
  slideWidth: 0,
  top: 0,
  vertical: false,
  wrapAround: false,
  zoomScale: 0.85
};
