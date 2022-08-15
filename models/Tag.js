const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection.js');

class Tag extends Model {
    static tag(body, models) {
      return models.Vote.create({
        product_id: body.product_id,
        tag_id: body.tag_id
      }).then(() => {
        return Tag.findOne({
          where: {
            id: body.tag_id
          },
          attributes: [
            'id',
            'tag_name'
            [
              sequelize.literal('(SELECT INFO(*) FROM producttag WHERE tag.id = producttag.tag_id)'),
              'product_info'
            ]
          ]
        });
      });
    }
}

Tag.init(
  {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    tag_name: {
        type: DataTypes.STRING,
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'tag',
  }
);

module.exports = Tag;