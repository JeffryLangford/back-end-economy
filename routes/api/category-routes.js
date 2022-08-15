const router = require('express').Router();
const { Category, Product, Tag } = require('../../models');

// The `/api/categories` endpoint
// const categoryRoutes = require('./index')

// router.use('/categories', categoryRoutes);

router.get('/', (req, res) => {
    Category.findAll()
      .then(dbCategoryData => res.json(dbCategoryData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

router.get('/:id', (req, res) => {
    Category.findOne({
      where: {
        id: req.params.id
      },
      attributes: [
        'id',
        'category_id',
        [sequelize.literal('(SELECT INFO(*) FROM producttag WHERE tag.id = producttag.tag_id)'), 'product_info']
      ],
      include: [
        {
          model: Tag,
          attributes: ['tag_name']
        }
      ]
    })
      .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No category found with this id' });
          return;
        }
        res.json(dbPostData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

router.post('/', (req, res) => {
    Category.create({
      category_name: req.body.category_name,
      product_id: req.body.product_id,
      tag_id: req.body.tag_id
    })
      .then(dbCategoryData => res.json(dbCategoryData))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  });

router.put('/:id', (req, res) => {
    Category.update(
      {
        category_name: req.body.category_name
      },
      {
        where: {
          id: req.params.id
        }
      }
    )
      .then(dbCategoryData => {
        if (!dbCategoryData) {
          res.status(404).json({ message: 'No category found with this id' });
          return;
        }
        res.json(dbCategoryData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

router.delete('/:id', (req, res) => {
    Category.destroy({
      where: {
        id: req.params.id
      }
    })
      .then(dbCategoryData => {
        if (!dbCategoryData) {
          res.status(404).json({ message: 'No Category found with this id!' });
          return;
        }
        res.json(dbCategoryData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

module.exports = router;