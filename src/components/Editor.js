import ListErrors from './ListErrors';
import React from 'react';
import agent from '../agent';
import { connect } from 'react-redux';
import {
  ADD_TAG,
  EDITOR_PAGE_LOADED,
  REMOVE_TAG,
  CAMPAIGN_SUBMITTED,
  EDITOR_PAGE_UNLOADED,
  UPDATE_FIELD_EDITOR
} from '../constants/actionTypes';

const mapStateToProps = state => ({
  ...state.editor
});

const mapDispatchToProps = dispatch => ({
  onAddTag: () =>
    dispatch({ type: ADD_TAG }),
  onLoad: payload =>
    dispatch({ type: EDITOR_PAGE_LOADED, payload }),
  onRemoveTag: tag =>
    dispatch({ type: REMOVE_TAG, tag }),
  onSubmit: payload =>
    dispatch({ type: CAMPAIGN_SUBMITTED, payload }),
  onUnload: payload =>
    dispatch({ type: EDITOR_PAGE_UNLOADED }),
  onUpdateField: (key, value) =>
    dispatch({ type: UPDATE_FIELD_EDITOR, key, value })
});

class Editor extends React.Component {
  constructor() {
    super();

    const updateFieldEvent =
      key => ev => this.props.onUpdateField(key, ev.target.value);
    this.changeTitle = updateFieldEvent('title');
    this.changePaypalAddress = updateFieldEvent('paypalAddress');
    this.changeDonationsNumber = updateFieldEvent('donationsNumber');
    this.changeCampaignDonationsTarget = updateFieldEvent('campaignDonationsTarget');
    this.changeTotalDonations = updateFieldEvent('totalDonations');
    this.changeCampaignExpiryDate = updateFieldEvent('campaignExpiryDate');
    this.changeDescription = updateFieldEvent('description');
    this.changeBody = updateFieldEvent('body');
    this.changeYoutubeLink = updateFieldEvent('youtubeLink');
    this.changeImage = updateFieldEvent('image');
    this.changeTagInput = updateFieldEvent('tagInput');
    this.watchForEnter = ev => {
      if (ev.keyCode === 13) {
        ev.preventDefault();
        this.props.onAddTag();
      }
    };

    this.removeTagHandler = tag => () => {
      this.props.onRemoveTag(tag);
    };

    this.submitForm = ev => {
      ev.preventDefault();

      // Convert link into embeded one
      if (this.props.youtubeLink) {
        var youtubeLink = this.props.youtubeLink;
        if (youtubeLink.includes("watch?v=")){
          youtubeLink = youtubeLink.replace("watch?v=", "embed/");
        }
      }
      else {
        var youtubeLink = '';
      }
      // Set Total Donations 
      if (this.props.totalDonations) {
        var totalDonations = this.props.totalDonations;
      }
      else {
        var totalDonations = 0;
      }
      // Set Donation Number
      if (this.props.donationsNumber) {
        var donationsNumber = this.props.donationsNumber;
      }
      else {
        var donationsNumber = 0;
      }

      // Set Expiry Date 
      if (this.props.campaignExpiryDate) {
        var campaignExpiryDate = this.props.campaignExpiryDate;
      }
      else {
        var campaignExpiryDate = 0;
      }

      // Convert image links to embeded one
      if (this.props.image) {
        var image = this.props.image;
        // change google drive link to embeded one
        if (image && image.includes("open?id=")) {
          console.warn(image)
          image = image.replace("open?id=", "uc?export=view&id=");
        }
        // change dropbox link to embeded one 
        if (image && image.includes("dl=0")) {
          image = image.replace("dl=0", "raw=1");
        }
      }
      else {
        var image = '';
      }
      
      const campaign = {
        title: this.props.title,
        paypalAddress: this.props.paypalAddress,
        totalDonations: totalDonations,
        donationsNumber: donationsNumber,
        campaignDonationsTarget: this.props.campaignDonationsTarget,
        campaignExpiryDate: campaignExpiryDate,
        description: this.props.description,
        body: this.props.body,
        youtubeLink: youtubeLink,
        image: image,
        tagList: this.props.tagList
      };

      const slug = { slug: this.props.campaignSlug };
      const promise = this.props.campaignSlug ?
        agent.Campaigns.update(Object.assign(campaign, slug)) :
        agent.Campaigns.create(campaign);

      this.props.onSubmit(promise);
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.slug !== nextProps.match.params.slug) {
      if (nextProps.match.params.slug) {
        this.props.onUnload();
        return this.props.onLoad(agent.Campaigns.get(this.props.match.params.slug));
      }
      this.props.onLoad(null);
    }
  }

  componentWillMount() {
    if (this.props.match.params.slug) {
      return this.props.onLoad(agent.Campaigns.get(this.props.match.params.slug));
    }
    this.props.onLoad(null);
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    return (
      <div className="editor-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-10 offset-md-1 col-xs-12">

              <ListErrors errors={this.props.errors}></ListErrors>

              <form>
                <fieldset>

                  <h3 className="text-center campaignSettingsTitle">Campaign details</h3>

                  <fieldset className="form-group">
                    <label className="text-center inputLabelCampaign">Campaign Title</label>
                    <input
                      className="form-control"
                      type="text"
                      value={this.props.title}
                      onChange={this.changeTitle} />
                  </fieldset>

                  <fieldset className="form-group">
                    <label className="text-center inputLabelCampaign">Campaign Markdown Text</label>
                    <textarea
                      className="form-control"
                      rows="8"
                      value={this.props.body}
                      onChange={this.changeBody}>
                    </textarea>
                  </fieldset>

                  <fieldset className="form-group">
                    <label className="text-center inputLabelCampaign">Campaign Description</label>
                    <input
                      className="form-control"
                      type="text"
                      value={this.props.description}
                      onChange={this.changeDescription} />
                  </fieldset>

                  <fieldset className="form-group">
                    <label className="text-center inputLabelCampaign">Campaign Image</label>
                    <input
                      className="form-control"
                      type="text"
                      value={this.props.image} 
                      onChange={this.changeImage} />
                  </fieldset>

                  <fieldset className="form-group">
                    <label className="text-center inputLabelCampaign">Youtube Link</label>
                    <input
                      className="form-control"
                      type="text"
                      value={this.props.youtubeLink} 
                      onChange={this.changeYoutubeLink} />
                  </fieldset>

                  <h3 className="text-center campaignSettingsTitle">Payment details</h3>
                  
                  <fieldset className="form-group">
                    <label className="text-center inputLabelCampaign">Number Of Days until Campaign Expire</label>
                    <input
                      className="form-control"
                      type="number"
                      value={this.props.campaignExpiryDate}
                      onChange={this.changeCampaignExpiryDate} />
                  </fieldset>



                  <fieldset className="form-group">
                    <label className="text-center inputLabelCampaign">Number Of Donations Raised So Far</label>
                    <input
                      className="form-control"
                      type="number"
                      value={this.props.donationsNumber}
                      onChange={this.changeDonationsNumber} />
                  </fieldset>



                  <fieldset className="form-group">
                    <label className="text-center inputLabelCampaign">Money Raised Until Now (in euro)</label>
                    <input
                      className="form-control"
                      type="number"
                      value={this.props.totalDonations}
                      onChange={this.changeTotalDonations} />
                  </fieldset>


                  <fieldset className="form-group">
                    <label className="text-center inputLabelCampaign">Money Donation Goal (in euro)</label>
                    <input
                      className="form-control"
                      type="number"
                      value={this.props.campaignDonationsTarget}
                      onChange={this.changeCampaignDonationsTarget} />
                  </fieldset>

                  <fieldset className="form-group">
                    <label className="text-center inputLabelCampaign">Paypal Email Address</label>
                    <input
                      className="form-control"
                      type="email"
                      value={this.props.paypalAddress} 
                      onChange={this.changePaypalAddress} />
                  </fieldset>

                  <button
                    className="btn btn-lg pull-xs-right btn-primary"
                    type="button"
                    disabled={this.props.inProgress}
                    onClick={this.submitForm}>
                    Publish Campaign
                  </button>

                </fieldset>
              </form>

            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
