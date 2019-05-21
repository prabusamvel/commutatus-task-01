/*
Helpers functions for opportunity components
********************************************
Author : Prabu samvel
Last Updated: 14-05-2019
For: Commutatus-task
*/

import React from "react";

export function getShortDate(_date){
  let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let date = new Date(_date), d = date.getDate(), m = months[date.getMonth()], y = date.getFullYear();
  return `${d} ${m} ${y}`;
}

export function getDays(_date){
  _date = new Date(_date);
  let date = new Date(), diffTime = Math.abs(_date.getTime() - date.getTime()), diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function getDiffDays(date1, date2){
  date1 = new Date(date1);
  date2 = new Date(date2);
  let diffTime = Math.abs(date1.getTime() - date2.getTime()), diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export async function getOpportunities(page = 1, param = {}){
  let url = 'https://api-staging.aiesec.org/v2/opportunities?access_token=dd0df21c8af5d929dff19f74506c4a8153d7acd34306b9761fd4a57cfa1d483c';
  url += `&page=${page}`;

  //if param is not empty then parse and append with url

  let response = await fetch(url)
  .then(res => res.json())
  .then(result => {
    return result;
  },
  err => {
    console.log('faild to get opportunities :', err);
    return false;
  })
  .catch(err => console.log(err));
  return response;
}

export function parseOpportunityJson(need, _obj){
  let newData = {};
  for(let sec in need){
    let _data = {};
    need[sec].map(key => {
        if(key.indexOf('.') !== false){
          let _need = key.split('.');
          let newKey = isNaN(+_need[_need.length - 1]) ? _need[_need.length - 1] : _need[0];
          _data[newKey] = _need.reduce((ac, cv) => !!ac && ac.hasOwnProperty(cv) ? ac[cv] : '', _obj);
        }else{
          _data[key] = _obj.hasOwnProperty(key) ? _obj[key] : '';
        }
    });
    newData[sec] = _data;
  }
  return newData;
}

export async function getOpportunity(id){

  let url = `https://api-staging.aiesec.org/v2/opportunities/${id}?access_token=dd0df21c8af5d929dff19f74506c4a8153d7acd34306b9761fd4a57cfa1d483c`;
  let response = await fetch(url)
  .then(res => res.json())
  .then(result => {
    return result;
  },
  err => {
    console.log('faild to get opportunities :', err);
    return false;
  })
  .catch(err => console.log(err));
  return response;
}

export function getSectionDetails(section, obj){
  let text;
  switch(section){
    case 'applications_close_date':
      text = (<span>{!!obj ? getShortDate(obj) : 'Not yet updated.'}</span>);
    break;
    case 'backgrounds':
      text = (<span>{obj.name}</span>);
    break;
    case 'skills':
    case 'nationalities':
    case 'languages':
    case 'study_levels':
      if(obj.length > 0){
        text = [];
        obj.forEach((item, i) => text.push(<span key={i}>{item.name}</span>));
      }else{
        text = (<span>{`No ${section.split('_').join(' ')} found!`}</span>);
      }
    break;
    case 'expected_work_schedule':
      text = (<span>{`${obj.from} to ${obj.to}`}</span>);
    break;
    case 'logistics_info':
    case 'legal_info':
      text = [];
        for(let lb in obj){
          text.push(
            <p key={lb} style={{marginLeft: '15px'}}>
              <label>{lb.split('_').join(' ').toUpperCase()}</label>
              <br/>
              <span>{`${obj[lb] === 'false' ? 'No' : obj[lb]}`}</span>
            </p>
          );
        }
    break;

    default:
      if(typeof obj === 'string'){
        text = (obj.length === 0) ? (<span>{`There are no ${obj.split('_').join(' ')} for this opportunity,`}</span>) : (<span>{obj}</span>);
      }else{
        text = (<span>{ !!obj ? JSON.stringify(obj) : 'No details found.'}</span>);
      }
    break;
  }
  return text;
}

export async function getBackgrounds(){

  let url = `https://api-staging.aiesec.org/v2/lists/backgrounds?access_token=dd0df21c8af5d929dff19f74506c4a8153d7acd34306b9761fd4a57cfa1d483c`;
  let response = await fetch(url)
  .then(res => res.json())
  .then(result => {
    return result;
  },
  err => {
    console.log('faild to get backgrounds :', err);
    return false;
  })
  .catch(err => console.log(err));
  return response;
}

export function toSysDate(_date){
  let date = new Date(_date), d = date.getDate() + '', m = date.getMonth() + 1 + '', y = date.getFullYear();
  return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
}

export function isEmpty(n){
	return !(!!n ? typeof n === 'object' ? Array.isArray(n) ? !!n.length : !!Object.keys(n).length : true : false);
}

export async function updateOpportunity(data, id){
  let url = `https://api-staging.aiesec.org/v2/opportunities/${id}`;
  let response = await fetch(url, {
      method: 'PATCH',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
   })
   .then(res => res.json())
   .then(result => {
     return result;
   },
   err => {
     console.log('faild to get backgrounds :', err);
     return false;
   })
   .catch(err => console.log(err));
   return response;
 }

//todo - list
export async function getTerms(committee_id){
  let url = `http://gisapi-web-staging-1636833739.eu-west-1.elb.amazonaws.com/v2/committees/${committee_id}/terms?access_token=dd0df21c8af5d929dff19f74506c4a8153d7acd34306b9761fd4a57cfa1d483c`;
  let response = await fetch(url)
  .then(res => res.json())
  .then(result => {
    return result;
  },
  err => {
    console.log('faild to get opportunities :', err);
    return false;
  })
  .catch(err => console.log(err));
  return response;
}

export async function getTeams(committee_id, term_id){
  let url = `http://gisapi-web-staging-1636833739.eu-west-1.elb.amazonaws.com/v2/committees/${committee_id}/terms/${term_id}/teams?access_token=dd0df21c8af5d929dff19f74506c4a8153d7acd34306b9761fd4a57cfa1d483c`;
  let response = await fetch(url)
  .then(res => res.json())
  .then(result => {
    return result;
  },
  err => {
    console.log('faild to get opportunities :', err);
    return false;
  })
  .catch(err => console.log(err));
  return response;
}

export async function getPositions(team_id){

  let url = `http://gisapi-web-staging-1636833739.eu-west-1.elb.amazonaws.com/v2/teams/${team_id}?access_token=dd0df21c8af5d929dff19f74506c4a8153d7acd34306b9761fd4a57cfa1d483c`;
  let response = await fetch(url)
  .then(res => res.json())
  .then(result => {
    return result;
  },
  err => {
    console.log('faild to get opportunities :', err);
    return false;
  })
  .catch(err => console.log(err));
  return response;
}

export async function doUpdatePosition(data, team_id, position_id){
 let url = `http://gisapi-web-staging-1636833739.eu-west-1.elb.amazonaws.com/v2/teams/${team_id}/positions/${position_id}`;
 let response = await fetch(url, {
     method: 'PATCH',
     mode: 'cors',
     cache: 'no-cache',
     credentials: 'same-origin',
     headers: {
         'Content-Type': 'application/json',
     },
     body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(result => {
    return result;
  },
  err => {
    console.log('faild to get backgrounds :', err);
    return false;
  })
  .catch(err => console.log(err));
  return response;
}

export async function addPosition(data, team_id){
 let url = `http://gisapi-web-staging-1636833739.eu-west-1.elb.amazonaws.com/v2/teams/${team_id}/positions`;
 let response = await fetch(url, {
     method: 'POST',
     mode: 'cors',
     cache: 'no-cache',
     credentials: 'same-origin',
     headers: {
         'Content-Type': 'application/json',
     },
     body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(result => {
    return result;
  },
  err => {
    console.log('faild to get backgrounds :', err);
    return false;
  })
  .catch(err => console.log(err));
  return response;
}

//holded
/*export async function getTeamsTree(committee_id){

  //1) terms of committee (committee - 1585)
  let url1 = `http://gisapi-web-staging-1636833739.eu-west-1.elb.amazonaws.com/v2/committees/1585/terms?access_token=dd0df21c8af5d929dff19f74506c4a8153d7acd34306b9761fd4a57cfa1d483c`;
  //2) teams of terms (committee - 1585, term - 1442)
  let url2 = `http://gisapi-web-staging-1636833739.eu-west-1.elb.amazonaws.com/v2/committees/1585/terms/1442/teams?access_token=dd0df21c8af5d929dff19f74506c4a8153d7acd34306b9761fd4a57cfa1d483c`;
  //3) team details (team - 1442)
  let ulr3 = `http://gisapi-web-staging-1636833739.eu-west-1.elb.amazonaws.com/v2/teams/1442?access_token=dd0df21c8af5d929dff19f74506c4a8153d7acd34306b9761fd4a57cfa1d483c`;

  let tree = await fetch(url)
  .then(res => res.json())
  .then(committee => {
      committee.terms;
  });
}*/
