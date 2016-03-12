import React from 'react';
import google from 'google';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {markerLabel} from '../utils';
import {deleteMarker, deleteMapMarker} from '../actions';

class Details extends React.Component {

  render() {
    const markers = this.props.markers;
    const mapMarkers = this.props.mapMarkers;
    const nMarkers = Math.max(markers.size, mapMarkers.size);
    const rows = [];
    for (let i = 0; i < nMarkers; i++) {
      const marker = markers.get(i);
      const mapMarker = mapMarkers.get(i);
      let markerX = '';
      let markerY = '';
      let mapMarkerLat = '';
      let mapMarkerLng = '';
      if (marker) {
        markerX = marker.x.toFixed(0);
        markerY = marker.y.toFixed(0);
      }
      if (mapMarker) {
        mapMarkerLat = mapMarker.lat().toFixed(5);
        mapMarkerLng = mapMarker.lng().toFixed(5);
      }
      rows.push(
        <tr key={i}>
          <th>{markerLabel(i)}</th>
          <td>{markerX}</td>
          <td>{markerY}</td>
          <td>{mapMarkerLat}</td>
          <td>{mapMarkerLng}</td>
          <td>
            <button onClick={() => this.deleteMarker(i)}>Supprimer</button>
          </td>
        </tr>
      );
    }
    if (rows.length === 0) {
      return null;
    }
    return (
      <table>
        <thead>
          <tr>
            <th></th>
            <th>X</th>
            <th>Y</th>
            <th>Lat</th>
            <th>Long</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }

  deleteMarker(index) {
    this.props.dispatch(deleteMarker(index));
    this.props.dispatch(deleteMapMarker(index));
  }

}

Details.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  pos: React.PropTypes.shape({
    x: React.PropTypes.number,
    y: React.PropTypes.number,
  }).isRequired,
  markers: ImmutablePropTypes.listOf(React.PropTypes.shape({
    x: React.PropTypes.number,
    y: React.PropTypes.number,
  })).isRequired,
  mapMarkers: ImmutablePropTypes.listOf(
    React.PropTypes.instanceOf(google.maps.LatLng)
  ).isRequired,
};

export default Details;
