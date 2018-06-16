const express = require('express');
const menusRouter = express.Router();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');
const menuItemsRouter = require('./menu-items');


// :employeeId Param Router
menusRouter.param('menuId', (req, res, next, menuId) => {
  const sql = 'SELECT * FROM Menu WHERE id = $id';
  const values = {
    $id: menuId
  };
  db.get(sql, values, (error, row) => {
    if(error) {
      next(error);
    } else if(row) {
      req.menu = row;
      next();
    } else {
      res.sendStatus(404);
    }
  });
});


menusRouter.use('/:menuId/menu-items', menuItemsRouter);




menusRouter.get('/', (req, res, next) => {
  const sql = 'SELECT * FROM Menu';
  db.all(sql, (error, rows) => {
    if(error) {
      next(error);
    } else {
      res.status(200).send({menus: rows});
    }
  });
});



menusRouter.get('/:menuId', (req, res, next) => {
  res.status(200).send({menu: req.menu});
});


menusRouter.post('/', (req, res, next) => {
  const title = req.body.menu.title;

  if(!title) {
    return res.sendStatus(400);
  }

  const sql = 'INSERT INTO Menu(title) VALUES($title)';
  const values = {
    $title: title
  };
  db.run(sql, values, function(error){
    if(error) {
      next(error);
    } else {
      db.get(`SELECT * FROM Menu WHERE id = ${this.lastID}`, (error, row) => {
        if(error){
          next(error);
        } else {
          res.status(201).send({menu: row});
        }
      });
    }
  });
});




menusRouter.put('/:menuId', (req, res, next) => {
  	var menuId = req.params.menuId;
  	var title = req.body.menu.title;

  const sql = "UPDATE menu SET title = $title WHERE menu.id = $menuId";
  const values = {	$title: title,
  					$menuId: menuId
  };

  				  if (!title) {
    return res.sendStatus(400);
  }

  db.run(sql, values, function(error) {
    if (error) {
      next(error);
    } else {
      db.get(`SELECT * FROM menu WHERE menu.id = ${req.params.menuId}`,
        (error, rows) => {
          res.status(200).json({menu: rows});
        });
    }
  });
 })

menusRouter.delete('/:menuId', (req, res, next) => {
	const menuId = req.params.menuId
  const sql = "SELECT * FROM menuItem WHERE menu_id = $menuId";
  const values = {$menuId: menuId};

db.get(sql, values, (error, row) => {
    if(error) {
      next(error);
    } else if(row) {
      res.sendStatus(400);
    } else {
      db.run(`DELETE FROM menu WHERE id = ${menuId}`, error => {
        res.sendStatus(204);
      });
    }
  });
});






module.exports = menusRouter;