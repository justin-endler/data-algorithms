import BinarySearchTree from '../classes/BinarySearchTree';
import async from 'async';
import axios from 'axios';

export const INIT_BINARY_SEARCH_TREE = 'INIT_BINARY_SEARCH_TREE';
export const INSERT_BINARY_SEARCH_TREE_NODE = 'INSERT_BINARY_SEARCH_TREE_NODE';
export const IGNORE = 'IGNORE';
export const REMOVE_BINARY_SEARCH_TREE_NODE = 'REMOVE_BINARY_SEARCH_TREE_NODE';
export const REPLACE_BINARY_SEARCH_TREE = 'REPLACE_BINARY_SEARCH_TREE';
export const RANDOMIZE_SCATTER_PLOT_DATA = 'RANDOMIZE_SCATTER_PLOT_DATA';
export const ADD_TRAVELING_SALESMAN_CITY = 'ADD_TRAVELING_SALESMAN_CITY';
export const GET_NEW_TRAVELING_SALESMAN_ROUTES = 'GET_NEW_TRAVELING_SALESMAN_ROUTES';
export const MOVE_TRAVELING_SALESMAN_MARKER = 'MOVE_TRAVELING_SALESMAN_MARKER';
export const UPDATE_TRAVELING_SALESMAN_MARKER_POINTS = 'UPDATE_TRAVELING_SALESMAN_MARKER_POINTS';

export const initBinarySearchTree = () => {
  const tree = new BinarySearchTree();
  return {
    type: INIT_BINARY_SEARCH_TREE,
    payload: {
      tree
    }
  };
};

export const insertBinarySearchTreeNode = (data, tree) => {
  var type = INSERT_BINARY_SEARCH_TREE_NODE;
  const newTree = tree.clone();
  const insertResult = newTree.insert(data);
  // avoid rendering on failed insert due to duplicate value
  if (insertResult === false) {
    type = IGNORE;
  }

  return {
    type,
    payload: {
      tree: newTree
    }
  };
};

export const removeBinarySearchTreeNode = (data, tree) => {
  const newTree = tree.clone();
  newTree.remove(data);

  return {
    type: REMOVE_BINARY_SEARCH_TREE_NODE,
    payload: {
      tree: newTree
    }
  };
};

export const replaceBinarySearchTree = (tree, container) => {
  const newTree = tree.clone();

  return {
    type: REPLACE_BINARY_SEARCH_TREE,
    payload: {
      tree: newTree,
      container
    }
  };
};

export const addTravelingSalesmanCity = city => {
  return {
    type: ADD_TRAVELING_SALESMAN_CITY,
    payload: {
      city
    }
  };
};

export const moveTravelingSalesmanMarker = () => {
  return {
    type: MOVE_TRAVELING_SALESMAN_MARKER
  };
};

export const updateTravelingSalesmanMarkerPoints = (points) => {
  return {
    type: UPDATE_TRAVELING_SALESMAN_MARKER_POINTS,
    payload: {
      points
    }
  };
};

const getNewTravelingSalesmanRoutesCreator = newRoutes => {
  return {
    type: GET_NEW_TRAVELING_SALESMAN_ROUTES,
    payload: {
      newRoutes
    }
  };
};

export const getNewTravelingSalesmanRoutes = newRoutes => {
  return dispatch => {
    async.each(
      newRoutes,
      (routeData, callback) => {
        const {
          from,
          to
        } = routeData;
        const path = `https://router.project-osrm.org/route/v1/driving/${from.coordinates};${to.coordinates}`;

        axios.get(path, {
          params: {
            overview: 'false',
            geometries: 'polyline',
            steps: 'true'
          }
        })
        .then(response => {
          routeData.response = response;
          callback();
        })
        .catch(callback);
      },
      error => {
        dispatch(getNewTravelingSalesmanRoutesCreator(newRoutes));
      }
    );
  };
};