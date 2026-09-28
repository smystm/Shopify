const db = require("../createDatabase");

class Product {

    create(data) {
        return new Promise((resolve, reject) => {
            let sql = 'INSERT INTO products (productNumber, title, created_at) VALUES (?,?,?)'

            db.run(sql, [data.productNumber, data.title, Date.now()], function (err) {
                if (err) return reject(err);

                resolve({ id: this.lastID });
            });
        })
    }

    findBy(field, value) {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM products WHERE ${field} = ?`, value, function (err, product) {
                if (err) return reject(err);

                resolve(product);
            });
        });
    }

    all() {
        return new Promise((resolve, reject) => {
            db.all(`SELECT id, productNumber, title, created_at FROM products ORDER BY created_at DESC`, function (err, rows) {
                if (err) return reject(err);

                resolve(rows);
            });
        });
    }

    update(id, data) {
        let fieldMustUpdate = Object.keys(data).map(item => `${item}=$${item}`).join(',');
        let fieldData = {};
        Object.keys(data).forEach(item => fieldData[`$${item}`] = data[item])

        return new Promise((resolve, reject) => {
            db.run(`UPDATE products SET ${fieldMustUpdate} WHERE id = $id`, { $id: id, ...fieldData }, function (err) {
                if (err) return reject(err)

                resolve()
            })
        });
    }

    delete(id) {
        return new Promise((resolve, reject) => {
            db.run(`DELETE FROM products WHERE id = ?`, [id], function (err) {
                if (err) return reject(err);

                resolve();
            });
        });
    }
}

module.exports = new Product();
