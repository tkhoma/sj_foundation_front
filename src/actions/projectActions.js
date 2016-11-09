import { CALL_API } from '../redux/middleware/api';
import * as types from '../ActionTypes';


/**
 * get project
 * @param slug
 * @returns {{}}
 */
export function getProjectBySlug(slug) {
  return {
    [CALL_API]: {
      types: [types.PROJECT_REQUEST, types.PROJECT_SUCCESS, types.PROJECT_FAILURE],
      endpoint: `projects/?filter[name]=${slug}`,
    },
  };
}

/**
 * get project
 * @param slug
 * @returns {{}}
 */
export function getProjectMetaBySlug(slug) {
  return {
    [CALL_API]: {
      types: [types.PROJECT_META_REQUEST, types.PROJECT_META_SUCCESS, types.PROJECT_META_FAILURE],
      endpoint: `projects/?filter[name]=${slug}`,
    },
  };
}

export function pledgeProject(id, amount) {
  return {
    [CALL_API]: {
      method: 'POST',
      types: [types.PLEDGE_REQUEST, types.PLEDGE_SUCCESS, types.PLEDGE_FAILURE],
      endpoint: 'back_project',
      body: {
        project_id: id,
        amount,
      }
    },
  };
}