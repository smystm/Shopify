const db = require("../createDatabase");

class Product {

    create(data) {
        return new Promise((resolve, reject) => {
            let sql = 'INSERT INTO products (productNumber, title, desc, category, price, image, created_by, created_at) VALUES (?,?,?,?,?,?,?,?)'

            const category = typeof data.category === 'object' ? JSON.stringify(data.category) : data.category;
            db.run(sql, [data.productNumber, data.title, data.desc, category, data.price, data.image ?? null, data.created_by ?? null, Date.now()], function (err) {
                if (err) return reject(err);

                resolve({ id: this.lastID });
            });
        })
    }

    findBy(field, value) {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM products WHERE ${field} = ?`, value, function (err, product) {
                if (err) return reject(err);

                if (product && product.category) {
                    try {
                        product.category = JSON.parse(product.category);
                    } catch (e) {
                    }
                }
                resolve(product);
            });
        });
    }

    all() {
        return new Promise((resolve, reject) => {
            db.all(`SELECT id, productNumber, title, desc, category, price, image, created_by, created_at FROM products ORDER BY created_at ASC`, function (err, rows) {
                if (err) return reject(err);

                const parsed = rows.map(row => ({
                    ...row,
                    category: row.category ? JSON.parse(row.category) : null,
                }));
                resolve(parsed);
            });
        });
    }

    allFiltered({ categories = [], minPrice, maxPrice } = {}) {
        return new Promise((resolve, reject) => {
            db.all(`SELECT id, productNumber, title, desc, category, price, image, created_by, created_at FROM products ORDER BY created_at ASC`, function (err, rows) {
                if (err) return reject(err);

                let parsed = rows.map(row => ({
                    ...row,
                    category: row.category ? JSON.parse(row.category) : null,
                }));

                if (Array.isArray(categories) && categories.length > 0) {
                    parsed = parsed.filter(p => p.category && categories.includes(p.category.value));
                }

                if (minPrice !== undefined && minPrice !== null && minPrice !== '') {
                    const min = Number(minPrice);
                    if (!Number.isNaN(min)) {
                        parsed = parsed.filter(p => Number(p.price) >= min);
                    }
                }

                if (maxPrice !== undefined && maxPrice !== null && maxPrice !== '') {
                    const max = Number(maxPrice);
                    if (!Number.isNaN(max)) {
                        parsed = parsed.filter(p => Number(p.price) <= max);
                    }
                }

                resolve(parsed);
            });
        });
    }

    update(id, data) {
        let fieldMustUpdate = Object.keys(data).map(item => `${item}=$${item}`).join(',');
        let fieldData = {};
        Object.keys(data).forEach(item => {
            fieldData[`$${item}`] = item === 'category' && typeof data[item] === 'object'
                ? JSON.stringify(data[item])
                : data[item];
        })

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
