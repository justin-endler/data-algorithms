import { combineReducers } from 'redux';
import TreeReducer from './TreeReducer';


const rootReducer = combineReducers({
  treeReducer: TreeReducer
});

export default rootReducer;
