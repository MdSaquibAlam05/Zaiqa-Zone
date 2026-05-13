// require('dotenv').config({ path: __dirname + '/../.env' });
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const Dish = require('./models/Dish');
// const User = require('./models/User');

// // =============================================
// // 50 HIGH QUALITY DISHES WITH REAL IMAGES
// // =============================================
// const dishes = [
//   // ============ NORTH INDIAN (10) ============
//   {
//     name: "Butter Chicken",
//     description: "Creamy tomato-based chicken curry with butter and aromatic spices",
//     price: 350,
//     category: "North Indian",
//     type: "non-veg",
//     restaurant: "Punjab Grill",
//     rating: 4.5,
//     prepTime: "25 min",
//     isPopular: true,
//     image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&q=80"
//   },
//   {
//     name: "Dal Makhani",
//     description: "Slow-cooked black lentils in rich creamy gravy",
//     price: 220,
//     category: "North Indian",
//     type: "veg",
//     restaurant: "Punjab Grill",
//     rating: 4.3,
//     prepTime: "30 min",
//     image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80"
//   },
//   {
//     name: "Paneer Tikka",
//     description: "Charcoal-grilled cottage cheese marinated in tandoori spices",
//     price: 280,
//     category: "North Indian",
//     type: "veg",
//     restaurant: "Punjab Grill",
//     rating: 4.6,
//     prepTime: "20 min",
//     isPopular: true,
//     image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&q=80"
//   },
//   {
//     name: "Chicken Tikka",
//     description: "Spicy grilled chicken pieces marinated in yogurt and spices",
//     price: 300,
//     category: "North Indian",
//     type: "non-veg",
//     restaurant: "Punjab Grill",
//     rating: 4.4,
//     prepTime: "25 min",
//     image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&q=80"
//   },
//   {
//     name: "Palak Paneer",
//     description: "Fresh cottage cheese cubes in smooth spinach gravy",
//     price: 240,
//     category: "North Indian",
//     type: "veg",
//     restaurant: "Punjab Grill",
//     rating: 4.2,
//     prepTime: "25 min",
//     image: "https://images.unsplash.com/photo-1618449840665-9ed506d73a34?w=800&q=80"
//   },
//   {
//     name: "Butter Naan",
//     description: "Soft and fluffy tandoor-baked bread brushed with butter",
//     price: 45,
//     category: "North Indian",
//     type: "veg",
//     restaurant: "Punjab Grill",
//     rating: 4.1,
//     prepTime: "10 min",
//     image: "https://images.unsplash.com/photo-1626200419199-391ae4be7b06?w=800&q=80"
//   },
//   {
//     name: "Chicken Biryani",
//     description: "Fragrant basmati rice layered with spiced chicken, slow-cooked dum style",
//     price: 320,
//     category: "North Indian",
//     type: "non-veg",
//     restaurant: "Biryani House",
//     rating: 4.7,
//     prepTime: "35 min",
//     isPopular: true,
//     image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80"
//   },
//   {
//     name: "Chole Bhature",
//     description: "Spicy chickpea curry served with fluffy deep-fried bread",
//     price: 150,
//     category: "North Indian",
//     type: "veg",
//     restaurant: "Haldiram's",
//     rating: 4.5,
//     prepTime: "20 min",
//     isPopular: true,
//     image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=800&q=80"
//   },
//   {
//     name: "Rajma Chawal",
//     description: "Kidney beans in thick tomato gravy served with steamed rice",
//     price: 180,
//     category: "North Indian",
//     type: "veg",
//     restaurant: "Haldiram's",
//     rating: 4.3,
//     prepTime: "20 min",
//     image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80"
//   },
//   {
//     name: "Kadai Paneer",
//     description: "Cottage cheese and bell peppers in spicy tomato-onion gravy",
//     price: 260,
//     category: "North Indian",
//     type: "veg",
//     restaurant: "Punjab Grill",
//     rating: 4.4,
//     prepTime: "25 min",
//     image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&q=80"
//   },

//   // ============ SOUTH INDIAN (8) ============
//   {
//     name: "Masala Dosa",
//     description: "Crispy golden rice crepe filled with spiced potato filling",
//     price: 180,
//     category: "South Indian",
//     type: "veg",
//     restaurant: "Sagar Ratna",
//     rating: 4.6,
//     prepTime: "15 min",
//     isPopular: true,
//     image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=800&q=80"
//   },
//   {
//     name: "Idli Sambhar",
//     description: "Steamed rice cakes served with lentil soup and coconut chutney",
//     price: 120,
//     category: "South Indian",
//     type: "veg",
//     restaurant: "Sagar Ratna",
//     rating: 4.4,
//     prepTime: "12 min",
//     image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&q=80"
//   },
//   {
//     name: "Medu Vada",
//     description: "Crispy lentil donuts, golden outside and soft inside",
//     price: 100,
//     category: "South Indian",
//     type: "veg",
//     restaurant: "Sagar Ratna",
//     rating: 4.3,
//     prepTime: "10 min",
//     image: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=800&q=80"
//   },
//   {
//     name: "Onion Uttapam",
//     description: "Thick rice pancake topped with onions, tomatoes and green chillies",
//     price: 160,
//     category: "South Indian",
//     type: "veg",
//     restaurant: "Sagar Ratna",
//     rating: 4.2,
//     prepTime: "18 min",
//     image: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=800&q=80"
//   },
//   {
//     name: "Rava Dosa",
//     description: "Extra crispy semolina crepe with golden lacy edges",
//     price: 190,
//     category: "South Indian",
//     type: "veg",
//     restaurant: "Sagar Ratna",
//     rating: 4.1,
//     prepTime: "15 min",
//     image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=800&q=80"
//   },
//   {
//     name: "Lemon Rice",
//     description: "Tangy lemon-flavored rice with peanuts and curry leaves",
//     price: 140,
//     category: "South Indian",
//     type: "veg",
//     restaurant: "Sagar Ratna",
//     rating: 4.0,
//     prepTime: "12 min",
//     image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80"
//   },
//   {
//     name: "Curd Rice",
//     description: "Cooling yogurt rice tempered with mustard seeds and ginger",
//     price: 130,
//     category: "South Indian",
//     type: "veg",
//     restaurant: "Sagar Ratna",
//     rating: 4.2,
//     prepTime: "10 min",
//     image: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=800&q=80"
//   },
//   {
//     name: "Filter Coffee",
//     description: "Traditional South Indian filter coffee, strong and frothy",
//     price: 80,
//     category: "South Indian",
//     type: "veg",
//     restaurant: "Sagar Ratna",
//     rating: 4.5,
//     prepTime: "5 min",
//     image: "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=800&q=80"
//   },

//   // ============ CHINESE (8) ============
//   {
//     name: "Gobi Manchurian",
//     description: "Crispy cauliflower florets in spicy, tangy Manchurian sauce",
//     price: 220,
//     category: "Chinese",
//     type: "veg",
//     restaurant: "Wow! Momos",
//     rating: 4.3,
//     prepTime: "20 min",
//     image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&q=80"
//   },
//   {
//     name: "Hakka Noodles",
//     description: "Stir-fried noodles with vegetables and soy sauce",
//     price: 200,
//     category: "Chinese",
//     type: "veg",
//     restaurant: "Wow! Momos",
//     rating: 4.4,
//     prepTime: "15 min",
//     isPopular: true,
//     image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80"
//   },
//   {
//     name: "Veg Spring Roll",
//     description: "Crispy rolls stuffed with vegetables, served with sweet chilli sauce",
//     price: 160,
//     category: "Chinese",
//     type: "veg",
//     restaurant: "Wow! Momos",
//     rating: 4.2,
//     prepTime: "15 min",
//     image: "https://images.unsplash.com/photo-1606525437816-f4470086be7f?w=800&q=80"
//   },
//   {
//     name: "Veg Fried Rice",
//     description: "Wok-tossed rice with vegetables and subtle Chinese flavors",
//     price: 180,
//     category: "Chinese",
//     type: "veg",
//     restaurant: "Wow! Momos",
//     rating: 4.1,
//     prepTime: "15 min",
//     image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&q=80"
//   },
//   {
//     name: "Chilli Chicken",
//     description: "Spicy, tangy chicken strips sautéed with bell peppers and onions",
//     price: 280,
//     category: "Chinese",
//     type: "non-veg",
//     restaurant: "Wow! Momos",
//     rating: 4.5,
//     prepTime: "25 min",
//     isPopular: true,
//     image: "https://images.unsplash.com/photo-1602670946580-3eb0bc8971c5?w=800&q=80"
//   },
//   {
//     name: "Chicken Dim Sum",
//     description: "Steamed dumplings filled with minced chicken and herbs",
//     price: 240,
//     category: "Chinese",
//     type: "non-veg",
//     restaurant: "Wow! Momos",
//     rating: 4.4,
//     prepTime: "20 min",
//     image: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=800&q=80"
//   },
//   {
//     name: "Veg Chow Mein",
//     description: "Pan-fried noodles with mixed vegetables in light soy sauce",
//     price: 190,
//     category: "Chinese",
//     type: "veg",
//     restaurant: "Wow! Momos",
//     rating: 4.0,
//     prepTime: "15 min",
//     image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80"
//   },
//   {
//     name: "Hot & Sour Soup",
//     description: "Spicy and tangy soup with vegetables and silken tofu",
//     price: 150,
//     category: "Chinese",
//     type: "veg",
//     restaurant: "Wow! Momos",
//     rating: 4.2,
//     prepTime: "15 min",
//     image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&q=80"
//   },

//   // ============ ITALIAN (8) ============
//   {
//     name: "Margherita Pizza",
//     description: "Classic pizza with fresh mozzarella, basil, and tomato sauce",
//     price: 250,
//     category: "Italian",
//     type: "veg",
//     restaurant: "Domino's",
//     rating: 4.4,
//     prepTime: "20 min",
//     isPopular: true,
//     image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80"
//   },
//   {
//     name: "Pepperoni Pizza",
//     description: "Loaded with spicy pepperoni slices and melted mozzarella cheese",
//     price: 350,
//     category: "Italian",
//     type: "non-veg",
//     restaurant: "Domino's",
//     rating: 4.5,
//     prepTime: "25 min",
//     isPopular: true,
//     image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&q=80"
//   },
//   {
//     name: "Creamy Pasta Alfredo",
//     description: "Fettuccine pasta in rich, creamy white sauce with garlic",
//     price: 260,
//     category: "Italian",
//     type: "veg",
//     restaurant: "Domino's",
//     rating: 4.3,
//     prepTime: "20 min",
//     image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80"
//   },
//   {
//     name: "Garlic Breadsticks",
//     description: "Oven-baked breadsticks with garlic butter and herbs",
//     price: 120,
//     category: "Italian",
//     type: "veg",
//     restaurant: "Domino's",
//     rating: 4.2,
//     prepTime: "10 min",
//     image: "https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=800&q=80"
//   },
//   {
//     name: "Veg Supreme Pizza",
//     description: "Loaded with bell peppers, olives, corn, onions, and mushrooms",
//     price: 320,
//     category: "Italian",
//     type: "veg",
//     restaurant: "Domino's",
//     rating: 4.3,
//     prepTime: "22 min",
//     image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80"
//   },
//   {
//     name: "BBQ Chicken Pizza",
//     description: "Tangy BBQ sauce base with grilled chicken and red onions",
//     price: 380,
//     category: "Italian",
//     type: "non-veg",
//     restaurant: "Domino's",
//     rating: 4.6,
//     prepTime: "25 min",
//     isPopular: true,
//     image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&q=80"
//   },
//   {
//     name: "Arrabiata Pasta",
//     description: "Penne pasta in spicy tomato sauce with garlic and chilli flakes",
//     price: 230,
//     category: "Italian",
//     type: "veg",
//     restaurant: "Domino's",
//     rating: 4.2,
//     prepTime: "18 min",
//     image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80"
//   },
//   {
//     name: "Veg Lasagna",
//     description: "Layered pasta with vegetables, cheese, and tomato sauce",
//     price: 300,
//     category: "Italian",
//     type: "veg",
//     restaurant: "Domino's",
//     rating: 4.3,
//     prepTime: "28 min",
//     image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80"
//   },

//   // ============ FAST FOOD (8) ============
//   {
//     name: "Classic Cheese Burger",
//     description: "Grilled veg patty with cheese, lettuce, and special sauce",
//     price: 180,
//     category: "Fast Food",
//     type: "veg",
//     restaurant: "Burger King",
//     rating: 4.2,
//     prepTime: "15 min",
//     image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80"
//   },
//   {
//     name: "Chicken Whopper",
//     description: "Flame-grilled chicken patty with fresh toppings and mayo",
//     price: 220,
//     category: "Fast Food",
//     type: "non-veg",
//     restaurant: "Burger King",
//     rating: 4.4,
//     prepTime: "18 min",
//     isPopular: true,
//     image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80"
//   },
//   {
//     name: "Crispy French Fries",
//     description: "Golden crispy fries seasoned with herbs and sea salt",
//     price: 100,
//     category: "Fast Food",
//     type: "veg",
//     restaurant: "Burger King",
//     rating: 4.1,
//     prepTime: "8 min",
//     image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&q=80"
//   },
//   {
//     name: "Veg Wrap",
//     description: "Fresh vegetables and paneer wrapped in a soft tortilla",
//     price: 150,
//     category: "Fast Food",
//     type: "veg",
//     restaurant: "Burger King",
//     rating: 4.0,
//     prepTime: "12 min",
//     image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80"
//   },
//   {
//     name: "Chicken Nuggets (6 pcs)",
//     description: "Crispy breaded chicken pieces, golden and juicy inside",
//     price: 170,
//     category: "Fast Food",
//     type: "non-veg",
//     restaurant: "Burger King",
//     rating: 4.3,
//     prepTime: "10 min",
//     image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80"
//   },
//   {
//     name: "Onion Rings",
//     description: "Crunchy battered onion rings with chipotle dip",
//     price: 120,
//     category: "Fast Food",
//     type: "veg",
//     restaurant: "Burger King",
//     rating: 4.1,
//     prepTime: "8 min",
//     image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&q=80"
//   },
//   {
//     name: "Chicken Hot Dog",
//     description: "Juicy chicken sausage in a soft bun with mustard and ketchup",
//     price: 160,
//     category: "Fast Food",
//     type: "non-veg",
//     restaurant: "Burger King",
//     rating: 4.2,
//     prepTime: "10 min",
//     image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80"
//   },
//   {
//     name: "Chocolate Milkshake",
//     description: "Thick and creamy chocolate shake topped with whipped cream",
//     price: 130,
//     category: "Fast Food",
//     type: "veg",
//     restaurant: "Burger King",
//     rating: 4.4,
//     prepTime: "5 min",
//     image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&q=80"
//   },

//   // ============ DESSERTS (8) ============
//   {
//     name: "Gulab Jamun (2 pcs)",
//     description: "Soft milk-solid dumplings soaked in rose-flavored sugar syrup",
//     price: 120,
//     category: "Desserts",
//     type: "veg",
//     restaurant: "Haldiram's",
//     rating: 4.7,
//     prepTime: "10 min",
//     isPopular: true,
//     image: "https://images.unsplash.com/photo-1666190050264-0a5fb3ea3494?w=800&q=80"
//   },
//   {
//     name: "Rasmalai",
//     description: "Soft paneer patties in sweet saffron-infused milk",
//     price: 140,
//     category: "Desserts",
//     type: "veg",
//     restaurant: "Haldiram's",
//     rating: 4.6,
//     prepTime: "8 min",
//     image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&q=80"
//   },
//   {
//     name: "Sitaphal Ice Cream",
//     description: "Natural custard apple ice cream with real fruit pieces",
//     price: 160,
//     category: "Desserts",
//     type: "veg",
//     restaurant: "Natural's Ice Cream",
//     rating: 4.8,
//     prepTime: "5 min",
//     isPopular: true,
//     image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=800&q=80"
//   },
//   {
//     name: "Chocolate Brownie",
//     description: "Warm fudgy brownie with vanilla ice cream and chocolate sauce",
//     price: 180,
//     category: "Desserts",
//     type: "veg",
//     restaurant: "Natural's Ice Cream",
//     rating: 4.5,
//     prepTime: "10 min",
//     image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=80"
//   },
//   {
//     name: "Rasgulla (2 pcs)",
//     description: "Spongy cottage cheese balls in light sugar syrup",
//     price: 100,
//     category: "Desserts",
//     type: "veg",
//     restaurant: "Haldiram's",
//     rating: 4.3,
//     prepTime: "5 min",
//     image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&q=80"
//   },
//   {
//     name: "Malai Kulfi",
//     description: "Traditional Indian frozen dessert with cardamom and pistachios",
//     price: 90,
//     category: "Desserts",
//     type: "veg",
//     restaurant: "Natural's Ice Cream",
//     rating: 4.5,
//     prepTime: "5 min",
//     image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=800&q=80"
//   },
//   {
//     name: "Crispy Jalebi",
//     description: "Deep-fried batter spirals soaked in saffron sugar syrup",
//     price: 80,
//     category: "Desserts",
//     type: "veg",
//     restaurant: "Haldiram's",
//     rating: 4.4,
//     prepTime: "8 min",
//     image: "https://images.unsplash.com/photo-1666190050264-0a5fb3ea3494?w=800&q=80"
//   },
//   {
//     name: "Fruit Custard",
//     description: "Creamy custard with fresh seasonal fruits and nuts",
//     price: 130,
//     category: "Desserts",
//     type: "veg",
//     restaurant: "Natural's Ice Cream",
//     rating: 4.2,
//     prepTime: "10 min",
//     image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=800&q=80"
//   }
// ];

// // =============================================
// // SEED FUNCTION
// // =============================================
// const seedDB = async () => {
//   try {
//     console.log('🔌 Connecting to MongoDB Atlas...');
//     await mongoose.connect(process.env.MONGODB_URI);
//     console.log(' Connected!');

//     // Clear old data
//     console.log('  Clearing old data...');
//     await Dish.deleteMany({});
//     await User.deleteMany({ role: 'admin' });

//     // Insert 50 dishes
//     console.log('  Inserting 50 dishes...');
//     await Dish.insertMany(dishes);
//     console.log(` ${dishes.length} dishes inserted!`);

//     // Create admin user
//     // console.log(' Creating admin...');
//     // await User.create({
//     //   name: 'Admin',
//     //   email: 'admin@zaiqazone.com',
//     //   password: 'admin123',
//     //   phone: '9999999999',
//     //   role: 'admin'
//     // });
//     // console.log(' Admin created!');
//     // console.log('    admin@zaiqazone.com');
//     // console.log('    admin123');

//     console.log('\n SEED COMPLETE!');
//     console.log(' 50 Dishes + 1 Admin\n');
    
//     mongoose.connection.close();
//     process.exit(0);
//   } catch (error) {
//     console.error(' Error:', error.message);
//     process.exit(1);
//   }
// };

// seedDB();