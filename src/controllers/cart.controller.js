import { prisma } from '../config/db.js';

// Add product to cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id; // user must be logged in (from middleware)
    const { productId, quantity } = req.body;
    
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    // ensure product exists
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // find or create cart for this user
    let cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    // check if item already exists in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: { cartId: cart.id, productId },
      },
    });

    if (existingItem) {
      // update quantity
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
      return res.json(updatedItem);
    } else {
      // create new item
      const newItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
      return res.json(newItem);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add product to cart" });
  }
};

// Get user's cart items
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // find user's cart
    const cart = await prisma.cart.findUnique({ 
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                description: true,
                price: true,
                stock: true
              }
            }
          }
        }
      }
    });

    if (!cart) {
      return res.json({ items: [], total: 0 });
    }

    // calculate total
    const total = cart.items.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    res.json({
      cartId: cart.id,
      items: cart.items,
      total: total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get cart" });
  }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { quantity } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // verify the cart item belongs to the user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: id,
        cart: {
          userId: userId
        }
      },
      include: {
        cart: true
      }
    });

    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    if (quantity <= 0) {
      // remove item if quantity is 0 or negative
      await prisma.cartItem.delete({ where: { id } });
      return res.json({ message: "Item removed from cart" });
    }

    // update quantity
    const updatedItem = await prisma.cartItem.update({
      where: { id },
      data: { quantity },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            stock: true
          }
        }
      }
    });

    res.json(updatedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update cart item" });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // verify the cart item belongs to the user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: id,
        cart: {
          userId: userId
        }
      }
    });

    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    await prisma.cartItem.delete({ where: { id } });
    res.json({ message: "Item removed from cart" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to remove item from cart" });
  }
};

// Clear entire cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // find user's cart
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      return res.json({ message: "Cart is already empty" });
    }

    // delete all cart items
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    
    res.json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to clear cart" });
  }
};
