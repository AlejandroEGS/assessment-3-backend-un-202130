const BaseSerializer = require('./BaseSerializer');

class CommentsSerializer extends BaseSerializer {
  constructor(models, paginationInfo) {
    const serializedModels = models.map((model) => {
      const serializedModel = model.toJSON();
      return serializedModel;
    });
    super('success', serializedModels, paginationInfo);
  }
}
module.exports = CommentsSerializer;
