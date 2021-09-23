/**
 * backend rest api handle users request & response specifically for product
 * Author  tarik
 * address: Addis Ababa
 * Last Modified Date: feb 27 , 2021
 */
const mysql = require('mysql');
const express = require('express');
const router = express.Router();
const connection = require("../../config/db.config");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: './Server/UProduct/Images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }

})
const upload = multer({
        storage: storage
    })
    //add products
router.post('/add', upload.single('image'), (req, res) => {
    try {

        //get only year
        //input validation before insertion will be added soon
        const year = req.body.datepicker.slice(-4);
        connection.query("INSERT INTO products(pname,pcode,pprice,totalQ,leftQ,pmodel,make,year,pdescription,pcountry,image,user_id) VALUES('" +
            req.body.iname + "','" +
            req.body.icode + "','" +
            req.body.price + "','" +
            req.body.quantity + "','" +
            req.body.quantity + "','" +
            req.body.model + "','" +
            req.body.make + "','" +
            year + "','" +
            req.body.desc + "','" +
            req.body.country + "','" +
            req.file.filename + "','" +
            req.body.dealer + "') ", (err, rows, fields) => {
                if (!err)
                    res.send(rows)
                else
                    res.send({ error: "Error registaring products" })
            })

    } catch (error) {
        return error;

    }
});

//update product information
router.post("/productedit", upload.single('photo'), (req, res) => {
        try {
            console.log(req.body)
            var year = req.body.year.slice(-4);
            connection.query(`UPDATE products SET pname=? , pcode=? ,pprice=? ,totalQ=? , pmodel=? ,make=? ,year=? ,pdescription=? ,pcountry=? ,image=? WHERE pid=${req.body.pid}`, [req.body.pname, req.body.pcode, req.body.pprice, req.body.quantity, req.body.pmodel, req.body.pmake, year, req.body.pdesc, req.body.country, req.file.filename], (err, rows, fields) => {
                if (!err)
                    res.send({ success: "Product Updated Successfully" });
                else
                    res.send(err);
            })
        } catch (error) {

        }
    })
    // get product to update
router.get("/producttoupdate", (req, res) => {
    connection.query('SELECT * FROM products WHERE pid=?', [req.query.pid], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
})

//insert into a cart
router.post("/initCart", (req, res) => {
    try {
        //before adding to a cart check if this product alrady exists 
        //if it exist dont add another inofmation simply increment its quantity
        connection.query('SELECT * FROM cart WHERE status=0 AND cartNumber= "' + req.body.obj.cartid + '" AND itemid="' + req.body.obj.id + '"',
            (err, rows, fields) => {
                if (!err) {
                    if (rows.length) {
                        //update quantity
                        //check product quantity first
                        connection.query('SELECT * FROM products WHERE pid=?', [req.body.obj.id], (err, rows, fields) => {
                            if (!err)
                                var left = Number(rows[0].leftQ);
                            if (left != 0) {
                                //if adding to cart is successfull then --leftQ in product table
                                connection.query('UPDATE  products SET leftQ =leftQ -1 WHERE pid="' + req.body.obj.id + '"')
                                connection.query('UPDATE cart SET quantity = quantity +1 WHERE cartNumber="' + req.body.obj.cartid + '" AND itemid="' + req.body.obj.id + '" AND status=0')
                                    //total price
                                connection.query('UPDATE cart SET totalPrice = quantity * price WHERE cartNumber="' + req.body.obj.cartid + '" AND itemid="' + req.body.obj.id + '" AND status=0')
                                    // leftq must not be less than 0 
                            } else {
                                res.send({ error: "Sorry , Item Finished" })
                            }


                        })
                    } else {
                        connection.query("INSERT INTO cart(cartNumber,itemid,itemname,quantity,price,totalPrice,uid) VALUES('" +
                            req.body.obj.cartid + "','" +
                            req.body.obj.id + "','" +
                            req.body.obj.itemname + "','1','" +
                            req.body.obj.price + "','" +
                            req.body.obj.price + "','" +
                            req.body.obj.uid + "') ", (err, rows, fields) => {
                                if (!err)
                                //if adding to cart is successfull then --leftQ in product table
                                    connection.query('UPDATE products SET leftQ =leftQ-1 WHERE pid="' + req.body.obj.id + '"')
                                else
                                    res.send({ error: "Error adding to cart" })
                            })
                    }
                } else {
                    res.send("Error addint to cart")
                }
            })

    } catch (error) {
        return error;
    }
});

// update product quantity of products in the cart
router.put('/updatePQuantityInCart', (req, res) => {
    //get left quantity user might insert value greather than left qantity
    connection.query('SELECT * FROM cart INNER JOIN products ON cart.itemid=products.pid WHERE cart.id="' + req.body.obj.id + '" && cart.status=0', (err, rows, fields) => {
        if (Number(req.body.obj.val + rows[0].sold) <= rows[0].totalQ) {
            if (req.body.obj.val >= 1) {
                connection.query("UPDATE cart SET quantity = '" +
                        req.body.obj.val + "' , totalPrice= quantity * price WHERE id ='" +
                        req.body.obj.id + "' && status=0", (err, rows, fields) => {
                            if (!err)
                                res.send(rows);
                            else
                                console.log(err);
                        })
                    //update products table
                connection.query(` UPDATE products SET leftQ = totalQ - ${req.body.obj.val} - ${rows[0].sold}
                        WHERE pid = ${rows[0].itemid}
                        `)
            }
        } else {
            res.send({ error: `Sorry Dear ,You Can Only Add ${rows[0].leftQ} Items More` })
        }

    })
})

//get single dealer product
router.get("/dealersproduct", (req, res) => {
        //SELECT * FROM products INNER JOIN users ON products.user_id=users.id
        connection.query('SELECT * FROM products INNER JOIN users ON products.user_id=users.id WHERE products.user_id=?', [req.query.dealerId], (err, rows, fields) => {
            if (!err)
                res.send(rows);
            else
                console.log(err);
        })
    })
    //view cart item
router.get("/cartitem", (req, res) => {
    connection.query('SELECT * FROM cart INNER JOIN products ON cart.itemid=products.pid WHERE cart.cartNumber=? AND cart.status=0', [req.query.key], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
})

//get total price of item in the cart
router.get("/gettotal", (req, res) => {
        connection.query('SELECT SUM(totalPrice) as total FROM cart WHERE cartNumber=? AND cart.status=0', [req.query.key], (err, rows, fields) => {
            if (!err)
                res.send(rows);
            else
                console.log(err);
        })
    })
    //renove products from cart
router.delete("/removecartitem", (req, res) => {
    //user canceled order process so item in the cart must be add back to the stock
    //get item quantity to be remoeved from cart
    connection.query(`SELECT * FROM cart WHERE id = ${req.query.key} && status = 0 `, (err, rows, fields) => {
        if (!err) {
            var itemid = rows[0].itemid;
            var quantity = rows[0].quantity;
            // needs modification
            connection.query(`UPDATE products SET leftQ = leftQ + ${quantity} WHERE pid = ${itemid}
                        `)
                //then remove
            connection.query('DELETE FROM cart WHERE id = ? && status=0', [req.query.key], (err, rows, fields) => {
                if (!err)
                    res.send("item removed from cart");
                else
                    console.log(err);
            })

        } else
            console.log(err);
    })
})

//view sold items
router.get("/soldItems", (req, res) => {
    connection.query('SELECT * FROM cart WHERE uid=? && status=1 ORDER BY orderTime desc', [req.query.key], (err, rows, fields) => {
        if (!err) {
            res.send(rows)
        } else {
            console.log(err)
        }
    })

})
router.put("/cartProductStatus", (req, res) => {
    connection.query("SELECT * from cart WHERE id=?", [req.body.obj.itemid], (err, rows, fields) => {
        if (!err) {
            //check state
            if (req.body.obj.status == false) {
                //not sold
                connection.query(`UPDATE cart SET delivered ='0' WHERE id = ${req.body.obj.itemid}`)

            } else {
                //sold
                connection.query(`UPDATE cart SET delivered ='1' WHERE id = ${req.body.obj.itemid}`)

                //update soldQ in products table
                connection.query("SELECT * from cart  WHERE id=?", [req.body.obj.itemid], (err, rows, fields) => {
                    if (!err) {
                        //get pid 
                        connection.query(`UPDATE products SET sold = sold + ${req.body.obj.iquantity} WHERE pid = ${rows[0].itemid}`)


                    }
                })
            }
        }
    })
});
//make products avalable for other customer 
//which are allrady in the cart but not delivered
router.put("/removeFromCartNotDelivered", (req, res) => {

        try {
            if (req.body.obj.state == 0) { //not sold
                //update products table
                connection.query("SELECT * from cart INNER JOIN products ON cart.itemid=products.pid && cart.status=1 WHERE id=?", [req.body.obj.id], (err, rows, fields) => {
                    if (!err) {
                        connection.query(` UPDATE products SET leftQ = leftQ + ${req.body.obj.iquantity} WHERE pid = ${rows[0].pid}`)

                    } else
                        console.log(err);
                });
            }

            //then remove item from cart so that someone else can buy

            connection.query('DELETE FROM cart WHERE id = ? && status=1', [req.body.obj.id], (err, rows, fields) => {
                if (!err)
                    res.send({ success: "item removed from cart" });
                else
                    console.log(err);
            })

        } catch (error) {

        }

    })
    //order products by filling  address
router.put("/placeorder", (req, res) => {
        try {
            if (req.body.obj.order.fullname != '' || req.body.obj.order.phone != '' || req.body.obj.order.email != '' || req.body.obj.order.city != '' || req.body.obj.order.wereda != '' || req.body.obj.order.kebele != '' || req.body.obj.order.housenum != '') {
                connection.query(`UPDATE cart SET status = 1, customer = ? , phone = ? , email = ? , city = ? , wereda = ? , kebele = ? , housenumber = ? , note = ? WHERE cartNumber = ${req.body.obj.cartid} && status = 0 `, [req.body.obj.order.fullname, req.body.obj.order.phone, req.body.obj.order.email, req.body.obj.order.city, req.body.obj.order.wereda, req.body.obj.order.kebele, req.body.obj.order.housenum, req.body.obj.order.desc], (err, rows, fields) => {
                    if (!err)
                    //update sold quantity when product is delivered
                        res.send({ success: "Thank You , Your Order will Soon Delivered To You" });
                    else
                        console.log(err);
                });
            } else {
                res.send({ error: "All are required" });
            }
        } catch (error) {

        }
    })
    //view all products  which are verified
router.get("/all", (req, res) => {
        connection.query(' SELECT * FROM products INNER JOIN users ON products.user_id=users.id WHERE products.status=1 && products.leftQ >=1 ', (err, rows, fields) => {
            if (!err)
                res.send(rows);
            else
                console.log(err);
        })
    })
    //show products related to the product customer looking at
router.get("/related", (req, res) => {
    connection.query('SELECT * FROM products WHERE status=1 && leftQ >=1 LIMIT 4', (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
})

//view products in cart 
router.get("/pcode", (req, res) => {
        console.log(req.query.key)
        connection.query('SELECT * FROM products WHERE pcode=?', [req.query.pcode], (err, rows, fields) => {
            if (!err)
                res.send(rows);
            else
                console.log(err);
        })
    })
    //get all products
router.get("/", (req, res) => {

    connection.query('SELECT * FROM products  WHERE  status=1 && leftQ >=1', (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
})

//like product
router.put("/likeproduct", (req, res) => {
        try {

            connection.query(`
                        UPDATE products SET likes = likes + 1 WHERE pid = ? `, [req.body.id], (err, rows, fields) => {
                if (!err)
                    res.send(rows);
                else
                    console.log(err);
            });
        } catch (error) {

        }

    })
    //dislike product
router.put("/dislike", (req, res) => {
    try {

        connection.query(`
                        UPDATE products SET likes = likes - 1 WHERE pid = ? `, [req.body.id], (err, rows, fields) => {
            if (!err)
                res.send(rows);
            else
                console.log(err);

        });
    } catch (error) {

    }

})

//view most liked products
router.get("/likes", (req, res) => {
        try {
            connection.query('SELECT * FROM products WHERE likes >=1', (err, rows, fields) => {
                if (!err)
                    res.send(rows);
                else
                    console.log(err);

            });

        } catch (error) {

        }
    })
    //normal search search product
router.get("/search", (req, res) => {
    connection.query('SELECT * FROM products  WHERE status=1 && ( pcode LIKE "%' +
        req.query.key + '%" || pname LIKE "%' +
        req.query.key + '%"  || year LIKE "%' +
        req.query.key + '%"  || pprice LIKE "%' +
        req.query.key + '%" )', (err, rows, fields) => {
            if (!err) {
                res.send(rows);
            } else
                console.log(err);
        })
});
//admin search product
router.get("/adminsearch", (req, res, next) => {

    connection.query('SELECT * FROM products WHERE pcode LIKE "%' +
        req.query.key + '%"  || pname LIKE "%' +
        req.query.key + '%"  || year LIKE "%' +
        req.query.key + '%"  || pprice LIKE "%' +
        req.query.key + '%" ', (err, rows, fields) => {
            if (!err) {
                res.send(rows);
            } else
                console.log(err);
        })
});
//dealers search for product
router.get("/dealerproductsearch", (req, res) => {
    connection.query('SELECT * FROM products WHERE user_id="' +
        req.query.uid + '" && (pcode LIKE "%' +
        req.query.key + '%"  || pname LIKE "%' +
        req.query.key + '%"  || year LIKE "%' +
        req.query.key + '%"  || pprice LIKE "%' +
        req.query.key + '%")', (err, rows, fields) => {
            if (!err) {
                res.send(rows);
            } else
                console.log(err);
        })
});

//search for products in the cart
router.get("/searchCart", (req, res) => {
    connection.query('SELECT * FROM cart WHERE uid="' +
        req.query.id + '" && (itemname LIKE "%' +
        req.query.key + '%"  || city LIKE "%' +
        req.query.key + '%" || customer LIKE "%' +
        req.query.key + '%" )', (err, rows, fields) => {
            if (!err) {
                res.send(rows);
            } else
                console.log(err);
        })
});
//toggle status (admin page)
router.put("/status", (req, res) => {
    //! status
    const flag = req.body.obj.state;
    let status = 0;
    if (flag == 0) {
        status = 1
    } else if (flag == 1) {
        status = 0
    } else {

    }
    connection.query('UPDATE products set status="' +
        status + '" WHERE pid="' +
        req.body.obj.id + '"', (err, rows, fields) => {
            if (!err) {
                res.send(rows);
            } else
                console.log(err);
        })

});
//admin delete product
router.delete("/deleteproduct", (req, res, next) => {
    console.log(req.query.key)
    connection.query('DELETE FROM products WHERE pid="' +
        req.query.key + '" ', (err, rows, fields) => {
            if (!err) {
                res.send(rows);
            } else
                console.log(err);
        })
});
//sort by year
router.get("/byyear", (req, res, next) => {
    connection.query('SELECT * FROM products  WHERE year="' +
        req.query.key + '" && status=1', (err, rows, fields) => {
            if (!err) {
                res.send(rows);
            } else
                console.log(err);
        })
});

//get catagory year
router.get("/year", (req, res) => {

        connection.query('SELECT  DISTINCT (year) FROM products', (err, rows, fields) => {
            if (!err)
                res.send(rows);
            else
                console.log(err);
        })
    })
    //location catagory
router.get("/location", (req, res) => {

        connection.query('SELECT  DISTINCT (pcountry) FROM products', (err, rows, fields) => {
            if (!err)
                res.send(rows);
            else
                console.log(err);
        })
    })
    //product by country
router.get("/specificlocation", (req, res) => {

        connection.query('SELECT * FROM products  WHERE pcountry=?', [req.query.key], (err, rows, fields) => {
            if (!err) {
                res.send(rows);
            } else
                console.log(err);

        });
    })
    //search for products
router.get("/:id", (req, res) => {
    connection.query('SELECT * FROM products WHERE pid = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);

    });
})

module.exports = router;