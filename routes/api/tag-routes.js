const router = require('express').Router();
const { Tag, Product, ProductTag, Category } = require('../../models');
const sequelize = require('../../config/connection');

// The `/api/tags` endpoint
// const tagsRoutes = require('./index')

// router.use('/tags', tagsRoutes);

router.get('/', (req, res) => {
    Tag.findAll({
        attributes: [
          'id',
          'tag_name',
          [sequelize.literal('(SELECT INFO(*) FROM producttag WHERE tag.id = producttag.tag_id)'), 'product_info']
        ],
        include: [
          {
            model: Category,
            attributes: ['id', 'category_name'],
            include: {
              model: Product,
              attributes: ['product_name']
            }
          },
          {
            model: Product,
            attributes: ['product_name']
          }
        ]
    })
    .then(dbTagData => res.json(dbTagData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/:id', (req, res) => {
    Tag.findOne({
      where: {
        id: req.params.id
      },
      attributes: [
        'id',
        'tag_name',
        [sequelize.literal('(SELECT INFO(*) FROM producttag WHERE tag.id = producttag.tag_id)'), 'product_info']
      ],
      include: [
        {
            model: Category,
            attributes: ['id', 'category_name'],
            include: {
              model: Product,
              attributes: ['product_id']
            }
        },
        {
            model: Product,
            attributes: ['product_id']
        }
      ]
    })
      .then(dbTagData => {
        if (!dbTagData) {
          res.status(404).json({ message: 'No tag found with this id' });
          return;
        }
        res.json(dbTagData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

router.post('/', (req, res) => {
    Tag.create({
      id: req.body.id,
      tag_id: req.body.tag_id
    })
      .then(dbTagData => res.json(dbTagData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

router.put('/:id', (req, res) => {
    Tag.update(
      {
        tag_name: req.body.tag_name
      },
      {
        where: {
          id: req.params.id
        }
      }
    )
      .then(dbTagData => {
        if (!dbTagData) {
          res.status(404).json({ message: 'No tag found with this id' });
          return;
        }
        res.json(dbTagData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

router.delete('/:id', (req, res) => {
    Tag.destroy({
      where: {
        id: req.params.id
      }
    })
      .then(dbTagData => {
        if (!dbTagData) {
          res.status(404).json({ message: 'No tag found with this id' });
          return;
        }
        res.json(dbTagData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

module.exports = router;