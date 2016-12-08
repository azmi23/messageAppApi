/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    username: {
      type: 'string',
      unique: 'true'
    },

    email: {
      type: 'string',
      email: 'true'
    },

    password: {
      type: 'string'
    },

    encryptedPassword: {
      type: 'string'
    },

    gravatarURL :{
      type: 'string'
    },

    deleted: {
      type: 'boolean'
    },

    banned: {
      type: 'boolean'
    },

    passwrdRecoveryToken: {
      type: 'string'
    },

    friendContact: {
      collection: 'user'
    },

    chats: {
      collection: 'chat',
      via: 'sender'
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.password;
      delete obj.confirmation;
      delete obj.encryptedPassword;
      return obj;
    }


  }
};
