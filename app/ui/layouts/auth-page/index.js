import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import Title from '/app/ui/components/dumb/title';
import Subtitle from '/app/ui/components/dumb/subtitle';
import Post from '../../../entry-points/db';

function addNewPost() {
  const now = new Date();
  const ns = now.toString();
  const data = {
    title: `Title: ${ns}`,
    content: `Content: ${ns}`,
  };
  Meteor.call('addPost', data, (error, result) => {
    if (error) {
      console.error(error);
      return;
    }

    console.log(result);
  });
}

const AuthPageLayout = ({ children, title, subtitle, link, posts }) => (
  <div>
    {title && <Title>{title}</Title>}
    {subtitle && <Subtitle text={subtitle} link={link} />}
    {children}
    <button
      type="button"
      onClick={() => addNewPost()}
    >
      Insert
    </button>
    <div>
      {posts.map(p => (
        <div key={p._id}>
          {`${JSON.stringify(p)} - `}
          <button
            type="button"
            onClick={() => Meteor.call('updatePost', { ...p, title: Math.floor(Math.random() * 1000).toString() })}
          >
            Update
          </button>
          <button
            type="button"
            onClick={() => Meteor.call('removePost', p._id)}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  </div>
);

AuthPageLayout.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  link: PropTypes.object, // eslint-disable-line
};

AuthPageLayout.defaultProps = {
  title: '',
  subtitle: '',
  link: null,
};

export default withTracker(() => {
  if (Meteor.isClient) {
    Meteor.subscribe('posts');
  }
  return { posts: Post.find({}).fetch() };
})(AuthPageLayout);
