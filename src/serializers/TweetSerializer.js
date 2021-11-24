const BaseSerializer = require('./BaseSerializer');

class TweetSerializer extends BaseSerializer {
  constructor(model) {
    const serializedModel = model ? model.toJSON() : null;

    delete serializedModel?.password;
    delete serializedModel?.active;
    delete serializedModel?.role;

    delete serializedModel?.userId;
    super('success', serializedModel);
  }
}

module.exports = TweetSerializer;
