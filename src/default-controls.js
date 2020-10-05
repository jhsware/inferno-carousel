import { Component } from 'inferno'
import classnames from 'classnames'

export class PreviousButton extends Component {
  constructor() {
    super(...arguments);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(event) {
    event.preventDefault();
    this.props.previousSlide();
  }
  render() {
    const disabled =
      (this.props.currentSlide === 0 && !this.props.wrapAround) ||
      this.props.slideCount === 0;

    let cls = {
      'disabled': disabled
    }
    return (
      <button
        className={classnames('carousel-nav', 'carousel-nav-prev', cls)}
        disabled={disabled}
        onClick={this.handleClick}
        aria-label="previous" />
    );
  }
}

export class NextButton extends Component {
  constructor() {
    super(...arguments);
    this.handleClick = this.handleClick.bind(this);
    this.nextButtonDisable = this.nextButtonDisabled.bind(this);
  }
  handleClick(event) {
    event.preventDefault();
    this.props.nextSlide();
  }

  nextButtonDisabled(params) {
    const {
      wrapAround,
      slidesToShow,
      currentSlide,
      cellAlign,
      slideCount
    } = params;

    let buttonDisabled = false;
    if (!wrapAround) {
      const lastSlideIndex = slideCount - 1;
      let slidesShowing = slidesToShow;
      let lastSlideOffset = 0;

      switch (cellAlign) {
        case 'center':
          slidesShowing = (slidesToShow - 1) * 0.5;
          lastSlideOffset = Math.floor(slidesToShow * 0.5) - 1;
          break;
        case 'right':
          slidesShowing = 1;
          break;
      }

      if (slidesToShow > 1) {
        buttonDisabled =
          currentSlide + slidesShowing > lastSlideIndex + lastSlideOffset;
      } else {
        buttonDisabled = currentSlide + 1 > lastSlideIndex;
      }
    }
    return buttonDisabled;
  }
  render() {
    const {
      wrapAround,
      slidesToShow,
      currentSlide,
      cellAlign,
      slideCount
    } = this.props;

    const disabled = this.nextButtonDisabled({
      wrapAround,
      slidesToShow,
      currentSlide,
      cellAlign,
      slideCount
    });

    let cls = {
      'disabled': disabled
    }

    return (
      <button
        className={classnames('carousel-nav', 'carousel-nav-next', cls)}
        disabled={disabled}
        onClick={this.handleClick}
        aria-label="next" />
    );
  }
}

export class PagingDots extends Component {
  getDotIndexes(slideCount, slidesToScroll, slidesToShow, cellAlign) {
    const dotIndexes = [];
    let lastDotIndex = slideCount - slidesToShow;

    switch (cellAlign) {
      case 'center':
      case 'right':
        lastDotIndex += slidesToShow - 1;
        break;
    }
    if (lastDotIndex < 0) {
      return [0];
    }

    for (let i = 0; i < lastDotIndex; i += slidesToScroll) {
      dotIndexes.push(i);
    }
    dotIndexes.push(lastDotIndex);
    return dotIndexes;
  }

  render() {
    const indexes = this.getDotIndexes(
      this.props.slideCount,
      this.props.slidesToScroll,
      this.props.slidesToShow,
      this.props.cellAlign
    );
    return (
      <ul className="carousel-control">
        {indexes.map(index => {
          return (
            <li className="carousel-control-dot" key={index}>
              <button
                className={this.props.currentSlide === index ? 'active' : undefined}
                onClick={this.props.goToSlide.bind(null, index)}
                aria-label={`slide ${index + 1} bullet`} />
            </li>
          );
        })}
      </ul>
    );
  }
}
