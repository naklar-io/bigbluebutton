import React, { PureComponent } from 'react';
import cx from 'classnames';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import { styles } from './styles.scss';
import DesktopShare from './desktop-share/component';
import ActionsDropdown from './actions-dropdown/component';
import QuickPollDropdown from './quick-poll-dropdown/component';
import AudioControlsContainer from '../audio/audio-controls/container';
import JoinVideoOptionsContainer from '../video-provider/video-button/container';
import CaptionsButtonContainer from '/imports/ui/components/actions-bar/captions/container';
import PresentationOptionsContainer from './presentation-options/component';
import PresentationUploaderContainer from '../presentation/presentation-uploader/container';
import { withModalMounter } from '/imports/ui/components/modal/service';
import Button from '../button/component';

const CHAT_CONFIG = Meteor.settings.public.chat;
const CHAT_ENABLED = CHAT_CONFIG.enabled;
const PUBLIC_CHAT_ID = CHAT_CONFIG.public_id;


const intlMessages = defineMessages({
  presentationLabel: {
    id: 'app.actionsBar.actionsDropdown.presentationLabel',
    description: 'Upload a presentation option label',
  },
  presentationDesc: {
    id: 'app.actionsBar.actionsDropdown.presentationDesc',
    description: 'adds context to upload presentation option',
  },
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class ActionsBar extends PureComponent {
  async handlePresentationClick() {
    const {
      amIPresenter,
      amIModerator,
      handleTakePresenter,
    } = this.props;
    if (!amIPresenter && amIModerator) {
      handleTakePresenter();
    }
    await sleep(500);
    const { mountModal } = this.props;
    mountModal(<PresentationUploaderContainer />);
  }

  handleChatOpen() {
    if (Session.equals('openPanel', 'chat')) {
      Session.set('openPanel', '');
    } else {
      Session.set('idChatOpen', PUBLIC_CHAT_ID);
      Session.set('openPanel', 'chat');
    }
  }


  render() {
    const {
      amIPresenter,
      handleShareScreen,
      handleUnshareScreen,
      isVideoBroadcasting,
      amIModerator,
      screenSharingCheck,
      enableVideo,
      isLayoutSwapped,
      toggleSwapLayout,
      handleTakePresenter,
      intl,
      currentSlidHasContent,
      parseCurrentSlideContent,
      isSharingVideo,
      screenShareEndAlert,
      stopExternalVideoShare,
      screenshareDataSavingSetting,
      isCaptionsAvailable,
      isMeteorConnected,
      isPollingEnabled,
      isThereCurrentPresentation,
      allowExternalVideo,
    } = this.props;
    this.handlePresentationClick = this.handlePresentationClick.bind(this);
    this.handleChatOpen = this.handleChatOpen.bind(this);

    const actionBarClasses = {};

    actionBarClasses[styles.centerWithActions] = amIPresenter;
    actionBarClasses[styles.center] = true;
    actionBarClasses[styles.mobileLayoutSwapped] = isLayoutSwapped && amIPresenter;

    return (
      <div className={styles.actionsbar}>
        <div className={styles.left}>

          {/*  <ActionsDropdown {...{
            amIPresenter,
            amIModerator,
            isPollingEnabled,
            allowExternalVideo,
            handleTakePresenter,
            intl,
            isSharingVideo,
            stopExternalVideoShare,
            isMeteorConnected,
          }}
          />
          {isPollingEnabled
            ? (
              <QuickPollDropdown
                {...{
                  currentSlidHasContent,
                  intl,
                  amIPresenter,
                  parseCurrentSlideContent,
                }}
              />
            ) : null
          }
          {isCaptionsAvailable
            ? (
              <CaptionsButtonContainer {...{ intl }} />
            )
            : null
          } */}

          { /* naklar.io - allow presentation upload directly */}
          {/* label={intl.formatMessage(intlMessages.presentationLabel)}
        description={intl.formatMessage(intlMessages.presentationDesc)} */}

        </div>
        <div className={cx(actionBarClasses)}>
          <Button
            label="Bild hochladen"
            color="primary"
            description="Bild hochladen"
            className={cx(styles.button)}
            size="lg"
            circle
            icon="upload"
            hideLabel
            onClick={this.handlePresentationClick}
          />
          <Button
            icon="chat"
            className={cx(styles.button, Session.equals('openPanel', 'chat') || styles.btn)}
            size="lg"
            color="default"
            ghost
            label="Chat öffnen"
            description="Chat öffnen"
            hideLabel
            circle
            onClick={this.handleChatOpen}
          />
          <AudioControlsContainer />
          {enableVideo
            ? (
              <JoinVideoOptionsContainer />
            )
            : null}
          <DesktopShare {...{
            handleShareScreen,
            handleUnshareScreen,
            isVideoBroadcasting,
            amIPresenter,
            screenSharingCheck,
            screenShareEndAlert,
            isMeteorConnected,
            screenshareDataSavingSetting,
          }}
          />
        </div>
        <div className={styles.right}>
          {isLayoutSwapped
            ? (
              <PresentationOptionsContainer
                toggleSwapLayout={toggleSwapLayout}
                isThereCurrentPresentation={isThereCurrentPresentation}
              />
            )
            : null
          }
        </div>
      </div>
    );
  }
}

export default withModalMounter(ActionsBar);
