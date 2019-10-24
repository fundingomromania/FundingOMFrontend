import React from 'react';
import { Link } from 'react-router-dom';
import agent from '../agent';
import { connect } from 'react-redux';
import { CAMPAIGN_FAVORITED, CAMPAIGN_UNFAVORITED } from '../constants/actionTypes';

const FAVORITED_CLASS = 'btn btn-sm btn-primary';
const NOT_FAVORITED_CLASS = 'btn btn-sm btn-outline-primary';

const mapDispatchToProps = dispatch => ({
  favorite: slug => dispatch({
    type: CAMPAIGN_FAVORITED,
    payload: agent.Campaigns.favorite(slug)
  }),
  unfavorite: slug => dispatch({
    type: CAMPAIGN_UNFAVORITED,
    payload: agent.Campaigns.unfavorite(slug)
  })
});

const CampaignPreview = props => {
  const campaign = props.campaign;
  const favoriteButtonClass = campaign.favorited ?
    FAVORITED_CLASS :
    NOT_FAVORITED_CLASS;

  const handleClick = ev => {
    ev.preventDefault();
    if (campaign.favorited) {
      props.unfavorite(campaign.slug);
    } else {
      props.favorite(campaign.slug);
    }
  };
  
  const treatAsUTC = (date) => {
    var result = new Date(date);
    result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
    return result;
  }

  const daysBetween = (startDate, campaignDuration) => {
    var millisecondsPerDay = 24 * 60 * 60 * 1000;
    var today = new Date();
    var daysFromStart = Math.trunc((treatAsUTC(today) - treatAsUTC(startDate)) / millisecondsPerDay);
    var result = campaignDuration - daysFromStart;
      if(result > 0) {
        return result;
      }
      else {
        return 0;
      }
  }

  return (
    <div className="campaign-preview">
      <div className="row">
        <div className="col-md-4 col-xs-12">
              <img src={campaign.image} className="img-fluid imgPreview" title="Campaign Image" alt="Campaign"></img>
        </div>
        <div className="col-md-8 col-xs-12">
              <Link to={`/campaign/${campaign.slug}`} className="preview-link">
                <h1>{campaign.title}</h1>
              </Link>
          <div className="campaign-meta"> 
            <div className="row">
              <div className="info col-md-12 col-xs-12">
                  <Link className="author" to={`/@${campaign.author.username}`}>
                    {campaign.author.username}
                  </Link> 
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 col-xs-12">
                <span className="previewTimeRemaining">{daysBetween(campaign.createdAt, campaign.campaignExpiryDate)} days left</span>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 col-xs-12">
                <span className="amountPreview">{campaign.totalDonations}€</span><span className="donationsTargetPreview"> donated of {campaign.campaignDonationsTarget}€ goal </span> 
              </div>
            </div>   
          </div> 
          <div className="row">
            <div className="col-md-12 col-xs-12">
              <p>{campaign.description}</p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 col-xs-12">
              <Link to={`/campaign/${campaign.slug}`} className="preview-link">
                <span>Find out more...</span>
              </Link>
            </div>
          </div>
        </div>
      </div>      
    </div>
  );
}

export default connect(() => ({}), mapDispatchToProps)(CampaignPreview);
