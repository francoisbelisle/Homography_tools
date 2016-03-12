import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {addMarker, moveMarker} from '../actions';
import Marker from './marker';

const SVG_PADDING_X = 10;
const SVG_PADDING_Y = 30;

class VideoFrame extends React.Component {

  constructor() {
    super();
    this.handleImageLoad = this.handleImageLoad.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleMarkerMove = this.handleMarkerMove.bind(this);
    this.state = {imageSize: null};
  }

  render() {
    const divStyle = {
      position: 'absolute',
      left: this.props.pos.x,
      top: this.props.pos.y,
      width: this.props.size.width,
      height: this.props.size.height,
    };
    const imgStyle = {
      position: 'absolute',
      width: this.props.size.width,
      height: this.props.size.height,
    };
    const svgStyle = {
      position: 'absolute',
      left: -SVG_PADDING_X,
      top: -SVG_PADDING_Y,
      width: this.props.size.width + SVG_PADDING_X * 2,
      height: this.props.size.height + SVG_PADDING_Y,
    };
    const markers = this.props.markers.map((marker, i) => {
      const {x, y} = this.fromImageCoords(marker.x, marker.y);
      return (
        <Marker
          key={i} index={i} x={x} y={y}
          onMarkerMove={this.handleMarkerMove}
        />
      );
    });
    return (
      <div style={divStyle}>
        <img
          ref="img"
          src={this.props.src}
          style={imgStyle}
          onLoad={this.handleImageLoad}
        />
        <svg
          style={svgStyle}
          onClick={this.handleClick}
        >
          {markers}
        </svg>
      </div>
    );
  }

  getZoom() {
    if (!this.state.imageSize) {
      return 1;
    }
    return this.props.size.width / this.state.imageSize.width;
  }

  toImageCoords(x, y) {
    const zoom = this.getZoom();
    return {
      x: (x - SVG_PADDING_X) / zoom,
      y: (y - SVG_PADDING_Y) / zoom,
    };
  }

  fromImageCoords(x, y) {
    const zoom = this.getZoom();
    return {
      x: x * zoom + SVG_PADDING_X,
      y: y * zoom + SVG_PADDING_Y,
    };
  }

  handleImageLoad(event) {
    const img = event.target;
    this.setState({
      imageSize: {width: img.naturalWidth, height: img.naturalHeight},
    });
    this.props.setImageNaturalSize(img.naturalWidth, img.naturalHeight);
  }

  handleImageResize() {
    let resizing = false;
    if (!resizing) {
      resizing = true;
      window.requestAnimationFrame(() => {
        const img = React.findDOMNode(this.refs.img);
        this.setState({
          imageSize: {
            width: img.width,
            height: img.height,
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
          },
        });
        resizing = false;
      });
    }
  }

  handleClick(event) {
    const offset = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - offset.left;
    const y = event.clientY - offset.top;
    const imagePos = this.toImageCoords(x, y);
    if (
      imagePos.x >= 0 && imagePos.x < this.state.imageSize.width &&
      imagePos.y >= 0 && imagePos.y < this.state.imageSize.height
    ) {
      this.props.dispatch(addMarker(imagePos.x, imagePos.y));
    }
  }

  handleMarkerMove(index, x, y) {
    const imagePos = this.toImageCoords(x, y);
    imagePos.x = Math.max(imagePos.x, 0);
    imagePos.x = Math.min(imagePos.x, this.state.imageSize.width);
    imagePos.y = Math.max(imagePos.y, 0);
    imagePos.y = Math.min(imagePos.y, this.state.imageSize.height);
    this.props.dispatch(moveMarker(index, imagePos.x, imagePos.y));
  }

}

VideoFrame.propTypes = {
  src: React.PropTypes.string.isRequired,
  dispatch: React.PropTypes.func.isRequired,
  setImageNaturalSize: React.PropTypes.func.isRequired,
  pos: React.PropTypes.shape({
    x: React.PropTypes.number,
    y: React.PropTypes.number,
  }).isRequired,
  size: React.PropTypes.shape({
    width: React.PropTypes.number,
    height: React.PropTypes.number,
  }).isRequired,
  markers: ImmutablePropTypes.listOf(React.PropTypes.shape({
    x: React.PropTypes.number,
    y: React.PropTypes.number,
  })).isRequired,
};

export default VideoFrame;
