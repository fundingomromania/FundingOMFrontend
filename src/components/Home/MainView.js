import CampaignList from '../CampaignList';
import React from 'react';
import agent from '../../agent';
import { connect } from 'react-redux';
import { CHANGE_TAB, FIRST_PAGE_LOADED, FIRST_PAGE_UNLOADED } from '../../constants/actionTypes';

const GlobalFeedTab = props => {
  this.clickTab = React.createRef();
  this.clickHandler = ev => {
    ev.preventDefault();
    props.onTabClick('all', agent.Campaigns.all, agent.Campaigns.all());
  };

  return (
    <h3 className="homeExploreTitle">Explore campaigns</h3>
  );

};

const TagFilterTab = props => {
  if (!props.tag) {
    return null;
  }

  return (
    <li className="nav-item">
      <a href="" className="nav-link active">
        <i className="ion-pound"></i> {props.tag}
      </a>
    </li>
  );
};

const mapStateToProps = state => ({
  ...state.campaignList,
  tags: state.home.tags,
  token: state.common.token
});

const mapDispatchToProps = dispatch => ({
  onTabClick: (tab, pager, payload) => dispatch({ type: CHANGE_TAB, tab, pager, payload }),
  onLoad: (tab, pager, payload) => dispatch({type: CHANGE_TAB, tab, pager, payload}),
  onUnload: () => dispatch({type: FIRST_PAGE_UNLOADED})
});

// const MainView = props => {
  
//   return (
//     <div className="col-md-9">
//       <div className="feed-toggle">
//         <ul className="nav nav-pills outline-active">

//           <GlobalFeedTab tab={props.tab} ref={this.clickTab} onTabClick={props.onTabClick} />

//           <TagFilterTab tag={props.tag} />

//         </ul>
//       </div>

//       <CampaignList
//         pager={props.pager}
//         campaigns={props.campaigns}
//         loading={props.loading}
//         campaignsCount={props.campaignsCount}
//         currentPage={props.currentPage} />
//     </div>
//   );
// };

class MainView extends React.Component {
  componentWillMount () {
    
    this.props.onLoad(
      'all', 
      agent.Campaigns.all,
      agent.Campaigns.all()
    );

  }
  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    return(
      <div className="col-md-9">
          <div className="feed-toggle">
            <ul className="nav nav-pills outline-active">

              <GlobalFeedTab tab={this.props.tab} ref={this.clickTab} onTabClick={this.props.onTabClick} />

              <TagFilterTab tag={this.props.tag} />

            </ul>
          </div>

          <CampaignList
            pager={this.props.pager}
            campaigns={this.props.campaigns}
            loading={this.props.loading}
            campaignsCount={this.props.campaignsCount}
            currentPage={this.props.currentPage} />
        </div>
    )   
  }


}

export default connect(mapStateToProps, mapDispatchToProps)(MainView);
export { MainView, mapStateToProps };
