const express = require('express');
const timesheetsRouter = express.Router({mergeParams: true});
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');


// :timesheetId Param Router
timesheetsRouter.param('timesheetId', (req, res, next, timesheetId) => {
  db.get(`SELECT * FROM Timesheet WHERE id = ${timesheetId}`, (error, row) => {
    if(error) {
      next(error);
    } else if(row){
      next();
    } else {
      res.sendStatus(404);
    }
  });
});

// Validate Timesheet Fields Middleware


// GET /api/employees/:employeeId/timesheets
timesheetsRouter.get('/', (req, res, next) => {

  db.all("SELECT * FROM Timesheet WHERE employee_id = $employeeId" , { $employeeId: req.params.employeeId}, function(err, rows){
    if (err) {
      return res.sendStatus(500);
    } else {
      res.status(200).send({timesheets: rows});
    }
  })
});



timesheetsRouter.post('/', (req, res, next) => {
  const hours = req.body.timesheet.hours,
        rate = req.body.timesheet.rate,
        date = req.body.timesheet.date,
        employeeId = req.params.employeeId;


  				  if (!hours || !rate || !date || !employeeId) {
    return res.sendStatus(400);
  }

  const sql = 'INSERT INTO timesheet (hours, rate, date, employee_id)' +
      'VALUES ($hours, $rate, $date, $employeeId)';
  const values = {$employeeId: employeeId,
  					$hours: hours,
  					$rate: rate,
  					$date: date,
  					$employeeId: employeeId

  				}	;


  db.run(sql, values, function(error){
    if(error) {
      next(error);
    } else {
      db.get(`SELECT * FROM timesheet WHERE id = ${this.lastID}`, (error, row) => {
        res.status(201).send({timesheet: row});
      });
    }
  });
});

timesheetsRouter.put('/:timesheetId', (req, res, next) => {
  const hours = req.body.timesheet.hours,
        rate = req.body.timesheet.rate,
        date = req.body.timesheet.date,
        timesheetId = req.params.timesheetId;

  const sql = "UPDATE timesheet SET hours = $hours, rate = $rate, date = $date WHERE timesheet.id = $timesheetId";
  const values = {	$hours: hours,
  					$rate: rate,
  					$date: date,
  					
  					$timesheetId: timesheetId};

  				  if (!hours || !rate || !date) {
    return res.sendStatus(400);
  }

  db.run(sql, values, function(error) {
    if (error) {
      next(error);
    } else {
      db.get(`SELECT * FROM timesheet WHERE timesheet.id = ${req.params.timesheetId}`,
        (error, timesheet) => {
        	if(error) {
        		return res.sendStatus(400);;
        	} else {
          res.status(200).json({timesheet: timesheet});
      }
        });
    }
  });
 })


timesheetsRouter.delete('/:timesheetId', (req, res, next) => {
  const sql = "DELETE FROM timesheet WHERE timesheet.id = $timesheetId";
  const values = {$timesheetId: req.params.timesheetId};

  db.run(sql, values, (error) => {
    if (error) {
      next(error);
    } else {
      db.all(`SELECT * FROM timesheet`,
        (error, rows) => {
          if(error) {
        		return res.sendStatus(400);;
        	} else {
          res.status(204).json({timesheet: rows});
      }
        });
    }
  });
});


module.exports = timesheetsRouter;

