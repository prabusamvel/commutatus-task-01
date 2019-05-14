/* global google */
import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";

import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "components/CustomButtons/Button.jsx";

import MUIPlacesAutocomplete from 'mui-places-autocomplete';

//importing custom helper functions
import {
  getShortDate,
  getDays,
  getDiffDays,
  parseOpportunityJson,
  getOpportunity,
  getSectionDetails,
  getBackgrounds,
  isEmpty,
  toSysDate,
  updateOpportunity
} from '../../helper/opportunity_helper';

const styles = theme => ({
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
    lineHeight:'35px',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: "45%"
  },
  textArea: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: "92%"
  },
  dense: {
    marginTop: 19
  },
  menu: {
    width: 200
  },
  formControl: {
    margin: theme.spacing.unit,
    width:'45%',
    marginTop:'16px'
  },
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  acDiv:{
    width: '45%',
    marginLeft: '1%',
    marginRight: '1%',
    marginTop: '16px',
    '& div':{
      '& div':{
        width:'100%'
      }
    }
  }
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

class Opportunity extends React.Component{

  constructor(props){
    super(props);
    let op_id = props.location.pathname.split('/')[3];
    this.state = {
      isLoaded: false,
      opportunity_id: op_id,
      opportunity_info: {},
      opportunity_short_info: {},
      backgrounds:[],
      bg_selected:[],
      form_data: {
        name: [],
        desc: "",
        title: "",
        salary: 0,
        multiline: "Controlled",
        currency: "EUR",
        city: ""
      },
      err:'',
      loadText:{
        title: 'Please wait...',
        message: 'Your request is loading...'
      }
    }
  }

  componentDidMount(){

    let backgrounds = [];

    getBackgrounds().then(bg_response => {
      if(bg_response !== false){
        backgrounds = bg_response;
      }
    });

    getOpportunity(this.state.opportunity_id).then(op_response => {
      if(op_response !== false && Object.keys(op_response).length > 1){
        let opportunity_info = op_response;
        let need = {
          'form_data':['title', 'applications_close_date', 'earliest_start_date', 'latest_end_date', 'description', 'backgrounds', 'role_info.selection_process', 'specifics_info.salary', 'role_info.city']
        };
        //parsed data to be showed...
        let opportunity_short_info = parseOpportunityJson(need, op_response);
        if(opportunity_short_info.form_data.backgrounds.length > 0){
          opportunity_short_info.form_data.backgrounds = opportunity_short_info.form_data.backgrounds.map(bg => bg.id);
        }

        opportunity_short_info.form_data.applications_close_date = toSysDate(opportunity_short_info.form_data.applications_close_date);
        opportunity_short_info.form_data.earliest_start_date = toSysDate(opportunity_short_info.form_data.earliest_start_date);
        opportunity_short_info.form_data.latest_end_date = toSysDate(opportunity_short_info.form_data.latest_end_date);

        this.setState({opportunity_info, opportunity_short_info, backgrounds, isLoaded: true});
      }
      else{
        let err = op_response.hasOwnProperty('error') ? op_response.error : 'Unknown';
        let loadText = this.state.loadText;
        loadText.title = "API endpoint failed to response.";
        loadText.message = err;
        this.setState({loadText});
      }
    });
  }

  doView = () => {
    this.props.history.push(`/opportunity/view/${this.state.opportunity_id}`);
  }

  handlePlaceChanged = (place) => {
    let opportunity_short_info = this.state.opportunity_short_info;
    opportunity_short_info.form_data.city = place.description;
    this.setState({opportunity_short_info});
  }

  handleChange = name => event => {
    let form_data = this.state.opportunity_short_info.form_data;
    form_data[name] = event.target.value;
    this.setState({ form_data });
  };

  handleSubmit = event => {
    event.preventDefault();

    let form_data = this.state.opportunity_short_info.form_data;
    for(let field in form_data){
      let value = form_data[field];
      if(isEmpty(value)){
        this.setState({err:'All fields are required!'});
        console.log(form_data);
        return false;
      }
    }

    if(form_data.title.length > 100){
      this.setState({err:'Title should not be longer than 100 characters!'});
      return false;
    }

    let close_days = getDays(form_data.applications_close_date);
    if(close_days < 30){
      this.setState({err:'Applications close date cannot be less than 30 days from current date!'});
      return false;
    }

    if(close_days > 90){
      this.setState({err:'Applications close date cannot be more than 90 days from current date!'});
      return false;
    }

    let diff_weeks = Math.round(getDiffDays(form_data.earliest_start_date, form_data.latest_end_date) / 7);
    if(diff_weeks < 6 || diff_weeks > 78 ){
      this.setState({err:'The difference between earliest start date and latest end date should be between 6 to 78 weeks!'});
      return false;
    }

    if(form_data.backgrounds.length > 3){
      this.setState({err:'Maximum of 3 backgrounds can be set!'});
      return false;
    }

    let backgrounds = [];
    this.state.backgrounds.forEach(bg => {
      if(form_data.backgrounds.indexOf(bg.id) !== -1){
        bg['option'] = 'preferred';
        backgrounds.push(bg);
      }
    });

    let patchObject = {
      access_token: 'dd0df21c8af5d929dff19f74506c4a8153d7acd34306b9761fd4a57cfa1d483c',
      opportunity: {
        title : form_data.title,
        applications_close_date: form_data.applications_close_date,
        earliest_start_date: form_data.earliest_start_date,
        latest_end_date: form_data.latest_end_date,
        description: form_data.description,
        backgrounds: backgrounds,
        role_info: {
          selection_process: form_data.selection_process,
          city: form_data.city
        },
        specifics_info: {
          salary: form_data.salary
        }
      }
    };

    this.setState({err:''});

    updateOpportunity(patchObject, this.state.opportunity_id).then(result => {
      if(result !== false && Object.keys(result).length > 1){
        this.props.history.push(`/opportunity/view/${this.state.opportunity_id}`);
      }else{
        console.log(result['error']);
        this.setState({err: 'Opportunity update failed! (Check console for error log)'});
      }
    });

  }

  render(){
    let {classes} = this.props;
    let {isLoaded, opportunity_id, opportunity_info, opportunity_short_info, backgrounds, loadText} = this.state;
    let bgshort = {};
    if(isLoaded){
      backgrounds.forEach(bg => {
        bgshort[`bg-${bg.id}`] = bg.name;
      });
    }

    return(
      <div>
          {
            isLoaded
            ? (
                <GridContainer>
                  <div className={classes.topImageBg}>
                    <div className={classes.overLay}>
                    <div className={classes.overLayTitle}>{opportunity_info.title}</div>
                    <div className={classes.overLayText}><span>{`${!!opportunity_info.role_info.city ? opportunity_info.role_info.city : 'No city found!'}`}</span></div>
                    </div>
                  </div>
                  <GridItem xs={12} sm={12} md={8}>
                    <Card>

                      <CardBody>
                        <GridContainer>
                          <GridItem  xs={12} sm={12} md={12}>
                            <h3>Update Opportunity</h3>
                            <span style={{color:'red'}}>{this.state.err}</span>
                          </GridItem>
                        </GridContainer>

                        <form
                        className={classes.container}
                        noValidate
                        autoComplete="off"
                        onSubmit={this.handleSubmit}
                        >
                          <TextField
                            label="Title"
                            className={classes.textField}
                            value={opportunity_short_info.form_data.title}
                            onChange={this.handleChange("title")}
                            margin="normal"
                          />

                          <div className={classes.acDiv}>
                            <MUIPlacesAutocomplete
                              onSuggestionSelected={this.handlePlaceChanged}
                              renderTarget={() => (<div />)}
                              textFieldProps={{ value: opportunity_short_info.form_data.city,
                                                placeholder:"Enter location",
                                                label:"City",
                                                onChange: this.handleChange("city")
                                              }}
                            />
                          </div>

                          <TextField
                            label="Salary"
                            value={opportunity_short_info.form_data.salary}
                            onChange={this.handleChange("salary")}
                            type="number"
                            className={classes.textField}
                            InputLabelProps={{
                              shrink: true
                            }}
                            margin="normal"
                          />

                          <TextField
                            label="Applications close date"
                            type="date"
                            className={classes.textField}
                            value={opportunity_short_info.form_data.applications_close_date}
                            onChange={this.handleChange("applications_close_date")}
                            margin="normal"
                          />

                          <TextField
                            label="Earliest start date"
                            type="date"
                            className={classes.textField}
                            value={opportunity_short_info.form_data.earliest_start_date}
                            onChange={this.handleChange("earliest_start_date")}
                            margin="normal"
                          />

                          <TextField
                            label="Latest end date"
                            type="date"
                            className={classes.textField}
                            value={opportunity_short_info.form_data.latest_end_date}
                            onChange={this.handleChange("latest_end_date")}
                            margin="normal"
                          />

                          <TextField
                            label="Selection process"
                            className={classes.textField}
                            value={opportunity_short_info.form_data.selection_process}
                            onChange={this.handleChange("selection_process")}
                            margin="normal"
                          />

                          <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="select-multiple-checkbox">Tag</InputLabel>
                            <Select
                              multiple
                              label="Select"
                              value={opportunity_short_info.form_data.backgrounds}
                              onChange={this.handleChange("backgrounds")}
                              input={<Input id="select-multiple-checkbox" />}
                              renderValue={selected => selected.map(id => bgshort[`bg-${id}`]).join(',')}
                              MenuProps={MenuProps}
                            >
                              {backgrounds.map((bg, i) => (
                                <MenuItem key={bg.id} value={bg.id}>
                                  <Checkbox
                                    checked={opportunity_short_info.form_data.backgrounds.indexOf(bg.id) > -1}
                                  />
                                  <ListItemText primary={bg.name} />
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>

                          <TextField
                            id="standard-multiline-static"
                            label="Multiline"
                            multiline
                            rows="4"
                            className={classes.textArea}
                            margin="normal"
                            value={opportunity_short_info.form_data.description}
                            onChange={this.handleChange("description")}
                          />

                          <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            className={classes.textField}
                          >
                            Save
                          </Button>

                          <Button
                            variant="contained"
                            color="default"
                            className={classes.textField}
                            onClick={() => this.doView()}
                          >
                            Back
                          </Button>
                        </form>
                      </CardBody>
                    </Card>
                  </GridItem>

                  <GridItem xs={12} sm={12} md={4}>
                    <Card profile>
                      <div style={{margin:'20px', marginBottom: '-25px'}}>
                        <a href="#pablo" onClick={e => e.preventDefault()}>
                          <img src={`https://s3-eu-west-1.amazonaws.com/cdn.expa.aiesec.org/icons-v2/${opportunity_info.programmes.short_name.toLowerCase()}-logo.png`} alt="..." width="100%"/>
                        </a>
                      </div>
                      <CardBody profile>

                      <div className={classes.bgDiv}>

                        <GridContainer>
                          <GridItem xs={6} sm={6} md={6}>
                            <label>LANUAGE</label>
                            <br/>
                            {getSectionDetails('languages', opportunity_info.languages)}
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
                            <span>{opportunity_info.specifics_info.salary}</span>
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
                        <h4 className={classes.cardTitleWhite}>{loadText.title}</h4>
                        <p className={classes.cardCategoryWhite}>{loadText.message}</p>
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
