const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.sqlite');

db.serialize(function() {
  db.run('CREATE TABLE IF NOT EXISTS `employee` ( ' +
           '`id` INTEGER NOT NULL, ' +
           '`name` TEXT NOT NULL, ' +
           '`position` TEXT NOT NULL, ' +
           '`wage` TEXT NOT NULL, ' +
           '`is_current_employee` INTEGER NOT NULL DEFAULT 1, ' +
           'PRIMARY KEY(`id`) )');

  db.run('CREATE TABLE IF NOT EXISTS `timesheet` ( ' +
           '`id` INTEGER NOT NULL, ' +
           '`hours` TEXT NOT NULL, ' +
           '`rate` INTEGER NOT NULL, ' +
           '`date` INTEGER NOT NULL, ' +
           '`employee_id` INTEGER NOT NULL, ' +
           'PRIMARY KEY(`id`), ' +
           'FOREIGN KEY(`employee_id`) REFERENCES `employee`(`id`) )');

    db.run('CREATE TABLE IF NOT EXISTS `menu` ( ' +
           '`id` INTEGER NOT NULL, ' +
           '`title` TEXT NOT NULL, ' +
           'PRIMARY KEY(`id`) )');

  db.run('CREATE TABLE IF NOT EXISTS `menuItem` ( ' +
           '`id` INTEGER NOT NULL, ' +
           '`name` TEXT NOT NULL, ' +
           '`description` TEXT, ' +
           '`inventory` INETEGER NOT NULL, ' +
           '`price` INTEGER NOT NULL, ' +
           '`menu_id` INTEGER NOT NULL, ' +
           'PRIMARY KEY(`id`), ' +
           'FOREIGN KEY(`menu_id`) REFERENCES `menu`(`id`) )');
});