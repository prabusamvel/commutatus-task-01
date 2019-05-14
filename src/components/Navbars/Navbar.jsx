import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
// core components
import Button from "components/CustomButtons/Button.jsx";

import headerStyle from "assets/jss/material-dashboard-react/components/headerStyle.jsx";

function Header({ ...props }) {
  const { classes, color, appBarToggle } = props;
  const appBarClasses = classNames({
    [" " + classes[color]]: color
  });
  return (
    <AppBar className={ (appBarToggle ? classes.appBar : classes.appBarBlue) + appBarClasses}>
      <Toolbar className={classes.container}>
        <div className={classes.flex}>
          {/* Here we create navbar brand, based on route name */}
          <Button color="transparent" href="#" className={classes.title}>
            <img src="https://cdn-expa.aiesec.org/assets/images/aiesec-logo-white-blue.svg" alt='AIESEC' className={classes.logoSize}/>
          </Button>
          <ul className={classes.navUl}>

            <li className={classes.navUlLi}> <a className = {classes.navUlLiA} href="https://partners.aiesec.org/">For Organizations</a> </li>
            <li className={classes.navUlLi}> <a className = {classes.navUlLiA} href="https://help.aiesec.org/en/">Help</a> </li>
            <li className={classes.navUlLi}> <Link className = {classes.navUlLiA} to="/opportunities"> <span className={(appBarToggle ? classes.navUlLiABtn : classes.navUlLiABtnScroll)}>Explore</span> </Link></li>
          </ul>
        </div>
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  color: PropTypes.oneOf(["primary", "info", "success", "warning", "danger"])
};

export default withStyles(headerStyle)(Header);
