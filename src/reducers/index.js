import { combineReducers } from 'redux';

import TreeReducer from 'reducers/TreeReducer';
import {
  TravelingSalesmanReducer,
  TravelingSalesmanMarkerReducer
} from 'reducers/TravelingSalesmanReducer';


const reducers = {};
reducers['/binary-search-tree'] = TreeReducer;
reducers['/traveling-salesman'] = TravelingSalesmanReducer;
reducers['/traveling-salesman/marker'] = TravelingSalesmanMarkerReducer;

const rootReducer = combineReducers(reducers);

export default rootReducer;