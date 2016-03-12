import {combineReducers, createStore} from 'redux';
import {List} from 'immutable';
import * as actions from './actions';

const emptyList = List.of();

function markers(state = emptyList, action) {
  switch (action.type) {
    case actions.ADD_MARKER:
      return state.push({x: action.x, y: action.y});
    case actions.MOVE_MARKER:
      return state.set(action.index, {x: action.x, y: action.y});
    case actions.DELETE_MARKER:
      return state.delete(action.index);
    default:
      return state;
  }
}

function mapMarkers(state = emptyList, action) {
  switch (action.type) {
    case actions.ADD_MAP_MARKER:
      return state.push(action.latLng);
    case actions.MOVE_MAP_MARKER:
      return state.set(action.index, action.latLng);
    case actions.DELETE_MAP_MARKER:
      return state.delete(action.index);
    default:
      return state;
  }
}

const app = combineReducers({markers, mapMarkers});
export const store = createStore(app);
