const db = require("../createDatabase");

class User {

    create(data) {
        return new Promise((reslove , reject) => {
            let sql ='INSERT INTO users (name, phone, permission, created_at) VALUES (?,?,?,?)'
    
            db.run(sql, [ data.name, data.phone, data.permission ?? 'NoAccess', Date.now() ], function (err, innerResult) {
                if (err) return reject(err);
        
                reslove();
            });   

        })
    }

    findBy(field , email) {
        return new Promise((resolve , reject) => {

            db.get(`SELECT * FROM users WHERE ${field} = ?`, email , function(err , user) {
                if(err) return reject(err);
    
                resolve(user);
            });
    
        });
    }

    all() {
        return new Promise((resolve , reject) => {

            // Only safe columns: never expose token.
            db.all(`SELECT id, name, phone, permission, created_at FROM users ORDER BY created_at DESC`, function(err , rows) {
                if(err) return reject(err);
    
                resolve(rows);
            });
    
        });
    }

    update(id , data) {
        let fieldMustUpdate = Object.keys(data).map(item => `${item}=$${item}` ).join(',');
        let fieldData = {};
        Object.keys(data).forEach(item => fieldData[`$${item}`] = data[item] )

        return new Promise((resolve , reject) => {

            db.run(`UPDATE users SET ${fieldMustUpdate} WHERE id = $id` , { $id : id  , ...fieldData} , function(err) {
                if(err) return reject(err)

                resolve()
            })
        });
    }
}

module.exports = new User();