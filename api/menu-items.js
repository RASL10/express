const express = require('express');
const menuItemsRouter = express.Router({mergeParams: true});
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');
const menusRouter = require('./menus');

menuItemsRouter.param('menuItemId', (req, res, next, menuItemId) => {
  db.get(`SELECT * FROM MenuItem WHERE id = ${menuItemId}`, (error, row) => {
    if(error) {
      next(error);
    } else if(row){
      next();
    } else {
      res.sendStatus(404);
    }
  });
});
// :timesheetId Param Router


menuItemsRouter.get('/', (req, res, next) => {
  db.all("SELECT * FROM menuItem WHERE menu_id = $menu_id" , { $menu_id: req.params.menuId}, function(err, rows){
    if (err) {
      return res.sendStatus(500);
    } else {
      res.status(200).send({menuItems:rows});
    }
  })
});

menuItemsRouter.post('/', (req, res, next) => {
  const name = req.body.menuItem.name,
        description = req.body.menuItem.description,
        inventory = req.body.menuItem.inventory,
        price = req.body.menuItem.price,
        menuId = req.params.menuId;

  if(!name || !inventory || !price) {
    return res.sendStatus(400);
  }

  const sql = 'INSERT INTO menuItem (name, description, inventory, price, menu_id) VALUES ($name, $description, $inventory, $price, $menuId)';
  const values = {
    $name: name,
    $description: description,
    $inventory: inventory,
    $price: price,
    $menuId: menuId
  };

  db.run(sql, values, function(error){
    if(error) {
      next(error);
    } else {
      db.get(`SELECT * FROM menuItem WHERE id = ${this.lastID}`, (error, row) => {
        res.status(201).send({menuItem: row});
      });
    }
  });
});

menuItemsRouter.put('/:menuItemId', (req, res, next) => {
  const name = req.body.menuItem.name,
        description = req.body.menuItem.description,
        inventory = req.body.menuItem.inventory,
        price = req.body.menuItem.price,
        menuItemId = req.params.menuItemId;


  if(!name || !inventory || !price) {
    return res.sendStatus(400);
  }

  const sql = 'UPDATE menuItem SET name = $name, description = $description, inventory = $inventory, price = $price WHERE id = $menuItemId';
  const values = {
    $name: name,
    $description: description,
    $inventory: inventory,
    $price: price,
    $menuItemId: menuItemId
  };
  db.run(sql, values, error => {
    if(error) {
      next(error);
    } else {
      db.get(`SELECT * FROM menuItem WHERE id = ${menuItemId}`, (error, row) => {
        res.status(200).send({menuItem: row});
      });
    }
  });
});

menuItemsRouter.delete('/:menuItemId', (req, res, next) => {
  const menuItemId = req.params.menuItemId;
  db.run(`DELETE FROM menuItem WHERE id = ${menuItemId}`, error => {
    if(error) {
      next(error);
    } else {
      res.sendStatus(204);
    }
  });
});





module.exports = menuItemsRouter;