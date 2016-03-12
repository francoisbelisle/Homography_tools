import React from 'react';
import {markerLabel, PIN_SVG_PATH} from '../utils';

class Marker extends React.Component {

  constructor(props) {
    super(props);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  render() {
    const style = {cursor: 'move'};
    return (
      <g
        style={style}
        transform={`translate(${this.props.x},${this.props.y})`}
        onMouseDown={this.handleMouseDown}
        onClick={this.handleClick}
      >
        <path d={PIN_SVG_PATH} fill="cyan" />
        <text textAnchor="middle" fontSize="14" y="-15">
          {markerLabel(this.props.index)}
        </text>
      </g>
    );
  }

  handleMouseDown(event) {
    const offsetX = this.props.x - event.clientX;
    const offsetY = this.props.y - event.clientY;

    const dragHandler = (dragEvent) => {
      this.props.onMarkerMove(
        this.props.index,
        dragEvent.clientX + offsetX,
        dragEvent.clientY + offsetY
      );
    };

    const endHandler = () => {
      window.removeEventListener('mousemove', dragHandler);
      window.removeEventListener('mouseup', endHandler);
    };

    window.addEventListener('mousemove', dragHandler);
    window.addEventListener('mouseup', endHandler);
    event.stopPropagation();
    event.preventDefault();
  }

  handleClick(event) {
    event.stopPropagation();
  }

}

Marker.propTypes = {
  index: React.PropTypes.number,
  x: React.PropTypes.number,
  y: React.PropTypes.number,
  onMarkerMove: React.PropTypes.func,
};

export default Marker;
