import { Restaurant, MenuItem } from './types';

export const RESTAURANTS: Restaurant[] = [
  {
    id: 'r1',
    name: 'Burger King',
    cuisine: ['American', 'Fast Food'],
    rating: 4.2,
    deliveryTime: '25-30 mins',
    priceForTwo: '₹350 for two',
    image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    offers: ['20% OFF', 'Free Delivery'],
    address: '123 Main St, Downtown'
  },
  {
    id: 'r2',
    name: 'Sushi Zen',
    cuisine: ['Japanese', 'Asian'],
    rating: 4.8,
    deliveryTime: '35-45 mins',
    priceForTwo: '₹1200 for two',
    image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    offers: ['Free Miso Soup'],
    address: '456 Oak Ave, Uptown'
  },
  {
    id: 'r3',
    name: 'La Pizzeria',
    cuisine: ['Italian', 'Pizza'],
    rating: 4.5,
    deliveryTime: '30-40 mins',
    priceForTwo: '₹600 for two',
    image: 'https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    offers: ['10% OFF'],
    address: '789 Pine Ln, Westside'
  },
  {
    id: 'r4',
    name: 'Spice Route',
    cuisine: ['Indian', 'Curry'],
    rating: 4.6,
    deliveryTime: '30-40 mins',
    priceForTwo: '₹800 for two',
    image: 'https://images.unsplash.com/photo-1517244683847-7456b63c5969?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    offers: ['Buy 1 Get 1'],
    address: '101 Spice Blvd, Eastside'
  },
    {
    id: 'r5',
    name: 'Green Bowl',
    cuisine: ['Healthy', 'Salads'],
    rating: 4.9,
    deliveryTime: '15-25 mins',
    priceForTwo: '₹450 for two',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    offers: ['Healthy Choice'],
    address: '202 Green Way, Parkside'
  },
  {
    id: 'r6',
    name: 'Curry Leaf Express',
    cuisine: ['Indian', 'Street Food'],
    rating: 4.4,
    deliveryTime: '20-30 mins',
    priceForTwo: '₹500 for two',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    offers: ['Late Night Favorites'],
    address: '44 Station Road, Central'
  },
  {
    id: 'r7',
    name: 'Cloud Nine Desserts',
    cuisine: ['Desserts', 'Bakery'],
    rating: 4.7,
    deliveryTime: '15-20 mins',
    priceForTwo: '₹300 for two',
    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    offers: ['Sweet Treats'],
    address: '17 Baker Street, Midtown'
  }
];

export const MENU_ITEMS: MenuItem[] = [
  // Burger King
  { id: 'm1', restaurantId: 'r1', name: 'Whopper Classic', description: 'Flame-grilled beef patty, topped with tomatoes, fresh cut lettuce, mayo, pickles, a swirl of ketchup, and sliced white onions.', price: 249, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', isVeg: false, rating: 4.5, votes: 120, category: 'Burgers' },
  { id: 'm2', restaurantId: 'r1', name: 'Chicken Royale', description: 'Crispy chicken breast with lettuce and mayo on a sesame seed bun.', price: 199, image: 'https://images.unsplash.com/photo-1619250907534-14b868a25c27?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', isVeg: false, rating: 4.3, votes: 90, category: 'Burgers' },
  { id: 'm3', restaurantId: 'r1', name: 'Veggie Bean Burger', description: 'A crispy bean patty topped with fresh lettuce, tomatoes and vegan mayo.', price: 129, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', isVeg: true, rating: 4.0, votes: 50, category: 'Vegetarian' },
  
  // Sushi Zen
  { id: 'm4', restaurantId: 'r2', name: 'Spicy Tuna Roll', description: 'Fresh tuna, spicy mayo, cucumber, sesame seeds.', price: 449, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', isVeg: false, rating: 4.8, votes: 200, category: 'Rolls' },
  { id: 'm5', restaurantId: 'r2', name: 'Salmon Nigiri (2pcs)', description: 'Fresh salmon slice over seasoned rice.', price: 299, image: 'https://images.unsplash.com/photo-1633504178307-e83713d6a690?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', isVeg: false, rating: 4.9, votes: 150, category: 'Nigiri' },
  { id: 'm6', restaurantId: 'r2', name: 'Avocado Roll', description: 'Fresh avocado, sesame seeds.', price: 249, image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', isVeg: true, rating: 4.6, votes: 80, category: 'Vegetarian' },

  // La Pizzeria
  { id: 'm7', restaurantId: 'r3', name: 'Margherita', description: 'Tomato sauce, fresh mozzarella, basil.', price: 399, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', isVeg: true, rating: 4.7, votes: 300, category: 'Pizza' },
  { id: 'm8', restaurantId: 'r3', name: 'Pepperoni Feast', description: 'Loaded with pepperoni and mozzarella cheese.', price: 499, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', isVeg: false, rating: 4.6, votes: 250, category: 'Pizza' },
  
  // Spice Route
  { id: 'm9', restaurantId: 'r4', name: 'Butter Chicken', description: 'Tender chicken in a rich tomato and butter sauce.', price: 389, image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', isVeg: false, rating: 4.9, votes: 400, category: 'Curry' },
  { id: 'm10', restaurantId: 'r4', name: 'Paneer Tikka Masala', description: 'Grilled paneer cubes in a spicy gravy.', price: 349, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', isVeg: true, rating: 4.7, votes: 180, category: 'Curry' },
  { id: 'm11', restaurantId: 'r4', name: 'Garlic Naan', description: 'Oven-baked flatbread topped with garlic butter.', price: 60, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', isVeg: true, rating: 4.5, votes: 500, category: 'Breads' },

  // Green Bowl
  { id: 'm12', restaurantId: 'r5', name: 'Quinoa Power Bowl', description: 'Quinoa, avocado, kale, chickpeas, lemon dressing.', price: 289, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', isVeg: true, rating: 4.8, votes: 110, category: 'Bowls' },
  // Curry Leaf Express
  { id: 'm13', restaurantId: 'r6', name: 'Chole Bhature', description: 'Puffed bhature served with spicy chickpea curry and pickled onions.', price: 219, image: 'https://images.unsplash.com/photo-1626132647523-66fcf5a33631?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', isVeg: true, rating: 4.5, votes: 140, category: 'Street Food' },
  { id: 'm14', restaurantId: 'r6', name: 'Kathi Roll', description: 'Flaky paratha rolled with spiced filling and mint chutney.', price: 179, image: 'https://images.unsplash.com/photo-1567188040759-8a4a7d1f7e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', isVeg: false, rating: 4.4, votes: 96, category: 'Street Food' },
  // Cloud Nine Desserts
  { id: 'm15', restaurantId: 'r7', name: 'Chocolate Lava Cake', description: 'Warm cake with a molten chocolate center and vanilla ice cream.', price: 249, image: 'https://images.unsplash.com/photo-1562440499-64c9a111f713?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', isVeg: true, rating: 4.9, votes: 210, category: 'Desserts' },
  { id: 'm16', restaurantId: 'r7', name: 'Biscoff Cheesecake', description: 'Creamy cheesecake with a buttery biscuit base and caramel drizzle.', price: 269, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', isVeg: true, rating: 4.8, votes: 175, category: 'Desserts' },
];