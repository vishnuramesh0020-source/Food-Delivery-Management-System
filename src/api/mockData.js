// Fallback mock recipes for reliable offline / network failure resilience

export const FALLBACK_RECIPES = [
  {
    id: 1,
    name: "Classic Margherita Pizza",
    ingredients: [
      "Pizza dough",
      "San Marzano tomato sauce",
      "Fresh mozzarella cheese",
      "Fresh basil leaves",
      "Extra virgin olive oil",
      "Sea salt and cracked pepper"
    ],
    instructions: [
      "Preheat the oven to 475°F (245°C).",
      "Roll out the hand-tossed dough and spread signature tomato sauce.",
      "Top with slices of fresh mozzarella and fresh basil leaves.",
      "Drizzle with cold-pressed olive oil.",
      "Bake until cheese is bubbly and crust has golden spots."
    ],
    prepTimeMinutes: 20,
    cookTimeMinutes: 15,
    servings: 4,
    difficulty: "Easy",
    cuisine: "Italian",
    caloriesPerServing: 300,
    tags: ["Pizza", "Italian", "Vegetarian"],
    image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=800&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewCount: 142,
    mealType: ["Dinner", "Lunch"]
  },
  {
    id: 2,
    name: "Signature Gourmet Wagyu Burger",
    ingredients: [
      "Prime Wagyu beef patty",
      "Brioche bun",
      "Caramelized shallots",
      "Aged sharp cheddar",
      "Crisp butter lettuce",
      "House secret truffle aioli"
    ],
    instructions: [
      "Sear the Wagyu patty on cast iron skillet for 3 minutes per side.",
      "Melt sharp cheddar cheese over the hot patty.",
      "Lightly toast brioche bun with garlic butter.",
      "Layer lettuce, caramelized shallots, juicy patty, and truffle aioli."
    ],
    prepTimeMinutes: 15,
    cookTimeMinutes: 10,
    servings: 2,
    difficulty: "Medium",
    cuisine: "American",
    caloriesPerServing: 550,
    tags: ["Burger", "American", "Beef"],
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewCount: 230,
    mealType: ["Lunch", "Dinner"]
  },
  {
    id: 3,
    name: "Crispy Golden Chicken Tacos",
    ingredients: [
      "Shredded chipotle chicken",
      "Warm corn tortillas",
      "Fresh pico de gallo",
      "Creamy guacamole",
      "Cotija cheese crumbles",
      "Lime wedges"
    ],
    instructions: [
      "Season chicken with smoked paprika, cumin, and lime.",
      "Grill corn tortillas over open flame until toasted.",
      "Assemble with chicken, avocado mash, and fresh cilantro.",
      "Sprinkle with cotija cheese and squeeze fresh lime."
    ],
    prepTimeMinutes: 20,
    cookTimeMinutes: 15,
    servings: 3,
    difficulty: "Easy",
    cuisine: "Mexican",
    caloriesPerServing: 380,
    tags: ["Tacos", "Mexican", "Chicken"],
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=80",
    rating: 4.7,
    reviewCount: 95,
    mealType: ["Dinner"]
  },
  {
    id: 4,
    name: "Authentic Tonkotsu Ramen Bowl",
    ingredients: [
      "Rich 12-hour pork bone broth",
      "Springy ramen noodles",
      "Tender chashu pork belly",
      "Marinated soft-boiled ajitsuke egg",
      "Nori seaweed sheets",
      "Scallions and black garlic oil"
    ],
    instructions: [
      "Boil ramen noodles to firm al dente texture.",
      "Ladle piping hot rich tonkotsu broth into preheated bowl.",
      "Fold in noodles and gently drape chashu slices.",
      "Garnish with sliced egg, nori sheet, and scallions."
    ],
    prepTimeMinutes: 25,
    cookTimeMinutes: 30,
    servings: 2,
    difficulty: "Hard",
    cuisine: "Asian",
    caloriesPerServing: 620,
    tags: ["Ramen", "Asian", "Soup"],
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewCount: 310,
    mealType: ["Dinner"]
  },
  {
    id: 5,
    name: "Fresh Mediterranean Salmon Bowl",
    ingredients: [
      "Pan-seared Atlantic salmon",
      "Fluffy organic quinoa",
      "Crisp Persian cucumbers",
      "Kalamata olives",
      "Cherry tomatoes",
      "Lemon herb tahini dressing"
    ],
    instructions: [
      "Sear salmon fillet with olive oil and oregano for 4 minutes each side.",
      "Cook quinoa and fluff with fork.",
      "Arrange vegetables, olives, and salmon nicely in a bowl.",
      "Drizzle with lemon herb tahini dressing."
    ],
    prepTimeMinutes: 15,
    cookTimeMinutes: 12,
    servings: 2,
    difficulty: "Easy",
    cuisine: "Mediterranean",
    caloriesPerServing: 420,
    tags: ["Healthy", "Salmon", "Gluten-Free"],
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
    rating: 4.6,
    reviewCount: 88,
    mealType: ["Lunch"]
  },
  {
    id: 6,
    name: "Creamy Fettuccine Alfredo",
    ingredients: [
      "Fresh fettuccine pasta",
      "Heavy cream",
      "Sweet butter",
      "Aged Parmigiano-Reggiano",
      "Minced fresh garlic",
      "Freshly grated nutmeg"
    ],
    instructions: [
      "Cook fettuccine in salted water until al dente.",
      "Melt butter and garlic in a skillet, then whisk in heavy cream.",
      "Fold in grated Parmigiano-Reggiano until sauce is velvety.",
      "Toss hot pasta with the sauce and finish with black pepper."
    ],
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    servings: 3,
    difficulty: "Easy",
    cuisine: "Italian",
    caloriesPerServing: 480,
    tags: ["Pasta", "Italian", "Vegetarian"],
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=800&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewCount: 167,
    mealType: ["Dinner"]
  },
  {
    id: 7,
    name: "Butter Chicken with Garlic Naan",
    ingredients: [
      "Marinated grilled chicken thighs",
      "Creamy spiced tomato makhani sauce",
      "Freshly baked garlic butter naan",
      "Basmati saffron rice",
      "Kasuri methi (fenugreek)",
      "Heavy cream swirl"
    ],
    instructions: [
      "Grill tandoori seasoned chicken pieces until slightly charred.",
      "Simmer in slow-cooked tomato, butter, and cashew gravy.",
      "Finish with cream, butter, and crushed fenugreek leaves.",
      "Serve piping hot with oven-fresh garlic naan."
    ],
    prepTimeMinutes: 25,
    cookTimeMinutes: 30,
    servings: 4,
    difficulty: "Medium",
    cuisine: "Indian",
    caloriesPerServing: 590,
    tags: ["Curry", "Indian", "Chicken"],
    image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewCount: 420,
    mealType: ["Dinner"]
  },
  {
    id: 8,
    name: "Decadent Molten Lava Chocolate Cake",
    ingredients: [
      "Valrhona 70% dark chocolate",
      "Unsalted butter",
      "Organic eggs and yolk",
      "Cane sugar",
      "Flour pinch",
      "Vanilla bean ice cream scoop"
    ],
    instructions: [
      "Melt dark chocolate and butter over water bath.",
      "Whisk eggs with sugar until pale and frothy.",
      "Fold together and bake in buttered ramekins at 425°F for 12 minutes.",
      "Invert onto dessert plate and dust with confectioners sugar."
    ],
    prepTimeMinutes: 15,
    cookTimeMinutes: 12,
    servings: 2,
    difficulty: "Medium",
    cuisine: "Dessert",
    caloriesPerServing: 450,
    tags: ["Dessert", "Chocolate", "Sweet"],
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewCount: 380,
    mealType: ["Dessert", "Snack"]
  }
];
