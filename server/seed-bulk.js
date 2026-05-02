const http = require('http');

const API_HOST = 'localhost';
const API_PORT = 3000;
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'admin123';

function request(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname: API_HOST,
      port: API_PORT,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {})
      }
    };
    const req = http.request(options, (res) => {
      let chunks = '';
      res.on('data', (c) => (chunks += c));
      res.on('end', () => {
        try {
          const parsed = chunks ? JSON.parse(chunks) : {};
          if (res.statusCode >= 400) reject(new Error(`${method} ${path}: ${res.statusCode} ${chunks}`));
          else resolve(parsed);
        } catch (e) {
          if (res.statusCode < 400) resolve({});
          else reject(e);
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function product(name, description, basePrice, images, features, specs) {
  const originalPrice = +(basePrice * (1 + Math.random() * 0.3 + 0.1)).toFixed(2);
  const discount = Math.round(((originalPrice - basePrice) / originalPrice) * 100);
  return {
    name,
    description,
    price: basePrice,
    originalPrice,
    discount,
    images,
    stock: rand(15, 120),
    rating: +(3.8 + Math.random() * 1.2).toFixed(1),
    reviews: rand(20, 320),
    features,
    specifications: specs
  };
}

const IMAGES = {
  sports: [
    'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=500',
    'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=500',
    'https://images.pexels.com/photos/2294361/pexels-photo-2294361.jpeg?auto=compress&cs=tinysrgb&w=500',
    'https://images.pexels.com/photos/416809/pexels-photo-416809.jpeg?auto=compress&cs=tinysrgb&w=500'
  ],
  books: [
    'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=500',
    'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=500',
    'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=500',
    'https://images.pexels.com/photos/261763/pexels-photo-261763.jpeg?auto=compress&cs=tinysrgb&w=500'
  ],
  beauty: [
    'https://images.pexels.com/photos/2536965/pexels-photo-2536965.jpeg?auto=compress&cs=tinysrgb&w=500',
    'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=500',
    'https://images.pexels.com/photos/2113855/pexels-photo-2113855.jpeg?auto=compress&cs=tinysrgb&w=500',
    'https://images.pexels.com/photos/2697787/pexels-photo-2697787.jpeg?auto=compress&cs=tinysrgb&w=500'
  ],
  toys: [
    'https://images.pexels.com/photos/163696/toy-car-toy-box-mini-163696.jpeg?auto=compress&cs=tinysrgb&w=500',
    'https://images.pexels.com/photos/1007025/pexels-photo-1007025.jpeg?auto=compress&cs=tinysrgb&w=500',
    'https://images.pexels.com/photos/42230/children-studying-togetherness-little-girl-42230.jpeg?auto=compress&cs=tinysrgb&w=500',
    'https://images.pexels.com/photos/163696/toy-car-toy-box-mini-163696.jpeg?auto=compress&cs=tinysrgb&w=500'
  ],
  kitchen: [
    'https://images.pexels.com/photos/2284166/pexels-photo-2284166.jpeg?auto=compress&cs=tinysrgb&w=500',
    'https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg?auto=compress&cs=tinysrgb&w=500',
    'https://images.pexels.com/photos/1813466/pexels-photo-1813466.jpeg?auto=compress&cs=tinysrgb&w=500',
    'https://images.pexels.com/photos/3872433/pexels-photo-3872433.jpeg?auto=compress&cs=tinysrgb&w=500'
  ]
};

function pickImages(pool) {
  const a = pool[rand(0, pool.length - 1)];
  const b = pool[rand(0, pool.length - 1)];
  return [a, b];
}

const CATEGORIES = [
  {
    name: 'Sports & Fitness',
    description: 'Gear, apparel, and accessories to keep you active.',
    image: IMAGES.sports[0],
    products: [
      ['Yoga Mat Pro', 'Non-slip premium yoga mat with carrying strap.', 29.99, ['Non-slip surface', 'Eco-friendly', '6mm thick'], { material: 'TPE', thickness: '6mm', weight: '1.2kg' }],
      ['Adjustable Dumbbells Set', 'Space-saving adjustable dumbbells up to 52.5 lbs.', 149.99, ['Adjustable weight', 'Compact design', 'Dial selector'], { range: '5-52.5 lbs', pieces: '2', material: 'Steel' }],
      ['Resistance Bands Kit', 'Full-body workout resistance bands set of 5.', 24.99, ['5 resistance levels', 'Door anchor', 'Carrying bag'], { pieces: '5', material: 'Latex', load: 'Up to 150 lbs' }],
      ['High-Density Foam Roller', 'Deep-tissue foam roller for muscle recovery.', 19.99, ['High density', '13-inch length', 'Textured grid'], { length: '13 in', material: 'EPP foam', use: 'Recovery' }],
      ['Running Shoes Elite', 'Lightweight running shoes with responsive cushioning.', 89.99, ['Breathable mesh', 'Shock absorbing', 'Lightweight'], { weight: '260g', drop: '8mm', use: 'Road running' }],
      ['Fitness Tracker Band', 'Track steps, heart rate, sleep and workouts.', 59.99, ['Heart rate monitor', 'Sleep tracking', 'Waterproof'], { battery: '7 days', waterRating: '5ATM', display: '0.96 OLED' }],
      ['Boxing Gloves Pro', 'Pro-grade boxing gloves with wrist support.', 39.99, ['Padded knuckles', 'Breathable lining', 'Wrist strap'], { weight: '12 oz', material: 'Synthetic leather', use: 'Training' }],
      ['Jump Rope Speed', 'Adjustable speed jump rope with ball bearings.', 14.99, ['Ball bearings', 'Adjustable length', 'Non-slip grip'], { length: '10 ft', material: 'Steel + PVC', type: 'Speed' }],
      ['Insulated Water Bottle', 'Stainless steel water bottle keeps drinks cold 24h.', 24.99, ['24h cold / 12h hot', 'Leak-proof', 'BPA-free'], { capacity: '32 oz', material: 'Stainless steel', color: 'Matte black' }],
      ['Gym Training Gloves', 'Grip-enhancing gym gloves with padded palms.', 17.99, ['Padded palms', 'Breathable', 'Wrist wrap'], { material: 'Synthetic + mesh', sizes: 'S/M/L/XL' }]
    ]
  },
  {
    name: 'Books & Stationery',
    description: 'Notebooks, pens, and essentials for readers and writers.',
    image: IMAGES.books[0],
    products: [
      ['Leather Notebook A5', 'Handcrafted leather-bound ruled notebook.', 19.99, ['Genuine leather', '160 pages', 'A5 size'], { pages: '160', size: 'A5', cover: 'Leather' }],
      ['Fountain Pen Premium', 'Smooth-writing fountain pen with converter.', 49.99, ['Stainless steel nib', 'Brass body', 'Gift box'], { nib: 'Medium', material: 'Brass', ink: 'Cartridge + converter' }],
      ['Mechanical Pencil Set', 'Precision mechanical pencils with HB leads.', 12.99, ['0.5mm & 0.7mm', 'Refillable', 'Ergonomic grip'], { sizes: '0.5mm, 0.7mm', pieces: '3', material: 'Aluminum' }],
      ['Classic Novels Bundle', 'Five hardcover classics in a beautiful set.', 34.99, ['Hardcover', 'Acid-free paper', 'Ribbon bookmark'], { books: '5', format: 'Hardcover', language: 'English' }],
      ['Mindfulness Journal', 'Guided daily journal for gratitude and focus.', 15.99, ['Daily prompts', '90 days', 'Linen hardcover'], { pages: '180', format: 'Hardcover', duration: '90 days' }],
      ['Planner 2026 Executive', 'Weekly + monthly planner with goal tracker.', 22.99, ['Weekly + monthly', 'Goal tracker', 'Pen loop'], { year: '2026', size: 'B5', pages: '320' }],
      ['Art Sketchbook', 'Mixed-media sketchbook with heavy paper.', 14.99, ['160gsm paper', 'Lay-flat binding', '100 sheets'], { pages: '100', weight: '160gsm', binding: 'Spiral' }],
      ['Desk Organizer', 'Wooden desk organizer with 6 compartments.', 27.99, ['6 compartments', 'Bamboo finish', 'Pen holder'], { material: 'Bamboo', compartments: '6', color: 'Natural' }],
      ['Highlighter Pastel Set', 'Pastel highlighter set of 10 colors.', 8.99, ['10 pastel colors', 'Quick drying', 'Chisel tip'], { count: '10', tip: 'Chisel', type: 'Pastel' }],
      ['Bookends Marble Set', 'Elegant marble bookends for heavy volumes.', 19.99, ['Genuine marble', 'Non-slip pads', 'Heavy-duty'], { material: 'Marble', pair: '2', weight: '3 kg' }]
    ]
  },
  {
    name: 'Beauty & Personal Care',
    description: 'Skincare, makeup, and grooming essentials.',
    image: IMAGES.beauty[0],
    products: [
      ['Gentle Facial Cleanser', 'Sulfate-free cleanser for all skin types.', 18.99, ['Sulfate-free', 'Hydrating', 'All skin types'], { volume: '200ml', type: 'Gel', ph: '5.5' }],
      ['Vitamin C Serum', 'Brightening serum with 20% vitamin C.', 29.99, ['20% Vitamin C', 'Antioxidant', 'Brightening'], { volume: '30ml', concentration: '20%', type: 'Serum' }],
      ['Hydrating Night Cream', 'Rich moisturizing cream with hyaluronic acid.', 24.99, ['Hyaluronic acid', '48h hydration', 'Non-greasy'], { volume: '50ml', type: 'Cream', finish: 'Dewy' }],
      ['Velvet Lipstick Set', 'Long-lasting matte lipstick set of 5.', 39.99, ['Long-lasting', 'Matte finish', '5 shades'], { count: '5', finish: 'Matte', longevity: '12h' }],
      ['Eyeshadow Palette Nude', '18-shade nude eyeshadow palette.', 44.99, ['18 shades', 'Matte + shimmer', 'Blendable'], { shades: '18', formula: 'Pressed powder', weight: '22g' }],
      ['Signature Perfume Spray', 'Floral-woody eau de parfum 50ml.', 69.99, ['Eau de parfum', 'Long-lasting', 'Floral woody'], { volume: '50ml', concentration: 'EDP', family: 'Floral woody' }],
      ['Ceramic Hair Straightener', 'Fast-heat hair straightener with ionic tech.', 59.99, ['Ionic tech', 'Ceramic plates', 'Auto shut-off'], { heat: 'Up to 230°C', plates: 'Ceramic', tech: 'Ionic' }],
      ['Nail Polish Gift Kit', '10-piece nail polish set with remover.', 29.99, ['10 colors', 'Chip-resistant', 'Remover included'], { count: '10', type: 'Lacquer', longevity: '7 days' }],
      ['Body Lotion Shea', 'Nourishing body lotion with shea butter.', 16.99, ['Shea butter', '24h moisture', 'Fast-absorbing'], { volume: '400ml', type: 'Lotion', scent: 'Vanilla' }],
      ['Makeup Brushes Set', '15-piece professional makeup brush set.', 34.99, ['Soft synthetic hair', '15 pieces', 'Travel pouch'], { pieces: '15', material: 'Synthetic', case: 'Included' }]
    ]
  },
  {
    name: 'Toys & Games',
    description: 'Toys, games, and activities for kids of all ages.',
    image: IMAGES.toys[0],
    products: [
      ['Creative Building Blocks', '500-piece colorful building block set.', 39.99, ['500 pieces', 'Compatible', 'Storage box'], { pieces: '500', age: '4+', material: 'ABS plastic' }],
      ['RC Sports Car', 'Remote control car with 2.4GHz control.', 49.99, ['2.4GHz control', '15 mph', 'Rechargeable'], { range: '100 ft', speed: '15 mph', battery: 'Li-ion' }],
      ['Cuddly Teddy Bear', 'Ultra-soft plush teddy bear 18 inches.', 24.99, ['Ultra-soft', 'Hypoallergenic', 'Machine washable'], { height: '18 in', material: 'Plush', age: '0+' }],
      ['Family Board Game', 'Classic strategy board game for 2-6 players.', 29.99, ['2-6 players', 'Ages 10+', '60-90 min'], { players: '2-6', duration: '60-90 min', age: '10+' }],
      ['Puzzle 1000 Pieces', 'Scenic landscape puzzle with 1000 pieces.', 19.99, ['1000 pieces', 'Poster included', 'Finish 70x50cm'], { pieces: '1000', finishSize: '70x50cm', age: '14+' }],
      ['Mini Drone with Camera', 'Beginner drone with HD camera and app control.', 89.99, ['HD camera', 'App control', 'Auto hover'], { camera: '720p', flightTime: '12 min', range: '80 m' }],
      ['Superhero Action Figure', '12-inch articulated superhero figure.', 17.99, ['12 articulation points', 'Accessories', 'Collectible'], { height: '12 in', points: '12', material: 'PVC' }],
      ['Kids Play Kitchen', 'Wooden play kitchen with 20 accessories.', 79.99, ['Wooden build', '20 accessories', 'Assembly required'], { material: 'Wood + MDF', pieces: '20', age: '3+' }],
      ['Speed Cube Puzzle', 'Professional speed cube for competitions.', 9.99, ['Smooth turning', 'Anti-pop', 'Competition ready'], { size: '56mm', type: '3x3', tensioning: 'Adjustable' }],
      ['Play Dough Creative Kit', 'Modeling dough set with 20 colors and tools.', 22.99, ['20 colors', 'Molds + tools', 'Non-toxic'], { colors: '20', tools: '15', age: '3+' }]
    ]
  },
  {
    name: 'Kitchen & Dining',
    description: 'Cookware, dinnerware, and kitchen essentials.',
    image: IMAGES.kitchen[0],
    products: [
      ['Non-Stick Pan Set', '3-piece non-stick frying pan set.', 59.99, ['Non-stick', 'Cool-touch handle', 'Induction ready'], { pieces: '3', material: 'Aluminum', coating: 'Non-stick' }],
      ['Premium Knife Set', '8-piece stainless steel knife set with block.', 89.99, ['Forged steel', 'Wooden block', 'Sharpener included'], { pieces: '8', blade: 'Stainless steel', block: 'Wood' }],
      ['16-pc Dinnerware Set', 'Porcelain dinnerware set for 4 people.', 99.99, ['Dishwasher safe', 'Microwave safe', 'Chip resistant'], { pieces: '16', material: 'Porcelain', service: '4 people' }],
      ['Pro Blender 1200W', 'High-speed blender with 6 preset programs.', 79.99, ['1200W motor', '6 presets', 'BPA-free jar'], { power: '1200W', capacity: '2 L', presets: '6' }],
      ['Burr Coffee Grinder', 'Conical burr grinder with 15 grind settings.', 44.99, ['Conical burr', '15 settings', 'Quiet motor'], { settings: '15', capacity: '250g', motor: 'Quiet' }],
      ['4-Slice Toaster', 'Wide-slot toaster with 7 browning levels.', 54.99, ['7 browning levels', 'Bagel mode', 'Crumb tray'], { slots: '4', wattage: '1500W', levels: '7' }],
      ['Food Storage Set', '20-piece airtight food storage container set.', 34.99, ['Airtight lids', 'BPA-free', 'Stackable'], { pieces: '20', material: 'Plastic', type: 'Airtight' }],
      ['Crystal Wine Glasses', 'Set of 6 lead-free crystal wine glasses.', 39.99, ['Lead-free crystal', 'Long stem', 'Dishwasher safe'], { pieces: '6', material: 'Crystal', capacity: '16 oz' }],
      ['Bamboo Cutting Board', 'Large bamboo cutting board with juice groove.', 27.99, ['Bamboo', 'Juice groove', 'Reversible'], { size: '18x12 in', material: 'Bamboo', thickness: '1.5 in' }],
      ['Stand Mixer 5.5L', 'Powerful stand mixer with 10 speeds.', 199.99, ['10 speeds', '5.5L bowl', '3 attachments'], { capacity: '5.5 L', speeds: '10', power: '600W' }]
    ]
  }
];

(async () => {
  console.log('Logging in as admin...');
  const login = await request('POST', '/api/auth/login', { email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
  const token = login.token;
  console.log('Admin authenticated.');

  const [existingCategories, brands] = await Promise.all([
    request('GET', '/api/categories'),
    request('GET', '/api/brands')
  ]);

  if (!brands.length) {
    console.error('No brands found. Add at least one brand first.');
    process.exit(1);
  }

  for (const cat of CATEGORIES) {
    if (existingCategories.some((c) => c.name.toLowerCase() === cat.name.toLowerCase())) {
      console.log(`[skip] Category "${cat.name}" already exists.`);
      continue;
    }

    console.log(`\n[+] Creating category: ${cat.name}`);
    const imagePool = IMAGES[cat.name.toLowerCase().split(' ')[0]] || IMAGES.sports;
    const newCat = await request('POST', '/api/categories', {
      name: cat.name,
      description: cat.description,
      image: cat.image
    }, token);
    console.log(`    id=${newCat.id}`);

    for (const p of cat.products) {
      const [name, desc, price, features, specs] = p;
      const brand = brands[rand(0, brands.length - 1)];
      const payload = {
        ...product(name, desc, price, pickImages(imagePool), features, specs),
        categoryId: newCat.id,
        brandId: brand.id
      };
      const created = await request('POST', '/api/products', payload, token);
      console.log(`    ✓ ${name} ($${price}) → brand: ${brand.name}`);
    }
  }

  console.log('\nDone.');
})().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
