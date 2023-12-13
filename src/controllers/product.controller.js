const { PrismaClient } = require('@prisma/client');

const throwError = require('../utils/throwError');
const nodemailer = require('nodemailer');

/*const transporter = nodemailer.createTransport({
  service: 'gmail', //ou autre
  auth: {
    user: '..........com',
    pass: '*****',
  },
}); */

const prisma = new PrismaClient();

exports.getProducts = async (req, res, next) => {
    try {
        const products = await prisma.product.findMany({
            where: { active: true },
            take: req.query.take ? Number(req.query.take) : 8,
        });
        if (!products) {
            const err = throwError('No products found', 404);
            return next(err);
        }
        return res.send(
            {
                success: true,
                data: products,
            },
        );
    } catch (err) {
        return next(err);
    }
};

exports.getProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            const err = throwError('No product id provided', 404);
            next(err);
        }
        const product = await prisma.product.findUnique({
            where: { id: Number(id) },
        });
        if (!product) {
            const err = throwError('Product not found', 404);
            return next(err);
        }
        return res.json(
            {
                data: product,
                sucess: true,
            },
        );
    } catch (err) {
        return next(err);
    }
};

exports.getInterestedUsers = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Trouver le produit par son ID
    const product = await prisma.product.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        interestedUser: true,
      },
    });

    if (!product) {
      const err = throwError('Product not found', 404);
      return next(err);
    }

    return res.json({
      success: true,
      data: product.interestedUser,
    });
  } catch (err) {
    return next(err);
  }
};


exports.postForm = async (req, res, next) => {
  try {
    const { productId, fname, lname, email } = req.body;
    // Trouver le produit par son ID
    const product = await prisma.product.findUnique({
      where: { id: Number(productId) },
    });

    if (!product) {
      const err = throwError('Product not found', 404);
      return next(err);
    }
    //Creer et  Enregistrer l'utilisateur dans la base de données
    const user = await prisma.user.create({
      data: {
        fname,
        lname,
        email,
        interestingProducts: {
          connect: { id: product.id },
        },
      },
    });

    // Envoyer un e-mail à l'administrateur
   /* const mailOptions = {
      from: '......com',
      to: '........com',
      subject: 'Formulaire soumis',
      text: `Un nouveau utilisateur a soumis le formulaire "interressé" :\n\nNom: ${fname}\nPrénom: ${lname}\nEmail: ${email}`,
    }; */

   // await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Formulaire soumis avec succès', user });
  } catch (error) {
    console.error('Erreur lors de la soumission du formulaire :', error);
    res.status(500).json({ error: 'Une erreur est survenue' });
  }
};




 
