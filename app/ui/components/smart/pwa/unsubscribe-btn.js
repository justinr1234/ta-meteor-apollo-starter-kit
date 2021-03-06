import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { injectIntl } from 'react-intl';
import { compose } from 'recompose';
import { GET_USER } from '/app/ui/components/smart/route-wrappers/global-data-provider';
import Button from '/app/ui/components/dumb/button';

const DELETE_SUBSCRIPTION = gql`
  mutation deleteSubscription($endpoint: String!) {
    deleteSubscription(endpoint: $endpoint) {
      _id
    }
  }
`;

// Source: https://github.com/GoogleChrome/samples/blob/gh-pages/push-messaging-and-notifications/main.js
class UnsubscribeBtn extends React.PureComponent {
  handleClick = async () => {
    const {
      intl: { formatMessage: t },
      deleteSubscription,
      onBeforeHook,
      onClientErrorHook,
      onServerErrorHook,
      onSuccessHook,
    } = this.props;

    // Run before logic if provided and return on error
    try {
      onBeforeHook();
    } catch (exc) {
      return; // return silently
    }

    let subscription = null;

    try {
      // We need the service worker registration to check for a subscription
      const registration = await navigator.serviceWorker.ready;

      // To unsubscribe from push messaging, you need to get the subcription
      // object, which you can call unsubscribe() on
      subscription = await registration.pushManager.getSubscription();

      // Check we have a subscription to unsubscribe
      if (!subscription) {
        // No subscription object, so set the state to allow the user to
        // subscribe to push
        onSuccessHook();
      }

      // We have a subcription, so call unsubscribe on it
      await subscription.unsubscribe();
    } catch (exc) {
      // We failed to unsubscribe, this can lead to an unusual state, so may be
      // best to remove the subscription from your data store and inform the
      // user that you disabled push
      onClientErrorHook(`${t({ id: 'pushUnsubscribeError' })}${exc}`);
    }

    try {
      // Get subscription enpoint to be able to find the subscription server side
      const { endpoint } = subscription;

      // Delete subscription from user's record
      await deleteSubscription({
        variables: { endpoint },
        refetchQueries: [{ query: GET_USER }],
      });

      // QUESTION: shouldn't we make a request to your server to remove all user
      // subscriptions from our data store so we don't attempt to send them push
      // messages anymore?

      onSuccessHook();
    } catch (exc) {
      onServerErrorHook(exc);
    }
  }

  render() {
    const { intl: { formatMessage: t }, btnLabel, disabled } = this.props;

    return (
      <Button
        disabled={disabled}
        onClick={this.handleClick}
      >
        {btnLabel || t({ id: 'pushDisableButton' })}
      </Button>
    );
  }
}

UnsubscribeBtn.propTypes = {
  btnLabel: PropTypes.string, // eslint-disable-line react/require-default-props
  disabled: PropTypes.bool,
  deleteSubscription: PropTypes.func.isRequired,
  onBeforeHook: PropTypes.func,
  onServerErrorHook: PropTypes.func,
  onSuccessHook: PropTypes.func,
};

UnsubscribeBtn.defaultProps = {
  disabled: false,
  onBeforeHook: () => {},
  onServerErrorHook: () => {},
  onSuccessHook: () => {},
};

export default compose(
  injectIntl,
  graphql(DELETE_SUBSCRIPTION, { name: 'deleteSubscription' }),
)(UnsubscribeBtn);
