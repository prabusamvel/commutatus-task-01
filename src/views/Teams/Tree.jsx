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
import Modal from '@material-ui/core/Modal';
import TextField from "@material-ui/core/TextField";

import TreeView from 'react-treeview';

import 'react-treeview/react-treeview.css';

//importing custom helper functions
import {getTerms, getTeams, getPositions, doUpdatePosition, addPosition} from '../../helper/opportunity_helper';

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
    lineHeight:'35px'
  },
  btnCircle:{
    float:'right',
    width:'50px',
    height:'50px',
    borderRadius:'50%'
  },
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: 'none',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: "100%"
  }
});

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

function processPositions(users) {
  let newusers = {};

  //making a position_id as key based object (for index based comparision)
  users.forEach(
    user => (newusers[`id-${user.id}`] = Object.assign(user, { children: [] }))
  );

  //pushing the children into parents based on parent_id comparision (into positon.children arr which initlized in before step)
  users.forEach(user => {
    if (!!user.parent_id && newusers.hasOwnProperty(`id-${user.parent_id}`)) {
      newusers[`id-${user.parent_id}`].children.push(user);
    }
  });

  //iterating the newly created object && passing into recursive function which creates the tree structure.
  for (let u in newusers) {
    let users = newusers[u].children;
    doNest(users);
  }

  //recursive function for creating the tree structure
  function doNest(users) {
    if (users.length > 0) {
      users.forEach((user, i) => {
        let key = `id-${user.id}`;
        if (newusers.hasOwnProperty(key)) {
          let position = JSON.parse(JSON.stringify(newusers[key]));
          if (user.id !== position.id) {
            user["children"].push(position);
          }
          delete newusers[key];
          doNest(user["children"]);
        }
      });
    }
  }

  //returing the final array (positions) :)
  return Object.values(newusers);
}

function positionRender(positions, team_id, j, k, _this){

  if(Array.isArray(positions) && positions.length > 0 && positions[0].id !== 0){
    return positions.map(position => (
      <TreeView
        nodeLabel={
          (
            <span>
              <span className="node">{position.name}</span>
              &nbsp;&nbsp;
              <span style={{cursor:'pointer', color:'red'}} onClick={() => _this.modalOpen(position, team_id, j, k, 'edit')}>edit</span>
              &nbsp;&nbsp;
              <span style={{cursor:'pointer', color:'green'}} onClick={() => _this.modalOpen(position, team_id, j, k, 'add')}>add</span>
            </span>
          )
        }
        key={position.id}
        defaultCollapsed={true}>
        {positionRender(position.children, team_id, j, k, _this)}
      </TreeView>
    ));
  }else{
    console.log('else', positions);
    return (
      <TreeView
        nodeLabel={(<span>{positions.length > 0 ? positions[0].name : 'nothing down here!'}</span>)}
        defaultCollapsed={true}>
        <div className="info">(<span>{positions.length > 0 ? positions[0].name : 'nothing down here!'}</span>)</div>
      </TreeView>
    )
  }
}

class Tree extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      isLoaded: false,
      data:[{
        type: 'Committee',
        collapsed: false,
        terms: [],
      }],
      loadText:{
        title: 'Please wait...',
        message: 'Your request is loading...'
      },
      modal:{
        show: false,
        team_id: 0,
        data:{},
        current_term: 0,
        current_team: 0,
        err: '',
        mode: '',
      }
    }
  }

  modalOpen = (position, team_id, j, k, mode) => {
    let modal = this.state.modal;
    modal.show = true;
    modal.team_id = team_id;
    modal.current_term = j;
    modal.current_team = k;
    modal.err = '';
    modal.mode = mode;
    modal.data = JSON.parse(JSON.stringify(position));
    this.setState({modal});
  };

  modalClose = () => {
    let modal = this.state.modal;
    modal.show = false;
    this.setState({modal});
  };

  componentDidMount(){
    getTerms(1585).then(terms => {
      if(terms !== false){
        terms = terms.data;
        terms.forEach((term, i) => {
          terms[i]['teams'] = [{id: 0, title: "loading..."}];
        });
        let data = this.state.data;
        data[0].terms = terms;
        this.setState({data, isLoaded: true}, () => {
          console.log('updating terms', data);
        });
      }
    });
  }

  onTermClick = (event, term_id, i) => {
    let checkLoaded = this.state.data[0].terms[i].teams[0].title !== 'loading...';
    if(!checkLoaded){
      getTeams(1585, term_id).then(teams => {
          teams = teams.data;
          teams.forEach((team, i) => {
            teams[i]['positions'] = [{id: 0, name: "loading..."}];
          });
          //console.log(`teams-of-${term_id}-${i}`, teams);
          let data = this.state.data;
          data[0].terms[i].teams = teams;
          this.setState({data, isLoaded: true}, () => {
            console.log('updating teams', data);
          });
      });
    }

  }

  onTeamClick = (event, team_id, j, k) => {

    let checkLoaded = this.state.data[0].terms[j].teams[k].positions[0].name !== 'loading...';
    if(!checkLoaded){
      getPositions(team_id).then(team => {
          let positions = [{id: 0, name:'No positions found!'}];
          if(team.hasOwnProperty('positions') && team.positions.length > 0){
            positions = processPositions(team.positions);
          }
          console.log('positions', positions);
          let data = this.state.data;
          data[0].terms[j].teams[k].positions = positions;
          this.setState({data, isLoaded: true}, () => {
            //console.log('updating positions', data);
          });

      });
    }else{
      console.log(this.state.data[0].terms[j].teams[k].positions);
    }
  }

  onModalChange = (event, title) => {
    let modal = this.state.modal;
    modal.data[title] = event.target.value;
    this.setState({modal});
  }

  updatePosition = () => {
    let data = this.state.modal.data;
    let position_id = data.id;
    let team_id = this.state.modal.team_id;
    let position = {};

    let modal = this.state.modal;
    modal.err = 'Loading...';
    this.setState({modal});

    let need = ['parent_id', 'role_id', 'parent_id', 'start_date', 'end_date', 'function_id'];
    need.forEach(field => {
      if(data.hasOwnProperty(field)){
        position[field] = data[field];
      }
    });

    position['position_name'] = data.name;

    let postData = {
      access_token: 'dd0df21c8af5d929dff19f74506c4a8153d7acd34306b9761fd4a57cfa1d483c',
      position_id,
      team_id,
      position
    };

    if(modal.mode === "edit"){
      doUpdatePosition(postData, team_id, position_id)
      .then(result => {
        if(result !== false && Object.keys(result).length > 1){
          let modal = this.state.modal;
          let j = modal.current_term;
          let k = modal.current_team;
          let data = this.state.data;
          modal.show = false;
          data[0].terms[j].teams[k].positions = [{id: 0, name: "loading..."}];
          this.setState({data, modal}, () => {
            this.onTeamClick(null, team_id, j, k);
          });
        }else{
          let modal = this.state.modal;
          modal.err = 'API endpoint failed to update!';
          this.setState({modal});
        }
      });
    }else{

      //need to do user data.id as parent_id
      let _position = postData.position;
      _position['parent_id'] = position_id
      _position['person_id'] = data.person.id;
      _position['start_date'] = '2019-01-23T05:04:20Z';
      _position['end_date'] = '2020-01-23T05:04:20Z';
      _position['name'] = data.name;
      postData.position =_position;
      //console.log(postData);
      addPosition(postData, team_id)
      .then(result => {
        if(result !== false && Object.keys(result).length > 1){
          let modal = this.state.modal;
          let j = modal.current_term;
          let k = modal.current_team;
          let data = this.state.data;
          modal.show = false;
          data[0].terms[j].teams[k].positions = [{id: 0, name: "loading..."}];
          this.setState({data, modal}, () => {
            this.onTeamClick(null, team_id, j, k);
          });
        }else{
          let modal = this.state.modal;
          modal.err = 'API endpoint failed to update!';
          this.setState({modal});
        }
      });
    }


  }


  render(){
    let {classes} = this.props;
    let {isLoaded, loadText, modal} = this.state;

    return(
      <div>
          {
            isLoaded
            ? (
                <GridContainer>
                  <div className={classes.topImageBg}>
                    <div className={classes.overLay}>
                      <div className={classes.overLayTitle}>Teams </div>
                      <div className={classes.overLayText}><span>Tree view</span></div>
                    </div>
                  </div>

                  <GridItem xs={12} sm={12} md={12}>
                    <Card>
                      <CardBody>
                        {this.state.data.map((node, i) => {
                          const type = node.type;
                          const label = <span className="node">{type}</span>;
                          return (
                            <TreeView key={type + '|' + i} nodeLabel={label} defaultCollapsed={false}>
                              {node.terms.map((term, j) => {
                                const label2 = <span className="node">{term.short_name}</span>;
                                return !term.hasOwnProperty('teams')
                                  ?
                                    (
                                      <TreeView nodeLabel={label2} key={term.short_name} defaultCollapsed={false}>
                                        <div className="info">name: {term.short_name}</div>
                                      </TreeView>
                                    )
                                  : (
                                      <TreeView key={'lv2' + term.short_name + '|' + i} nodeLabel={(<span className="node">{term.short_name}</span>)} defaultCollapsed={true} onClick={(event) => this.onTermClick(event, term.id, j)}>
                                        {term.teams.map((team, k) => {
                                            const label3 = <span className="node">{team.title}</span>;
                                            return !team.hasOwnProperty('positions')
                                            ?
                                              (
                                                <TreeView nodeLabel={(<span className="node">{team.title}</span>)} key={'l2'+team.title} defaultCollapsed={true}>
                                                  <div className="info">title: {team.title}</div>
                                                </TreeView>
                                              )
                                            : (
                                                <TreeView
                                                  key={'lv3' + team.title + '|' + j}
                                                  nodeLabel={
                                                    (
                                                      <span className="node">
                                                        {team.title}
                                                      </span>
                                                    )
                                                  }
                                                  defaultCollapsed={true}
                                                  onClick={(event) => this.onTeamClick(event, team.id, j, k)}>
                                                  {positionRender(team.positions, team.id, j, k, this)}
                                                </TreeView>
                                              )
                                          }
                                        )}
                                      </TreeView>
                                    )
                              })}
                            </TreeView>
                          );
                        })}
                      </CardBody>
                    </Card>
                  </GridItem>

                </GridContainer>
              )
            : (
                <GridContainer>
                  <div className={classes.topImageBg}>
                    <div className={classes.overLay}>
                      <div className={classes.overLayTitle}>Teams</div>
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

        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={modal.show}
          onClose={this.modalClose}
        >

          <div style={getModalStyle()} className={classes.paper}>

            {
              modal.err.length > 0
              ? <small style={{color:'red'}}>{modal.err}</small>
              : null
            }

            <TextField
              label="Title"
              className={classes.textField}
              value={modal.data.hasOwnProperty('name') ? modal.data.name : ''}
              onChange={(event) => this.onModalChange(event, "name")}
              margin="normal"
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.textField}
              onClick={() => this.updatePosition()}
            >
              Update
            </Button>
          </div>
        </Modal>

      </div>
    );
  }

}

export default withStyles(styles)(Tree);
