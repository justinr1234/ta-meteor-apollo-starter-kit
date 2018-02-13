import React from 'react';
import AuthPageProps from '../../render-props/auth-page-props';
import AuthPageLayout from '../../layouts/auth-page';

//------------------------------------------------------------------------------
// CONSTANTS:
//------------------------------------------------------------------------------
const PAGE = {
  name: 'forgotPassword',
  title: 'Forgot your Password?',
  subtitle: `
    We&apos;ll send a link to your email to reset<br />
    your password and get you back on track.
  `,
  // linkTo: '',
  // linkLabel: '',
  btnLabel: 'Send Link',
};
//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
const ForgotPasswordPage = () => (
  <AuthPageProps>
    {authPageProps => (
      <AuthPageLayout
        page={PAGE}
        // Pass all state values and methods from authPageProps
        {...authPageProps}
        // Overwrite authPageProps.handleSuccess
        handleSuccess={() => {
          // Extend btnProps.handleSuccess' default functionality by showing a
          // success message after action is completed
          authPageProps.handleSuccess(() => {
            authPageProps.setSuccessMessage('A new email has been sent to your inbox!');
          });
        }}
      />
    )}
  </AuthPageProps>
);

export default ForgotPasswordPage;