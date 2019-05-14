import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import Button from "components/CustomButtons/Button.jsx";

//importing custom helper functions
import {getShortDate, getDays, getOpportunities} from '../../helper/opportunity_helper';

const styles = theme => ({
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1"
    }
  },
  topImageBg:{
    height: "40vh",
    backgroundImage: "url(https://cdn-expa.aiesec.org/assets/images/aiesec_org/search-cover.jpg)",
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    position: "relative",
    width:"100%"
  },
  overLay:{
    position: "absolute",
    bottom: 0,
    top: 0,
    left: 0,
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  overLayTitle:{
    position: "absolute",
    top: "45%",
    left: 0,
    right: 0,
    textAlign: "center",
    color: "#fff",
    fontWeight: 400,
    [theme.breakpoints.down('sm')]: {
      fontSize: "2rem",
      lineHeight:'normal'
    },
    [theme.breakpoints.up('md')]: {
      fontSize: "52px",
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: "60px",
    }
  },
  overLayText:{
    position: "absolute",
    top: "28vh",
    left: 0,
    right: 0,
    width: "100%",
    textAlign: "center",
    color: "#fff",
    fontFamily: "Lato",
    fontSize: "20px",
    fontWeight: "normal",
    lineHeight: "24px"
  },
  alpha_img:{width: '20px', height: '20px', borderRadius: '50%', position:'absolute'},
  oppr_img:{
    height:'120px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
    [theme.breakpoints.up('md')]: {
      width:'210px',
    },
  },
  op_list:{
    margin: '45px 0',
    '&:hover':{
      backgroundColor:'#e8e7e7'
    }
  },
  op_list_inner:{
    height:'120px',
    cursor:'pointer'
  },
  hideExtSnap:{
    [theme.breakpoints.down('sm')]: {
      display: "none"
    },
    [theme.breakpoints.up('md')]: {
      display: "block",
    },
  }
});

class Opportunities extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      opportunities: [],
      paging:{
        total_items: 0,
        current_page: 1,
        total_pages: 0
      },
      isLoaded: false,
      loadText:{
        title: 'Please wait...',
        message: 'Your request is loading...'
      }
    }
  }

  componentDidMount(){
    getOpportunities().then(op_response => {
      if(op_response !== false && Object.keys(op_response).length > 1){
        let opportunities = this.state.opportunities;
        opportunities = op_response.data;
        let paging = this.state.paging;
        paging = op_response.paging;
        this.setState({isLoaded: true, opportunities, paging});
      }else{
        let err = op_response.hasOwnProperty('error') ? op_response.error : 'Unknown';
        let loadText = this.state.loadText;
        loadText.title = "API endpoint failed to response.";
        loadText.message = err;
        this.setState({loadText});
      }
    });
  }

  doView = (id) => {
    this.props.history.push('/opportunity/view/'+id);
  }

  setPage = (page) => {
    this.setState({isLoaded: false});
    getOpportunities(page).then(op_response => {
      if(op_response !== false){

        let opportunities = this.state.opportunities;
        opportunities = op_response.data;

        let paging = this.state.paging;
        paging = op_response.paging;

        this.setState({isLoaded: true, opportunities, paging});
      }
    });
  }

  getPagination = () => {

    if(!this.state.isLoaded){
      return null;
    }

    let tOptions = this.state.paging;
    let pages = tOptions.total_pages;
    if (pages > 1) {
      let pgarr = [];
      pgarr[pages - 1] = 0;

      let _pages = [];
      let i = 0;
      for (; i < pages; i++) {
        _pages.push(i + 1);
      }
      let current_page = tOptions.current_page;
      let new_pages = [];

      if (_pages.length > 10) {
        let start = 0,
          end = 10;
        let _end = _pages[_pages.length - 1];
        let prev_page = parseInt(current_page - 5);
        if (prev_page > 0) {
          start = prev_page;
          end = parseInt(current_page + 5);
          end = end > _end ? _end : end;
        }
        for (i = start; i < end; i++) {
          new_pages.push(i + 1);
        }

        new_pages[0] = _pages[0];
        new_pages[new_pages.length - 1] = _pages[_pages.length - 1];
      } else {
        new_pages = _pages;
      }

      return (
          <CardFooter style={{display:'block', textAlign:'center'}}>
            {new_pages.map((p, i) => (
              <Button
              key={i}
              round style={{borderRadius:'50%', padding:'10px', width:'40px', height:'40px', margin: '5px'}}
              color={tOptions.current_page !== p ? "primary" : "default"}
              onClick={() => this.setPage(p)}>
                {p}
              </Button>
            ))}
         </CardFooter>
      );
    } else {
      return null;
    }
  }

  render(){
    const { classes } = this.props;
    let {isLoaded, opportunities, loadText} = this.state;
    return(
      <GridContainer>

        <div className={classes.topImageBg}>
          <div className={classes.overLay}>
            <div className={classes.overLayTitle}>Your experience begins here...</div>
          </div>
        </div>

        <GridItem xs={12} sm={12} md={12}>
          <Card plain>
            <CardBody>
              {
                isLoaded
                ? opportunities.map((op, i) => (
                  <div key={i} className={classes.op_list} onClick={() => this.doView(op.id)}>
                    <GridContainer className={classes.op_list_inner}>
                      <GridItem xs={5} sm={5} md={3} style={{textAlign:'right'}}>
                        <img className={classes.oppr_img} src={op.cover_photo_urls} alt={op.title + 'cover photo'}/>
                      </GridItem>
                      <GridItem xs={7} sm={7} md={6}>
                        <p>
                          <b style={{fontSize:'1rem', fontWeight: 'bolder'}}>{op.title}</b>
                          <span style={{float:'right'}}>
                            <i className="material-icons">
                              star_border
                            </i>
                          </span>
                        </p>
                        <p>
                          <span> {getShortDate(op.applications_close_date)} </span>
                          <span style={{marginLeft:'15px'}}>({getDays(op.applications_close_date)} days) </span>
                        </p>
                        <p>
                          <span><img className={classes.alpha_img} src={op.branch.organisation.profile_photo_urls.original} alt={op.branch.organisation.name}/></span>
                          <span style={{marginLeft:'25px'}}>{op.branch.organisation.name}</span>
                          <span className={classes.hideExtSnap}>
                            <span style={{float:'right'}}>&nbsp;: {op.applications_count} applicant</span>
                            <span style={{float:'right'}}>
                              <i className="material-icons">
                                face
                              </i>
                            </span>
                            <span style={{float:'right'}}>
                            {
                              op.applications_count === 0
                              ? (<span style={{color:'green'}}>Be the first one to apply! &nbsp;&nbsp;</span>)
                              : null
                            }
                            </span>
                          </span>
                        </p>
                      </GridItem>
                    </GridContainer>
                  </div>
                ))
                : (
                    <CardHeader color="primary">
                      <h4 className={classes.cardTitleWhite}>{loadText.title}</h4>
                      <p className={classes.cardCategoryWhite}>{loadText.message}</p>
                    </CardHeader>
                  )
              }
            </CardBody>
            {this.getPagination()}
          </Card>
        </GridItem>
      </GridContainer>
    );
  }

}

export default withStyles(styles)(Opportunities);
