import { Meteor } from 'meteor/meteor';
import { CouchDB } from 'meteor/justinr1234:couchdb';
// import { Ground } from 'meteor/ground:db';
// import SimpleSchema from 'simpl-schema';

// const collection = new Mongo.Collection('test');
// const collection = Meteor.isClient || Meteor.isCordova
//   ? new Ground.Collection('test')
//   : new Mongo.Collection('test');
const collection = new CouchDB.Database('post');

// export const schema = new SimpleSchema({
//   test: Date,
//   updatedAt: {
//     type: Date,
//     optional: true,
//   },
//   createdAt: {
//     type: Date,
//     optional: true,
//   },
// });

Meteor.methods({
  addPost: doc => collection.insert({ ...doc, created_at: new Date().toISOString() }),
  updatePost: obj => collection.update({ ...obj, updated_at: new Date().toISOString() }),
  removePost: id => collection.remove(id),
});

export default collection;
