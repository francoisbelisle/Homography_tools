/* Action types */

export const ADD_MARKER = 'ADD_MARKER';
export const MOVE_MARKER = 'MOVE_MARKER';
export const DELETE_MARKER = 'DELETE_MARKER';
export const ADD_MAP_MARKER = 'ADD_MAP_MARKER';
export const MOVE_MAP_MARKER = 'MOVE_MAP_MARKER';
export const DELETE_MAP_MARKER = 'DELETE_MAP_MARKER';

/* Action creators */

export function addMarker(x, y) {
  return {type: ADD_MARKER, x, y};
}

export function moveMarker(index, x, y) {
  return {type: MOVE_MARKER, index, x, y};
}

export function deleteMarker(index) {
  return {type: DELETE_MARKER, index};
}

export function addMapMarker(latLng) {
  return {type: ADD_MAP_MARKER, latLng};
}

export function moveMapMarker(index, latLng) {
  return {type: MOVE_MAP_MARKER, index, latLng};
}

export function deleteMapMarker(index) {
  return {type: DELETE_MAP_MARKER, index};
}
