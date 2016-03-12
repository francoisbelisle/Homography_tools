import React from 'react';
import google from 'google';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {connect} from 'react-redux';
import VideoFrame from './video-frame';
import GoogleMap from './google-map';
import Details from './details';

class _App extends React.Component {

  constructor(props) {
    super(props);
    this.setImageNaturalSize = this.setImageNaturalSize.bind(this);
    this.setPageWidth = this.setPageWidth.bind(this);
    this.handleDownloadButton = this.handleDownloadButton.bind(this);
    this.state = {pageWidth: 0, imageNaturalSize: null};
  }

  componentWillMount() {
    this.setPageWidth();
  }

  componentDidMount() {
    window.addEventListener('resize', this.setPageWidth);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setPageWidth);
  }

  render() {
    const gutter = 10;
    const imageX = 0;
    const imageY = 0;
    let imageWidth = 0;
    let imageHeight = 0;
    if (this.state.imageNaturalSize) {
      imageWidth = (this.state.pageWidth - 30) / 2;
      imageHeight =
        this.state.imageNaturalSize.height * imageWidth /
        this.state.imageNaturalSize.width;
    }
    const mapX = gutter + imageWidth;
    const mapY = 0;
    const mapWidth = imageWidth;
    const mapHeight = imageHeight;

    let mapComponent = false;
    if (this.state.imageNaturalSize) {
      mapComponent = (
        <GoogleMap
          key="google-map"
          dispatch={this.props.dispatch}
          markers={this.props.mapMarkers}
          pos={{x: mapX, y: mapY}}
          size={{width: mapWidth, height: mapHeight}}
        />
      );
    }

    let detailsComponent = false;
    if (this.state.imageNaturalSize) {
      detailsComponent = (
        <Details
          key="details"
          dispatch={this.props.dispatch}
          markers={this.props.markers}
          mapMarkers={this.props.mapMarkers}
        />
      );
    }
    return (
      <div>
        <div style={{height: imageHeight + gutter}}>
          <VideoFrame
            key="video-frame"
            dispatch={this.props.dispatch}
            markers={this.props.markers}
            src="capture.png" width="500" height="500"
            pos={{x: imageX, y: imageY}}
            size={{width: imageWidth, height: imageHeight}}
            setImageNaturalSize={this.setImageNaturalSize}
          />
          {mapComponent}
        </div>
        {detailsComponent}
        <button onClick={this.handleDownloadButton}>
          Télécharger
        </button>
      </div>
    );
  }

  setImageNaturalSize(width, height) {
    this.setState({imageNaturalSize: {width, height}});
  }

  setPageWidth() {
    this.setState({pageWidth: document.body.clientWidth});
  }

  handleDownloadButton() {
    const markers = this.props.markers.zip(this.props.mapMarkers);
    const lines = markers.map(([marker, mapMarker]) => {
      return `${marker.x} ${marker.y} ${mapMarker.lat()} ${mapMarker.lng()}\n`;
    });
    const payload = encodeURIComponent(lines.join(''));
    const link = document.createElement('a');
    link.download = 'point-correspondences.txt';
    link.href = `data:text/plain; charset=utf-8,${payload}`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

}

_App.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  markers: ImmutablePropTypes.listOf(React.PropTypes.shape({
    x: React.PropTypes.number,
    y: React.PropTypes.number,
  })).isRequired,
  mapMarkers: ImmutablePropTypes.listOf(
    React.PropTypes.instanceOf(google.maps.LatLng)
  ).isRequired,
};

function mapStateToProps(state) {
  return {markers: state.markers, mapMarkers: state.mapMarkers};
}

export default connect(mapStateToProps)(_App);
