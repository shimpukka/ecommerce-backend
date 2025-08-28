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

// Update order status (admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params; // orderId
    const { status } = req.body;

    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Forbidden: Admins only" });
    }

    // validate status
    const validStatuses = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: {
          include: {
            product: { select: { id: true, name: true, price: true } }
          }
        }
      }
    });

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update order status" });
  }
};

// Pay for an order (customer action)
export const payOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params; // orderId

    // Find the order
    const order = await prisma.order.findUnique({
      where: { id },
      include: { user: true }
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Ensure this order belongs to the logged-in user
    if (order.userId !== userId) {
      return res.status(403).json({ error: "You cannot pay for this order" });
    }

    // Only allow payment if still pending
    if (order.status !== "PENDING") {
      return res.status(400).json({ error: `Order cannot be paid. Current status: ${order.status}` });
    }

    // Update status to PAID
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status: "PAID" },
      include: {
        items: {
          include: {
            product: { select: { id: true, name: true, price: true } }
          }
        }
      }
    });

    res.json({ message: "Payment successful", order: updatedOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Payment failed" });
  }
};
