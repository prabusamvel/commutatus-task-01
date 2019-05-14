import {
  defaultFont,
  primaryColor,
  defaultBoxShadow,
  infoColor,
  successColor,
  warningColor,
  dangerColor,
  whiteColor,
  grayColor
} from "assets/jss/material-dashboard-react.jsx";

const headerStyle = theme => ({
  logoStyle:{
    color: "#fff",
    fontWeight: "bold",
    fontSize: "30px",
    fontStyle: "italic",
    fontFamily: "serif"
  },
  appBar: {
    height:"60px",
    padding:"5px 0",
    backgroundColor: "transparent",
    boxShadow: "none",
    borderBottom: "0",
    marginBottom: "0",
    position: "fixed",
    width: "100%",
    zIndex: "1029",
    color: grayColor[7],
    border: "0",
    borderRadius: "3px",
    minHeight: "50px",
    display: "block"
  },
  appBarBlue: {
    height:"60px",
    padding:"5px 0",
    backgroundColor: "#037ef3",
    borderBottom: "0",
    marginBottom: "0",
    position: "fixed",
    width: "100%",
    zIndex: "1029",
    color: grayColor[7],
    border: "0",
    borderRadius: "3px",
    transition: "background-color 1s ease",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.16), 0 2px 4px rgba(0, 0, 0, 0.23)",
    minHeight: "50px",
    display: "block"
  },
  container: {
    minHeight: "50px",
    width: "90%",
    margin: "0 auto",
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  flex: {
    flex: 1
  },
  title: {
    ...defaultFont,
    lineHeight: "30px",
    fontSize: "18px",
    borderRadius: "3px",
    textTransform: "none",
    color: "inherit",
    margin: "0",
    "&:hover,&:focus": {
      background: "transparent"
    },
    [theme.breakpoints.down('sm')]: {
      padding: "12px 0",
    },
  },
  appResponsive: {
    top: "8px"
  },
  primary: {
    backgroundColor: primaryColor[0],
    color: whiteColor,
    ...defaultBoxShadow
  },
  info: {
    backgroundColor: infoColor[0],
    color: whiteColor,
    ...defaultBoxShadow
  },
  success: {
    backgroundColor: successColor[0],
    color: whiteColor,
    ...defaultBoxShadow
  },
  warning: {
    backgroundColor: warningColor[0],
    color: whiteColor,
    ...defaultBoxShadow
  },
  danger: {
    backgroundColor: dangerColor[0],
    color: whiteColor,
    ...defaultBoxShadow
  },
  navUl: {
    display: "inline-block",
    listStyle: "none",
    float: "right",
    [theme.breakpoints.down('sm')]: {
      marginRight: 0,
      marginTop:'8px',
      paddingLeft: 0
    },
    [theme.breakpoints.up('md')]: {
      marginRight: "25px",
      margin: "10px 0"
    }
  },
  navUlLiT: {
    [theme.breakpoints.down('sm')]: {
      display: "none",
    },
    [theme.breakpoints.up('md')]: {
      display: "inline",
    },
    margin: "0 15px",
    color: "#fff !important",
    fontSize: "16px !important",
    padding: 0,
    cursor: "pointer",
    fontWeight: 400
  },
  navUlLiB: {
    display: "inline",
    margin: "0 15px",
    color: "#fff !important",
    fontSize: "16px !important",
    padding: 0,
    cursor: "pointer",
    fontWeight: 400
  },
  navUlLiA :{
    color: "#fff !important"
  },
  navUlLiABtn :{
    backgroundColor: "#037ef3",
    color: "#fff !important",
    fontSize: "16px !important",
    padding: "3px 12px 7px",
    height: "30px !important",
    lineHeight: "30px !important",
    margin: 0,
    borderRadius: "2px",
    cursor: "pointer"
  },
  navUlLiABtnScroll :{
    backgroundColor: "#fff",
    transition: "background-color 1s ease",
    color: "#037ef3 !important",
    fontSize: "16px !important",
    padding: "3px 12px 7px",
    height: "30px !important",
    lineHeight: "30px !important",
    margin: 0,
    borderRadius: "2px",
    cursor: "pointer"
  },
  logoSize:{
    width:"180px",
    lineHeight:"60px"
  }
});

export default headerStyle;
