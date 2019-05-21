// core components/views for Opportunity
import OpportunitiesList from "views/Opportunities/List.jsx";
import OpportunityView from "views/Opportunity/View.jsx";
import OpportunityEdit from "views/Opportunity/Edit.jsx";
import TeamTreeView from "views/Teams/Tree.jsx";

const dashboardRoutes = [
  {
    path: "/opportunities",
    name: "Opportunity List",
    component: OpportunitiesList
  },
  {
    path: "/opportunity/view",
    name: "Opportunity View",
    component: OpportunityView
  },
  {
    path: "/opportunity/edit",
    name: "Opportunity Edit",
    component: OpportunityEdit
  },
  {
    path: "/teams/view",
    name: "Team Tree View",
    component: TeamTreeView
  }

];

export default dashboardRoutes;
