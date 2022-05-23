/**
 * Class for slack constants.
 *
 * @class SlackConstants
 */
class SlackConstants {
  get slackApiVersionNumber() {
    return 'v0';
  }

  get eventExpiryTimestamp() {
    return 5 * 60;
  }

  // Payload types start.
  get viewSubmissionPayloadType() {
    return 'view_submission';
  }

  get blockActionsPayloadType() {
    return 'block_actions';
  }
  // Payload types end.

  // Response types start.
  get ephemeralResponseType() {
    return 'ephemeral';
  }

  get inChannelResponseType() {
    return 'in_channel';
  }
  // Response types end.
}

module.exports = new SlackConstants();
