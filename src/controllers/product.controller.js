const { PrismaClient } = require('@prisma/client');
const throwError = require('../utils/throwError');

const prisma = new PrismaClient();
const sendMail = require('../utils/sendMail');

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

// eslint-disable-next-line consistent-return
exports.postForm = async (req, res, next) => {
  try {
    const {
      productId, fname, lname, email,
    } = req.body;

    // Trouver le produit par son ID
    const product = await prisma.product.findUnique({
      where: { id: Number(productId) },
    });

    // Creer et  Enregistrer l'utilisateur dans la base de données
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

    console.log('Formulaire soumis avec succès :', user);

    if (user) {
      // // send email to Admin
      await sendMail(
        // process.env.ADMIN_EMAIL,
        'gervaisines@gmail.com',
        '[Admin] - Client et produit',
        `<p>Hello Admin,</p> <p>Il y a un client ${user.fname} ${user.lname} ${user.email} qui est interessé(e) par votre produit !</p> <p>Bien cordialement, mystore.</p>`,
      );

      // return
      return res.json({
        success: true,
        data: product.interestedUser,
        message: 'User interessed ok',
      });
    }
  } catch (err) {
    console.error('Erreur lors de la soumission du formulaire :', err);
    next(err);
  }
};
