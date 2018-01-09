import { combineReducers } from 'redux';
import TreeReducer from './TreeReducer';

var reducers = {};
reducers['/binary-search-tree'] = TreeReducer;

const rootReducer = combineReducers(reducers);

export default rootReducer;
