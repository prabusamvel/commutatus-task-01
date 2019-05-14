import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";

import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";

import CardBody from "components/Card/CardBody.jsx";

//importing custom helper functions
import {getShortDate, parseOpportunityJson, getOpportunity, getSectionDetails} from '../../helper/opportunity_helper';

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  },
  topImageBg:{
    height: "53vh",
    backgroundImage: "url(https://cdn-expa.aiesec.org/gis-img/gv_default.png)",
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
    backgroundColor: "rgba(0, 0, 0, 0.7)"
  },
  overLayTitle:{
    position: "absolute",
    top: "19vh",
    left: 0,
    right: 0,
    width: "100%",
    textAlign: "center",
    color: "#fff",
    fontFamily: "Lato",
    fontSize: "36px",
    fontWeight: "bold",
    lineHeight: "55px",

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
  bgDiv:{
    textAlign:'left',
    lineHeight:'35px'
  },
  btnCircle:{
    float:'right',
    width:'50px',
    height:'50px',
    borderRadius:'50%'
  }
};

class Opportunity extends React.Component{

  constructor(props){
    super(props);
    let op_id = props.location.pathname.split('/')[3];
    this.state = {
      isLoaded: false,
      opportunity_id: op_id,
      opportunity_info: {},
      opportunity_short_info: {}
    }
  }

  componentDidMount(){
    getOpportunity(this.state.opportunity_id).then(op_response => {
      if(op_response !== false){
        let opportunity_info = JSON.parse(JSON.stringify(op_response));

        let need = {
          'overview':['title', 'description', 'programmes.short_name', 'role_info.city', 'role_info.selection_process', 'applications_close_date'],
          'prerequisties':['backgrounds.0', 'skills', 'nationalities', 'languages', 'study_levels'],
          'visa':['specifics_info.expected_work_schedule', 'specifics_info.salary', 'legal_info', 'logistics_info', 'legal_info.health_insurance_info', 'host_lc', 'reviews']
        };

        //parsed data to be showed...
        let opportunity_short_info = parseOpportunityJson(need, op_response);

        this.setState({opportunity_info, opportunity_short_info, isLoaded: true});
      }
    });
  }

  doEdit = () => {
    this.props.history.push(`/opportunity/edit/${this.state.opportunity_id}`);
  }

  render(){
    let {classes} = this.props;
    let {isLoaded, opportunity_id, opportunity_short_info, opportunity_info} = this.state;
    let _as = {'legal_info': 'Visa', 'name': 'city'};
    let no_need = ['short_name', 'host_lc', 'reviews'];

    return(
      <div>
          {
            isLoaded
            ? (
                <GridContainer>
                  <div className={classes.topImageBg}>
                    <div className={classes.overLay}>
                      <div className={classes.overLayTitle}>{opportunity_short_info.overview.title}</div>
                      <div className={classes.overLayText}><span>{`${!!opportunity_short_info.overview.city ? opportunity_short_info.overview.city : 'No city found!'}`}</span></div>
                    </div>
                  </div>

                  <GridItem xs={12} sm={12} md={8}>
                    <Card>
                      <CardBody>
                        <Button color="primary" round className={classes.btnCircle} onClick={() => this.doEdit()}>
                          <i className="material-icons">
                            edit
                          </i>
                        </Button>

                        {
                          Object.keys(opportunity_short_info).map((sec, i) => (
                            <div key={i}>
                              <h3 style={{textTransform: 'capitalize'}}>{sec}</h3>
                              {
                                Object.keys(opportunity_short_info[sec]).map((heading, j) =>
                                  no_need.indexOf(heading) === -1
                                  ? (
                                      <div key={`child-${j}`} style={{marginLeft:'15px'}}>
                                        <h5><strong style={{textTransform: 'capitalize'}}>{_as.hasOwnProperty(heading) ? _as[heading] : heading.split('_').join(' ')}</strong></h5>
                                        <div>{getSectionDetails(heading, opportunity_short_info[sec][heading])}</div>
                                      </div>
                                    )
                                  : null
                                )
                              }
                            </div>
                          ))
                        }
                      </CardBody>
                    </Card>
                  </GridItem>

                  <GridItem xs={12} sm={12} md={4}>
                    <Card profile>
                      <div style={{margin:'20px', marginBottom: '-25px'}}>
                        <a href="#pablo" onClick={e => e.preventDefault()}>
                          <img src={`https://s3-eu-west-1.amazonaws.com/cdn.expa.aiesec.org/icons-v2/${opportunity_short_info.overview.short_name.toLowerCase()}-logo.png`} alt="..." width="100%"/>
                        </a>
                      </div>
                      <CardBody profile>

                      <div className={classes.bgDiv}>

                        <GridContainer>
                          <GridItem xs={6} sm={6} md={6}>
                            <label>LANUAGE</label>
                            <br/>
                            {getSectionDetails('languages', opportunity_short_info.prerequisties.languages)}
                          </GridItem>
                          <GridItem xs={6} sm={6} md={6}>
                            <label>EARLIEST START DATE</label>
                            <br/>
                            <span>{getShortDate(opportunity_info.earliest_start_date)}</span>
                          </GridItem>
                        </GridContainer>

                        <GridContainer>
                          <GridItem xs={6} sm={6} md={6}>
                            <label>LATEST END DATE</label>
                            <br/>
                            <span>{getShortDate(opportunity_info.latest_end_date)}</span>
                          </GridItem>
                          <GridItem xs={6} sm={6} md={6}>
                            <label>DURATION</label>
                            <br/>
                            <span>{opportunity_info.duration} Weeks</span>
                          </GridItem>
                        </GridContainer>

                        <GridContainer>
                          <GridItem xs={6} sm={6} md={6}>
                            <label>SALARY</label>
                            <br/>
                            <span>{opportunity_short_info.visa.salary}</span>
                          </GridItem>
                          <GridItem xs={6} sm={6} md={6}>
                            <label>POSITIONS</label>
                            <br/>
                            <span>{opportunity_info.openings}</span>
                          </GridItem>
                        </GridContainer>

                      </div>

                        <Button color="default" round style={{marginTop:'20px'}}>
                          Login to apply
                        </Button>
                      </CardBody>
                    </Card>
                  </GridItem>
                </GridContainer>
              )
            : (
                <GridContainer>
                  <div className={classes.topImageBg}>
                    <div className={classes.overLay}>
                      <div className={classes.overLayTitle}>Opportunity</div>
                      <div className={classes.overLayText}><span>Loading...</span></div>
                    </div>
                  </div>
                  <GridItem xs={12} sm={12} md={12}>
                      <CardHeader color="primary" style={{marginTop:'30px'}}>
                        <h4 className={classes.cardTitleWhite}>Please wait</h4>
                        <p className={classes.cardCategoryWhite}>Your request is loading...</p>
                      </CardHeader>
                  </GridItem>
                </GridContainer>
              )
          }
      </div>
    );
  }

}

export default withStyles(styles)(Opportunity);
