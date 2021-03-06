import { combineReducers } from 'redux';
import form from './form';
import projects from './projects';
import user from './user';
import project from './project';
import pages from './pages';
import donation from './donation';
import { routerReducer as routing } from 'react-router-redux';

// combine all reducers
const rootReducer = combineReducers({
  routing,
  form,
  projects,
  project,
  user,
  pages,
  donation,
});

export default rootReducer;
