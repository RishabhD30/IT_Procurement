const express = require('express');
const mongoose = require('mongoose'); // Corrected import
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const nodemailer = require("nodemailer");

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const email = "rishabhd30@gmail.com";
const pass = "fgpf hxaf qotn ftlm";

const app = express();
app.use(express.json());
app.use(cors());
const UserModel = require('./models/Users');
const reqModel = require('./models/Requirement');
const productModel = require("./models/Products");
const VenderSubmit = require("./models/SubmitDescription");
const VenderPriceSubmit = require("./models/lastOrdersBackend");
const FinalList = require("./models/FinalSubmitbtn");
const VenderPriceList = require("./models/VendersBidding");

app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: "Failed to logout" });
    }

    // Clear the session cookie
    res.clearCookie('connect.sid');
    res.status(200).json({ message: "Logged out successfully" });
  });
});



// Session Middleware
app.use(session({
  secret: 'mySecretKey',  // Use a strong secret key in production
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: 'mongodb://127.0.0.1:27017/Users',
    collectionName: 'sessions'
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day session duration
    sameSite: true,
    secure: false // Use `true` if you're using HTTPS
  }
}));

//// Middleware to verify token and extract user info

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']; 
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ data: "Access denied. Token not provided." });
  }

  jwt.verify(token, "SECRET_KEY", (err, user) => {
    if (err) {
      return res.status(403).json({ data: "Invalid or expired token." });
    }

    req.user = user;
    next();
  });
};



//============ Connecting to DB ===========
(async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/Users");

    app.listen(3001, () => {
      console.log("Server is running");
    })

  } catch (error) {
    console.log(error);
    throw error;
  }
})();

// -------- Login Validtion------------

app.get('/profile', authenticateToken, async (req, res) => {
  try {
    // Fetch user profile based on userId from decoded token
    const user = await UserModel.findById(req.userId, '-password'); // Exclude the password field

    if (user) {
      console.log(user);

      res.status(200).json({ data: "Profile fetched successfully", profile: user });
    } else {
      res.status(404).json({ data: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ data: "Server error" });
  }
});

app.post('/loginDB', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user based on the email
    const user = await UserModel.findOne({ email });

    if (user && user.password === password) {
      const token = jwt.sign({ userId: user.id }, "SECRET_KEY", { expiresIn: '1h' });
      // res.json({ token , role:user.role});
      // Return success and the role of the user
      res.status(200).json({ data: "Success", role: user.role, token });
    } else {
      // Invalid credentials
      res.status(401).json({ data: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ data: "Server error" });
  }
});
// -------- Logout Route to Destroy Session --------
app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: "Failed to logout" });
    }

    // Clear cookie
    res.clearCookie('connect.sid');
    res.status(200).json({ message: "Logged out successfully" });
  });
});

//-----Fetching UserTable------
app.get("/usersData", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.status(201).json({ message: "Requirement created successfully", users });
  } catch (error) {
    res.status(500).json("An error occurred while creating the requirement");
    console.error(error);
  }
})

// ---------- ADD User ----------------
app.post("/usersData/Adduser", async (req, res) => {
  const { email } = req.body;
  const { password } = req.body;
  const { role } = req.body;
  try {
    const users = await UserModel.create({
      "email": email,
      "password": password,
      "role": role,
    });
    res.status(201).json({ message: "Requirement created successfully", email, password });
  } catch (error) {
    res.status(500).json("An error occurred while creating the requirement");
    console.error(error);
  }
})

// ----------Deleting UserData From UserDB---------
app.delete("/usersData/Delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await UserModel.findByIdAndDelete(id);

    if (deletedUser) {
      res.status(200).json({ message: "Success", deletedUser });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json("An error occurred while deleting user");
    console.error(error);
  }
});


//----- sending ID into Product ModelTable  ------
app.post('/requirement1', async (req, res) => {
  const { productID } = req.body;

  try {
    const requirement = await reqModel.create({
      productID: productID,
    });

    res.status(201).json({ message: "Requirement created successfully", requirement });
  } catch (error) {
    res.status(500).json("An error occurred while creating the requirement");
    console.error(error);
  }
});

//--------------Sumbit product Details--------
app.post('/requirement1', async (req, res) => {
  const { productID } = req.body;

  try {
    const requirement = await reqModel.create({
      productID: productID,
    });

    res.status(201).json({ message: "Requirement created successfully", requirement });
  } catch (error) {
    res.status(500).json("An error occurred while creating the requirement");
    console.error(error);
  }
});


// ---------Fetching Data from Product ModelTable------------
app.get('/requirement', async (req, res) => {
  try {
    const requirements = await reqModel.find().populate("productID");
    res.status(200).json({ message: "Requirements retrieved successfully", requirements });
  } catch (error) {
    res.status(500).json("An error occurred while retrieving requirements");
    console.error(error);
  }
});


// ------------ Deleting Data from Product ModelTable------------
app.delete('/delete/requirement', async (req, res) => {
  const { requirementID } = req.query;
  try {
    const requirements = await reqModel.findByIdAndDelete(requirementID);

    res.status(200).json({ message: "Requirements retrieved successfully", requirements });
  } catch (error) {
    res.status(500).json("An error occurred while retrieving requirements");
    console.error(error);
  }
});

// ---------------Fetching From Product ModelTable------------
app.get('/product', async (req, res) => {
  try {
    const requirement = await productModel.find();

    res.status(201).json({ message: "Requirement created successfully", requirement });
  } catch (error) {
    res.status(500).json("An error occurred while creating the requirement");
    console.error(error);
  }
});

app.get('/getsubmit', async (req, res) => {
  try {
    const requirement = await VenderSubmit.find().populate("userID").populate({ path: "requireID", populate: { path: "productID" } })

    res.status(201).json({ message: "Requirement created successfully", requirement });
  } catch (error) {
    res.status(500).json("An error occurred while creating the requirement");
    console.error(error);
  }
});


//-----------Final submit --------
// app.post('/Finalsubmit', async (req, res) => {
//   const { requirementID , email , quantities} = req.body;

//   try {
//     const requirement = await VenderSubmit.create({
//       requireID : requirementID,
//       email : email,
//       quantities : quantities
//     });
//     const req = await VenderSubmit.findOne({_id:requirement._id}).populate({path:"requireID", populate:{path:"productID"}})
//     console.log(req);
//     // await sendGmail(email , req , quantities);   ----------------------------------Uncomment


//     res.status(201).json({ message: "Requirement created successfully", requirement });
//   } catch (error) {
//     res.status(500).json("An error occurred while creating the requirement");
//     console.error(error);
//   }
// });

app.get('/gettingVenderPriceSubmit', async (req, res) => {
  try {
    const requirement = await VenderPriceSubmit.find().populate("quantities").populate("venderSubmitID").populate("productID")

    res.status(201).json({ message: "Requirement created successfully", requirement });
  } catch (error) {
    res.status(500).json("An error occurred while creating the requirement");
    console.error(error);
  }
});

app.post('/VenderPriceSubmit', async (req, res) => {
  const { productID, venderSubmitID, price } = req.body;

  try {
    const venderSubmitData = await VenderSubmit.findOne({ _id: venderSubmitID });
    console.log(venderSubmitData.email, "oooooooooooooooooooooooooooooooo");
    const email1 = venderSubmitData.email;
    const requirement = await VenderPriceSubmit.create({
      venderSubmitID: venderSubmitID,
      productID: productID,
      price: price,
      email: email1,
    });
    console.log(requirement);

    res.status(201).json({ message: "Requirement created successfully", requirement });
  } catch (error) {
    res.status(500).json("An error occurred while creating the requirement");
    console.error(error);
  }
});

// -------- Email Selection ------- 
app.post('/Emailsubmit', async (req, res) => {
  const { emails, products } = req.body;

  try {
    // Loop through the array of emails
    for (const email of emails) {
      const ar1 = [];
      // For each email, loop through the products and create a requirement for each product
      for (const product of products) {
        const { requireID, qty } = product;

        const requirement = await VenderSubmit.create({
          requireID: requireID,
          email: email,
          qty: qty,
        });
        const reqData = await VenderSubmit.findOne({ _id: requirement._id }).populate("requireID");
        ar1.push(reqData)

        // Call the email-sending function for each email and product combination
      }
      console.log(ar1);

      await sendGmail(email, ar1);
    }

    res.status(201).json({ message: "Emails sent successfully with product details." });
  } catch (error) {
    res.status(500).json("An error occurred while creating the requirement or sending the emails");
    console.error(error);
  }
});

app.delete("/Delete/FinalList/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await FinalList.findByIdAndDelete(id);

    if (deletedUser) {
      res.status(200).json({ message: "Success", deletedUser });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json("An error occurred while deleting user");
    console.error(error);
  }
});

app.post('/AddProduct', async (req, res) => {
  const { itemcode, Desc } = req.body;

  try {
    const requirement = await productModel.create({
      itemcode: itemcode,
      desc: Desc
    });



    res.status(201).json({ message: "Requirement created successfully", requirement });
  } catch (error) {
    res.status(500).json("An error occurred while creating the requirement");
    console.error(error);
  }
});

app.delete("/Delete/FinalList/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedItem = await productModel.findByIdAndDelete(id);

    if (deletedItem) {
      res.status(200).json({ message: "Success", deletedItem });
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred while deleting the item" });
    console.error(error);
  }
});
// ---------node Mailer
// 

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: email,
    pass: pass,
  },
});


async function sendGmail(email, requireData) {
  console.log("hhhhhhhhhhh");

  const productDetailsHtml = requireData.map(item => `
        <tr>
            <td>${item.requireID.itemcode}</td>
            <td>${item.requireID.desc}</td>
            <td>${item.qty}</td>
        </tr>
    `).join('');

  const bookingMailOptions = {
    from: 'your_email@example.com',
    to: [email, "rishabh.dwivedi@kei-ind.com"],
    subject: `ITRequirement`,
    html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Requirement Details</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f9;
                        margin: 0;
                        padding: 20px;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    }
                    h2 {
                        color: #333333;
                    }
                    p {
                        font-size: 14px;
                        color: #555555;
                    }
                    .details {
                        margin: 20px 0;
                        padding: 15px;
                        background-color: #f1f1f1;
                        border-radius: 5px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    table, th, td {
                        border: 1px solid #ddd;
                    }
                    th, td {
                        padding: 8px;
                        text-align: left;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                    .footer {
                        margin-top: 30px;
                        text-align: center;
                        font-size: 12px;
                        color: #777777;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>Requirement Details</h2>
                    <p>Please find the product requirement details below:</p>
                    <div class="details">
                        <table>
                            <thead>
                                <tr>
                                    <th>Item Code</th>
                                    <th>Description</th>
                                    <th>Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${productDetailsHtml}
                            </tbody>
                        </table>
                    </div>
                    <div class="footer">
                        <p>This is an automated email. Please do not reply.</p>
                    </div>
                </div>
            </body>
            </html>
        `
  };

  transporter.sendMail(bookingMailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

// ----------MIddleware-------------
// function verifyUserToken(req, res, next){
//   let token = req.headers.authorization;
//   if (!token) return res.status(401).send("Access Denied / Unauthorized request");

//   try {
//       token = token.split(' ')[1] // Remove Bearer from string

//       if (token === 'null' || !token) return res.status(401).send('Unauthorized request');

//       let verifiedUser = jwt.verify(token, "SECRET_KEY");   // config.TOKEN_SECRET => 'secretKey'
//       if (!verifiedUser) return res.status(401).send('Unauthorized request')

//       req.user = verifiedUser; // user_id & user_type_id
//       next();

//   } catch (error) {
//       res.status(400).send("Invalid Token");
//   }
// }

app.post("/finalSubmit", async (req, res) => {
  let selectedItems = req.body;  // Get the data sent from the frontend    
  try {
    // Use map for iteration and processing each item asynchronously
    await Promise.all(
      selectedItems.map(async (item) => {
        await FinalList.create({
          itemcode: item.itemcode,
          desc: item.desc,
          qty: item.qty
        });
      })
    );

    // Respond with success message
    res.status(201).json({ message: "Requirements created successfully" });
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: "An error occurred while creating the requirements" });
    console.error(error);
  }
});

app.get('/FinalbtnforMail', async (req, res) => {
  try {
    const requirement = await FinalList.find();
    res.status(201).json({ message: "Requirement created successfully", requirement });
  } catch (error) {
    res.status(500).json("An error occurred while creating the requirement");
    console.error(error);
  }
});
app.get('/LastRecords', async (req, res) => {
  try {
    const requirement = await VenderSubmit.find();
    res.status(201).json({ message: "Requirement created successfully", requirement });
  } catch (error) {
    res.status(500).json("An error occurred while creating the requirement");
    console.error(error);
  }
});

app.delete("/Delete/LastRecord/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await UserModel.findByIdAndDelete(id);

    if (deletedUser) {
      res.status(200).json({ message: "Success", deletedUser });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json("An error occurred while deleting user");
    console.error(error);
  }
});

app.get('/FinalListData', async (req, res) => {
  try {
    const requirement = await FinalList.find();
    res.status(201).json({ message: "Requirement created successfully", requirement });
  } catch (error) {
    res.status(500).json("An error occurred while creating the requirement");
    console.error(error);
  }
});

app.post("/VenderSubmitting", authenticateToken, async (req, res) => {
  try {
    const {finalListID,price} = req.body 
    const user = await UserModel.findById(req.userId, '-password'); // Exclude the password field

    if (user) {
      console.log(user);
    }
    // Use map for iteration and processing each item asynchronously
    await VenderPriceList.create({
      finalListID , 
      userID:req.userId,
      price
    });

    // Respond with success message
    res.status(201).json({ message: "Requirements created successfully" });
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: "An error occurred while creating the requirements" });
    console.error(error);
  }
});

app.get('/venderSubData', async (req, res) => {
  try {
    const requirements = await VenderPriceList.find().populate("finalListID").populate('userID');
    res.status(200).json({ message: "Requirements retrieved successfully", requirements });
  } catch (error) {
    res.status(500).json("An error occurred while retrieving requirements");
    console.error(error);
  }
});
app.get('/DisplayvenderPrice', authenticateToken , async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId, '-password'); // Exclude the password field

    if (user) {
      console.log(user);
    }
    const requirements = await VenderPriceList.find({userID : user._id}).populate("finalListID").populate('userID');

    res.status(200).json({ message: "Requirements retrieved successfully", requirements });
  } catch (error) {
    res.status(500).json("An error occurred while retrieving requirements");
    console.error(error);
  }
});



module.exports = app;