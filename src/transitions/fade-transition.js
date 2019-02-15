import { Component } from 'inferno'
import { Children } from '../utilities/utilities'

export default class FadeTransition extends Component {
  constructor(props) {
    super(props);
    this.fadeFromSlide = props.currentSlide;
  }

  formatChildren(children, opacity) {
    const { currentSlide, slidesToShow } = this.props;
    return Children.map(children, (child, index) => {
      const visible =
        index >= currentSlide && index < currentSlide + slidesToShow;
      return (
        <li
          className={`slider-slide${visible ? ' slide-visible' : ''}`}
          style={this.getSlideStyles(index, opacity)}
          key={index}
        >
          {child}
        </li>
      );
    });
  }

  getSlideOpacityAndLeftMap(fadeFrom, fadeTo, fade) {
    // Figure out which position to fade to
    let fadeToPosition = fadeTo;
    if (fadeFrom > fade && fadeFrom === 0) {
      fadeToPosition = fadeFrom - this.props.slidesToShow;
    } else if (
      fadeFrom < fade &&
      fadeFrom + this.props.slidesToShow > this.props.slideCount - 1
    ) {
      fadeToPosition = fadeFrom + this.props.slidesToShow;
    }

    // Calculate opacity for active slides
    const opacity = {};
    if (fadeFrom === fadeTo) {
      opacity[fadeFrom] = 1;
    } else {
      const distance = fadeFrom - fadeToPosition;
      opacity[fadeFrom] = (fade - fadeToPosition) / distance;
      opacity[fadeTo] = (fadeFrom - fade) / distance;
    }

    // Calculate left for slides and merge in opacity
    const map = {};
    for (let i = 0; i < this.props.slidesToShow; i++) {
      map[fadeFrom + i] = {
        opacity: opacity[fadeFrom],
        left: this.props.slideWidth * i
      };

      map[fadeTo + i] = {
        opacity: opacity[fadeTo],
        left: this.props.slideWidth * i
      };
    }

    return map;
  }

  getSlideStyles(index, data) {
    return {
      'box-sizing': 'border-box',
      '-moz-box-sizing': 'border-box',
      display: 'block',
      height: 'auto',
      left: data[index] ? `${data[index].left}px` : 0,
      'list-style-type': 'none',
      'margin-bottom': 'auto',
      'margin-left': `${this.props.cellSpacing / 2}px`,
      'margin-right': `${this.props.cellSpacing / 2}px`,
      'margin-top': 'auto',
      opacity: data[index] ? data[index].opacity : 0,
      position: 'absolute',
      top: 0,
      'vertical-align': 'top',
      visibility: data[index] ? 'inherit' : 'hidden',
      width: `${this.props.slideWidth}px`
    };
  }

  getContainerStyles() {
    const width = this.props.slideWidth * this.props.slidesToShow;

    return {
      'box-sizing': 'border-box',
      '-moz-box-sizing': 'border-box',
      cursor: this.props.dragging === true ? 'pointer' : 'inherit',
      display: 'block',
      height: `${this.props.slideHeight}px`,
      margin: this.props.vertical
        ? `${(this.props.cellSpacing / 2) * -1}px 0px`
        : `0px ${(this.props.cellSpacing / 2) * -1}px`,
      padding: 0,
      'touch-action': 'none',
      width
    };
  }

  render() {
    const fade =
      -(this.props.deltaX || this.props.deltaY) / this.props.slideWidth;

    if (parseInt(fade) === fade) {
      this.fadeFromSlide = fade;
    }

    const opacityAndLeftMap = this.getSlideOpacityAndLeftMap(
      this.fadeFromSlide,
      this.props.currentSlide,
      fade
    );

    const children = this.formatChildren(
      this.props.children,
      opacityAndLeftMap
    );

    return (
      <ul className="slider-list" style={this.getContainerStyles()}>
        {children}
      </ul>
    );
  }
}

/*
FadeTransition.propTypes = {
  cellSpacing: PropTypes.number,
  currentSlide: PropTypes.number,
  deltaX: PropTypes.number,
  deltaY: PropTypes.number,
  dragging: PropTypes.bool,
  isWrappingAround: PropTypes.bool,
  left: PropTypes.number,
  slideCount: PropTypes.number,
  slideHeight: PropTypes.number,
  slidesToShow: PropTypes.number,
  slideWidth: PropTypes.number,
  top: PropTypes.number,
  vertical: PropTypes.bool,
  wrapAround: PropTypes.bool
};
*/

FadeTransition.defaultProps = {
  cellSpacing: 0,
  currentSlide: 0,
  deltaX: 0,
  deltaY: 0,
  dragging: false,
  isWrappingAround: false,
  left: 0,
  slideCount: 0,
  slideHeight: 0,
  slidesToShow: 1,
  slideWidth: 0,
  top: 0,
  vertical: false,
  wrapAround: false
};
