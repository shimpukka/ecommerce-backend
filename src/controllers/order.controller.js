import { prisma } from '../config/db.js';

export const checkout = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // get cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: { include: { product: true } }
      }
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // check stock
    for (const item of cart.items) {
      if (item.quantity > item.product.stock) {
        return res.status(400).json({ 
          error: `Not enough stock for product: ${item.product.name}` 
        });
      }
    }

    // calculate total
    const total = cart.items.reduce((sum, item) => {
      return sum + (item.quantity * item.product.price);
    }, 0);

    // create order & items in transaction
    const order = await prisma.$transaction(async (tx) => {
      // create order
      const newOrder = await tx.order.create({
        data: {
          userId,
          total,
          items: {
            create: cart.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price, // snapshot
            }))
          }
        },
        include: { items: true }
      });

      // deduct stock
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        });
      }

      // clear cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id }
      });

      return newOrder;
    });

    res.json({ message: "Order placed successfully", order });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Checkout failed" });
  }
};

// Get logged-in user's orders
export const getMyOrders = async (req, res) => {
    try {
      const userId = req.user.id;
  
      const orders = await prisma.order.findMany({
        where: { userId },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                  price: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: "desc" }
      });
  
      res.json(orders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  };
  
// Get all orders (admin only)
export const getAllOrders = async (req, res) => {
try {
    if (req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Forbidden: Admins only" });
    }

    const orders = await prisma.order.findMany({
    include: {
        user: {
        select: { id: true, name: true, email: true }
        },
        items: {
        include: {
            product: {
            select: { id: true, name: true, price: true }
            }
        }
        }
    },
    orderBy: { createdAt: "desc" }
    });

    res.json(orders);
} catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch all orders" });
}
};
