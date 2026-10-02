const sqlite3 = require('sqlite3').verbose()
const DBSOURCE = "usersdb.sqlite";
const bcrypt = require('bcryptjs');

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    } 
    else {        
        var salt = bcrypt.genSaltSync(10);
        
        db.run(`CREATE TABLE users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name text,
                phone text,             
                token text,
                loggedin_at TIMESTAMP,
                created_at TIMESTAMP,
                permission text DEFAULT 'NoAccess'
            )`,
        (err) => {
            if (err) {
                // Table already created
            } else{
                // Table just created, creating some rows
                var insert = 'INSERT INTO Users (name, phone, permission, created_at) VALUES (?,?,?,?)'
                // The seed user is the first admin so permissions can be managed after install.
                db.run(insert, ["hesam", "09381329963", "FullAcc", Date.now()])
            }
        });

        db.all(`PRAGMA table_info(users)`, (err, columns) => {
            if (err) return;
            // Existing databases may not have the permission column yet.
            const colNames = columns.map(c => c.name);
            if (!colNames.includes('permission')) {
                db.run(`ALTER TABLE users ADD COLUMN permission text DEFAULT 'NoAccess'`, () => {
                    // Users created before permissions existed had full access; keep them usable.
                    db.run(`UPDATE users SET permission = 'FullAcc' WHERE permission IS NULL OR permission = ''`, () => {});
                });
            }
        });

        db.run(`CREATE TABLE phone_verification  (
                id text UNIQUE,
                phone text,             
                code text UNIQUE,
                created_at TIMESTAMP
            )`, (err) => {
                if (err) {
                    // Table already created
                } else{
                    // Table just created, creating some rows
                }
            })

        db.run(`CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                productNumber text,
                title text,
                desc text,
                category text,
                price text,
                created_by INTEGER,
                created_at TIMESTAMP
             )`, (err) => {
                if (err) {
                    // Table already created
                } else{
                    // Table just created, creating some rows
                }
            })

        db.all(`PRAGMA table_info(products)`, (err, columns) => {
            if (err) return;
            const colNames = columns.map(c => c.name);
            const alterations = [];
            if (!colNames.includes('desc')) alterations.push('ALTER TABLE products ADD COLUMN desc text');
            if (!colNames.includes('category')) alterations.push('ALTER TABLE products ADD COLUMN category text');
            if (!colNames.includes('price')) alterations.push('ALTER TABLE products ADD COLUMN price text');
            // created_by links products to the user who added them.
            if (!colNames.includes('created_by')) alterations.push('ALTER TABLE products ADD COLUMN created_by INTEGER');
            alterations.forEach(sql => db.run(sql, () => {}));
        })
    }
});


module.exports = db
