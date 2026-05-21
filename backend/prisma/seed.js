const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Clear existing data
  await prisma.wishlistItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Create Default Customer
  await prisma.user.create({
    data: {
      id: 1,
      name: 'John Doe',
      email: 'customer@meowkart.com',
      password: hashedPassword,
      role: 'CUSTOMER',
    },
  });

  const sourceProducts = [
    // Mobiles
    { name: 'Apple iPhone 15', price: 69999, category: 'Mobiles', imgId: 'photo-1511707171634-5f897ff02aa9' },
    { name: 'Samsung Galaxy S24 Ultra', price: 129999, category: 'Mobiles', imgId: 'photo-1610945265064-0e34e5519bbf' },
    { name: 'OnePlus 12 5G', price: 69999, category: 'Mobiles', imgId: 'photo-1592899677977-9c10ca588bbd' },
    { name: 'Google Pixel 8 Pro', price: 106999, category: 'Mobiles', imgId: 'photo-1511707171634-5f897ff02aa9' },
    { name: 'Nothing Phone (2)', price: 44999, category: 'Mobiles', imgId: 'photo-1610945265064-0e34e5519bbf' },
    { name: 'Xiaomi 14 Ultra', price: 99999, category: 'Mobiles', imgId: 'photo-1592899677977-9c10ca588bbd' },
    
    // Electronics
    { name: 'Sony WH-1000XM5', price: 26990, category: 'Electronics', imgId: 'photo-1505740420928-5e560c06d30e' },
    { name: 'Apple MacBook Air M2', price: 99900, category: 'Electronics', imgId: 'photo-1496181133206-80ce9b88a853' },
    { name: 'Sony Bravia 4K TV', price: 54990, category: 'Electronics', imgId: 'photo-1593359677879-a4bb92f829d1' },
    { name: 'HP Victus Laptop', price: 58990, category: 'Electronics', imgId: 'photo-1496181133206-80ce9b88a853' },
    { name: 'Marshall Stanmore III', price: 41999, category: 'Electronics', imgId: 'photo-1583394838336-acd977736f90' },
    { name: 'Canon EOS R50', price: 68990, category: 'Electronics', imgId: 'photo-1516035069371-29a1b244cc32' },

    // Fashion
    { name: 'Nike Air Max Pulse', price: 13995, category: 'Fashion', imgId: 'photo-1542291026-7eec264c27ff' },
    { name: 'Levi\'s 511 Slim', price: 2899, category: 'Fashion', imgId: 'photo-1542272604-787c3835535d' },
    { name: 'U.S. POLO Regular Fit', price: 1599, category: 'Fashion', imgId: 'photo-1521572163474-6864f9cf17ab' },
    { name: 'Ray-Ban Wayfarer', price: 10590, category: 'Fashion', imgId: 'photo-1572635196237-14b3f281503f' },
    { name: 'Adidas Ultraboost', price: 17999, category: 'Fashion', imgId: 'photo-1542291026-7eec264c27ff' },
    { name: 'Tommy Leather Wallet', price: 2499, category: 'Fashion', imgId: 'photo-1627123424574-724758594e93' },

    // Home
    { name: 'Philips Air Fryer XL', price: 12999, category: 'Home', imgId: 'photo-1556910103-1c02745aae4d' },
    { name: 'Dyson V15 Vacuum', price: 65900, category: 'Home', imgId: 'photo-1484154218962-a197022b5858' },
    { name: 'Amazon Echo Dot', price: 4499, category: 'Home', imgId: 'photo-1583394838336-acd977736f90' },
    { name: 'Kent RO Purifier', price: 18500, category: 'Home', imgId: 'photo-1484154218962-a197022b5858' },
    { name: 'Prestige Cooktop', price: 3499, category: 'Home', imgId: 'photo-1556910103-1c02745aae4d' },
    { name: 'Milton Steel Bottle', price: 999, category: 'Home', imgId: 'photo-1523362628745-0c100150b504' },
  ];

  const allProducts = Array.from({ length: 60 }).map((_, i) => {
    const source = sourceProducts[i % sourceProducts.length];
    const variationNum = Math.floor(i / sourceProducts.length) + 1;
    const variationPrice = variationNum === 1 ? source.price : Math.max(200, source.price + (variationNum * 500 * (i % 2 === 0 ? 1 : -1)));

    return {
      name: variationNum === 1 ? source.name : `${source.name} (V${variationNum})`,
      description: `Premium ${source.name} designed for superior performance.`,
      price: variationPrice,
      stock: 100,
      category: source.category,
      imageUrls: [`https://images.unsplash.com/${source.imgId}?auto=format&fit=crop&w=800&q=80`],
      specifications: { "Brand": source.name.split(' ')[0], "Edition": "2026" }
    };
  });

  for (const product of allProducts) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log(`Seeded 60 products with fixed bottle and laptop images.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
