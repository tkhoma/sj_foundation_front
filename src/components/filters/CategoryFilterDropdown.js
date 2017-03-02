import React, {PropTypes} from 'react';
import {MenuList, MenuButton, Dropdown, MenuItem} from 'react-menu-list';
import classNames from 'classnames';
import { Link } from 'react-router';
class CategoryFilterDropdown extends React.Component {

  getLabel() {
    const {items, selectedCategory} = this.props;
    let selectedItem = false;
    items.map(value => {
      if (encodeURI(value.slug) == selectedCategory) {
        selectedItem = value.name;
      }
    });
    return selectedItem;
  }

  render() {
    const {items, selectedCategory} = this.props;
    if (items.length == 0) {
      return null;
    }

    return(
      <MenuButton className={classNames('btn btn-link', {active: this.getLabel()})}
        menu={
          <Dropdown>
            <MenuList>
              {items.map(category => {
                if (category.slug === 'uncategorized' || category.count == 0 || encodeURI(category.slug) == selectedCategory) {
                  return null
                }
                const buttonClass = classNames('btn btn-link');
                return (
                  <MenuItem><Link to={`/category/${category.slug}`} className={buttonClass} key={category.id}>{category.name}</Link></MenuItem>
                );
              })}
            </MenuList>
          </Dropdown>
        }
      >
        {this.getLabel() ? this.getLabel() : 'more'} &#9662;
      </MenuButton>
    )
  }

}

CategoryFilterDropdown.propTypes = {};

CategoryFilterDropdown.defaultProps = {};

export default CategoryFilterDropdown;