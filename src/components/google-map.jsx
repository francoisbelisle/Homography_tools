import React from 'react';
import google from 'google';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {addMapMarker, moveMapMarker} from '../actions';
import {markerLabel, PIN_SVG_PATH} from '../utils';

class GoogleMap extends React.Component {

  constructor(props) {
    super(props);
    this.map = null;
    this.markers = [];
    this.listeners = [];
  }

  componentDidMount() {
    const node = React.findDOMNode(this.refs.map);
    this.map = new google.maps.Map(node, {
      center: {lat: 45.53, lng: -73.65},
      zoom: 11,
      streetViewControl: false,
      mapTypeId: google.maps.MapTypeId.SATELLITE,
    });
    google.maps.event.addListener(this.map, 'click', (event) => {
      this.props.dispatch(addMapMarker(event.latLng));
    });
    this.updateMarkers();
  }

  componentDidUpdate() {
    this.updateMarkers();
  }

  render() {
    const mapStyle = {
      position: 'absolute',
      left: this.props.pos.x,
      top: this.props.pos.y,
      width: this.props.size.width,
      height: this.props.size.height,
    };
    return <div className="map" ref="map" style={mapStyle} />;
  }

  updateMarkers() {
    const loopend = Math.max(
      this.props.markers.size, this.markers.length
    );
    for (let i = 0; i < loopend; i++) {
      const latLng = this.props.markers.get(i);
      let uiMarker = this.markers[i];
      if (uiMarker && latLng) {
        uiMarker.setPosition(latLng);
      } else if (uiMarker && !latLng) {
        uiMarker.setMap(null);
        google.maps.event.removeListener(this.listeners[i]);
        delete this.markers[i];
        delete this.listeners[i];
      } else if (!uiMarker && latLng) {
        uiMarker = this.markers[i] = new google.maps.Marker({
          label: markerLabel(i),
          map: this.map,
          position: latLng,
          draggable: true,
          icon: {
            path: PIN_SVG_PATH,
            fillColor: 'cyan',
            fillOpacity: 1.0,
            strokeOpacity: 0.0,
            labelOrigin: new google.maps.Point(0, -20),
          },
        });
        this.listeners[i] = uiMarker.addListener(
          'dragend', (event) => this.handleMarkerDrag(event, i)
        );
      }
    }
  }

  handleMarkerDrag(event, index) {
    this.props.dispatch(moveMapMarker(index, event.latLng));
  }

}

GoogleMap.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  pos: React.PropTypes.shape({
    x: React.PropTypes.number,
    y: React.PropTypes.number,
  }).isRequired,
  size: React.PropTypes.shape({
    width: React.PropTypes.number,
    height: React.PropTypes.number,
  }).isRequired,
  markers: ImmutablePropTypes.listOf(
    React.PropTypes.instanceOf(google.maps.LatLng)
  ).isRequired,
};

export default GoogleMap;
