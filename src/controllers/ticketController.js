const { Router } = require("express");
const router = Router();
const Ticket = require("../models/Ticket");
const multer  = require('multer')
const Upload = require("../models/Upload");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get all available tickets
 *     description: Get all available tickets.
 *     responses:
 *       200:
 *         description: Successfully displaying all available tickets from the Data Base.
 *       500:
 *         description: Error saving the ticket.
 */
router.get("/", async (req, res) => {
  try {
    const tickets = await Ticket.find();
    const ticketIds = tickets.map(ticket => ticket._id);

    res.status(200).json({ ticketIds });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
/**
 * @swagger
 * /createNewTicket/{userId}:
 *   post:
 *     summary: Create a new ticket
 *     description: Create a new ticket with provided details.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventDateTime:
 *                 type: string
 *                 format: date-time
 *                 description: The date and time of the event for the ticket.
 *               location:
 *                 type: string
 *                 description: The location of the event for the ticket.
 *               title:
 *                 type: string
 *                 description: The title of the ticket.
 *               category:
 *                 type: string
 *                 description: The category of the ticket.
 *     responses:
 *       201:
 *         description: Successfully created a new ticket.
 *         schema:
 *           $ref: '#/definitions/Ticket'
 *       401:
 *         description: Authentication failed.
 *       409:
 *         description: A similar ticket already exists.
 *       500:
 *         description: Error saving the ticket.
 */
router.post("/createNewTicket/:id", async (req, res) => {
  try {
    const { title, category, description, price, location, eventDateTime } = req.body;
    const seller = req.params.id; // Use the extracted user ID

    const existingTicket = await Ticket.findOne({ title, category, description, price, location, eventDateTime, seller});
    if (existingTicket) {
      return res.status(409).send('A similar ticket already exists.');
    }

    const newTicket = new Ticket({
      ...req.body,
      price: parseFloat(price), // Convert price to a number
      seller: seller // Set the seller to the extracted user ID
    });

    await newTicket.save();
    res.status(201).json(newTicket);
      
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).send('Error saving the ticket: ' + error.message); // Send a more informative error message
  }
});

/**
 * @swagger
 * /tickets/deleteTicket/{ticketId}:
 *   delete:
 *     summary: Delete a ticket by ID
 *     description: Deletes a ticket from the database by its ID.
 *     tags:
 *       - TicketManagement
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         description: ID of the ticket to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ticket deleted successfully
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Internal server error
 */
router.delete("/deleteTicket/:ticketId", async (req, res) => {
  try {
    const { ticketId } = req.params;
    const deletedTicket = await Ticket.findByIdAndDelete(ticketId);

    if (!deletedTicket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    res.json({ message: "Ticket deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * @swagger
 * /tickets/ticketsByCategory/{category}:
 *   get:
 *     summary: Get tickets by category
 *     description: Retrieve all ticket IDs under a specific category.
 *     tags:
 *       - TicketManagement
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         description: Name of the category to search for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 description: Ticket ID
 *       404:
 *         description: No tickets found for the specified category
 *       500:
 *         description: Internal server error
 */
router.get("/ticketsByCategory/:categoryName", async (req, res) => {
  try {
    const { categoryName } = req.params;
    const tickets = await Ticket.find({ category: categoryName });
    const ticketIds = tickets.map(ticket => ticket._id);

    res.json({ ticketIds });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * @swagger
 * /tickets/getTicket/{ticketId}:
 *   get:
 *     summary: Get ticket by ID
 *     description: Retrieve a ticket from the database by its ID.
 *     tags:
 *       - TicketManagement
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         description: ID of the ticket to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Internal server error
 */
router.get("/getTicket/:ticketId", async (req, res) => {
  try {
    const ticketId = req.params.ticketId;
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }
    res.status(200).json(ticket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Uploads an image or PDF file
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The image or PDF file to upload
 *               fileName:
 *                 type: string
 *                 description: The desired filename for the uploaded file
 *     responses:
 *       '200':
 *         description: File uploaded successfully
 *       '400':
 *         description: Bad request, fileName is missing or invalid
 *       '500':
 *         description: Internal server error
 */
router.post("/upload", upload.single("file"), async (req, res) => {
  // req.file can be used to access all file properties
  try {
    // Check if the request has an image or not
    if (!req.file) {
      res.json({
        success: false,
        message: "You must provide at least 1 file"
      });
    } else {
      // Check if fileName is provided in the request body
      if (!req.body.fileName) {
        return res.status(400).json({ error: "fileName is required" });
      }

      let imageUploadObject = {
        file: {
          data: req.file.buffer,
          contentType: req.file.mimetype
        },
        fileName: req.body.fileName
      };
      const uploadObject = new Upload(imageUploadObject);
      // saving the object into the database
      const uploadProcess = await uploadObject.save();
      res.status(200).send("File uploaded");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;



// **************************************************** //
//                   PREVIOUS CODE                      //
// **************************************************** //

// router.get("/", async (req, res) => {
//   const { page, search } = req.query;
//   try {
//     let products;
//     if (search) {
//       products = await Product.find();
//       products = products.filter((x) => x.active == true);
//       products = products.filter(
//         (x) =>
//           x.title.toLowerCase().includes(search.toLowerCase()) ||
//           x.city.toLowerCase().includes(search.toLowerCase())
//       );
//       res.status(200).json({ products: products, pages: products.pages });
//     } else {
//       products = await Product.paginate({}, { page: parseInt(page) || 1, limit: 100 });
//       products.docs = products.docs.filter((x) => x.active == true);
//       res.status(200).json({ products: products.docs, pages: products.pages });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// router.get("/:category", async (req, res) => {
//   const { page } = req.query;
//   try {
//     let products = await Product.paginate(
//       { category: req.params.category },
//       { page: parseInt(page) || 1, limit: 10 }
//     );
//     res.status(200).json({ products: products.docs, pages: products.pages });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // New endpoint to fetch category names
// router.get("/categories/names", async (req, res) => {
//   try {
//     // Use aggregation to retrieve unique category names from your products
//     const uniqueCategories = await Product.distinct("category");

//     res.status(200).json({ categoryNames: uniqueCategories });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// router.get("/specific/:id", async (req, res) => {
//   try {
//     let product = await (await Product.findById(req.params.id)).toJSON();
//     let seller = await (await User.findById(product.seller)).toJSON();
//     product.addedAt = moment(product.addedAt).format("d MMM YYYY (dddd) HH:mm");
//     let jsonRes = {
//       ...product,
//       name: seller.name,
//       phoneNumber: seller.phoneNumber,
//       email: seller.email,
//       createdSells: seller.createdSells.length,
//       avatar: seller.avatar,
//       sellerId: seller._id,
//       isAuth: false,
//     };
//     if (req.user) {
//       let user = await User.findById(req.user._id);
//       jsonRes.isSeller = Boolean(req.user._id == product.seller);
//       jsonRes.isWished = user.wishedProducts.includes(req.params.id);
//       jsonRes.isAuth = true;
//     }
//     res.status(200).json(jsonRes);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// router.post("/create", async (req, res) => {
//   let { title, price, description, city, category, image, pdf } = req.body;
//   try {
//     let errors = [];
//     if (title.length < 3 || title.length > 50)
//       errors.push("Title should be at least 3 characters long and max 50 characters long; ");
//     if (isNaN(Number(price))) errors.push("Price should be a number; ");
//     if (description.length < 10 || description.length > 1000)
//       errors.push(
//         "Description should be at least 10 characters long and max 1000 characters long; "
//       );
//     if (/^[A-Za-z]+$/.test(city) == false)
//       errors.push("City should contains only english letters; ");
//     if (!image.includes("image")) errors.push("The uploaded file should be an image; ");

//     if (!category) errors.push("Category is required; ");

//     if (errors.length >= 1) throw { message: [errors] };

//     let compressedImg = await productService.uploadImage(image);
//     let pdfFile = await productService.uploadImage(pdf);

//     let product = new Product({
//       title,
//       price,
//       description,
//       city,
//       category,
//       pdf: pdfFile,
//       image: compressedImg,
//       addedAt: new Date(),
//       seller: req.user._id,
//     });

//     await product.save();
//     await productService.userCollectionUpdate(req.user._id, product);

//     res.status(201).json({ productId: product._id });
//   } catch (err) {
//     console.error(err);
//     res.status(404).json({ error: err.message });
//   }
// });

// router.patch("/edit/:id", isAuth, async (req, res) => {
//   //TODO: Rewrite this
//   let { title, price, description, city, category, image, pdf } = req.body;
//   try {
//     let user = await productService.findUserById(req.user._id);
//     let product = await productService.findById(req.params.id);
//     let errors = [];
//     if (user._id.toString() !== product.seller.toString()) {
//       errors.push("You have no permission to perform this action! ");
//     }

//     if (title.length < 3 || title.length > 50)
//       errors.push("Title should be at least 3 characters long and max 50 characters long; ");
//     if (isNaN(Number(price))) errors.push("Price should be a number; ");
//     if (description.length < 10 || description.length > 1000)
//       errors.push(
//         "Description should be at least 10 characters long and max 1000 characters long; "
//       );
//     if (/^[A-Za-z]+$/.test(city) == false)
//       errors.push("City should contains only english letters; ");
//     if (req.body.image) {
//       if (!req.body.image.includes("image")) errors.push("The uploaded file should be an image; ");
//     }
//     if (!category || category == "Choose...") errors.push("Category is required; ");

//     if (errors.length >= 1) throw { message: [errors] };

//     if (req.body) {
//       let compressedImg = await productService.uploadImage(req.body.image);
//       let pdfFile = await productService.uploadImage(req.body.pdf);

//       if (compressedImg) {
//         await productService.edit(req.params.id, {
//           title,
//           price,
//           description,
//           city,
//           category,
//           image: compressedImg,
//         });
//       }
//       if (pdfFile) {
//         await productService.edit(req.params.id, {
//           title,
//           price,
//           description,
//           city,
//           category,
//           pdf: pdfFile,
//         });
//       }
//       if (pdfFile && compressedImg) {
//         await productService.edit(req.params.id, {
//           title,
//           price,
//           description,
//           city,
//           category,
//           image: compressedImg,
//           pdf: pdfFile,
//         });
//       } else {
//         await productService.edit(req.params.id, {
//           title,
//           price,
//           description,
//           city,
//           category,
//         });
//       }
//     }

//     res.status(201).json({ message: "Updated!" });
//   } catch (err) {
//     res.status(404).json({ error: err.message });
//   }
// });

// router.get("/sells/active/:id", async (req, res) => {
//   try {
//     let userId = "";
//     if (req.params.id) {
//       userId = req.params.id;
//     } else {
//       userId = req.user_id;
//     }
//     let user = await (await User.findById(userId).populate("createdSells")).toJSON();
//     res.status(200).json({ sells: user.createdSells.filter((x) => x.active), user });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// router.get("/sells/archived", async (req, res) => {
//   try {
//     let user = await (await User.findById(req.user._id).populate("createdSells")).toJSON();
//     res.status(200).json({
//       sells: user.createdSells.filter((x) => x.active == false),
//       user,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// router.get("/enable/:id", async (req, res) => {
//   try {
//     await Product.updateOne({ _id: req.params.id }, { active: true });
//     res.status(200).json({ msg: "Activated" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// router.get("/archive/:id", async (req, res) => {
//   try {
//     await Product.updateOne({ _id: req.params.id }, { active: false });
//     res.status(200).json({ msg: "Archived" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// router.get("/wish/:id", async (req, res) => {
//   try {
//     let user = await User.findById(req.user._id);

//     if (!user.wishedProducts.includes(req.params.id)) {
//       await User.updateOne({ _id: req.user._id }, { $push: { wishedProducts: req.params.id } });
//       await Product.updateOne({ _id: req.params.id }, { $push: { likes: user } });

//       res.status(200).json({ msg: "wished" });
//     } else {
//       await User.updateOne({ _id: req.user._id }, { $pull: { wishedProducts: req.params.id } });
//       await Product.updateOne({ _id: req.params.id }, { $pull: { likes: req.user._id } });

//       res.status(200).json({ msg: "unwished" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// router.get("/wishlist/:id", async (req, res) => {
//   try {
//     let user = await (await User.findById(req.user._id).populate("wishedProducts")).toJSON();

//     res.status(200).json({ wishlist: user.wishedProducts });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });
