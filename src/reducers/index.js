import { combineReducers } from 'redux';

import TreeReducer from './TreeReducer';
import {
  TravelingSalesmanReducer,
  TravelingSalesmanMarkerReducer
} from './TravelingSalesmanReducer';


var reducers = {};
reducers['/binary-search-tree'] = TreeReducer;
reducers['/traveling-salesman'] = TravelingSalesmanReducer;
reducers['/traveling-salesman/marker'] = TravelingSalesmanMarkerReducer;

const rootReducer = combineReducers(reducers);

export default rootReducer;