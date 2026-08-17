window.SFL_DATA = {
  meta: {
    version: "1.0.0",
    updated: "2026-08-17",
    note: "Dados principais conferidos no código público atual do Sunflower Land. Preços de mercado são editáveis porque variam constantemente."
  },

  links: [
    { label: "Jogar Sunflower Land", url: "https://sunflower-land.com/play/", kind: "game" },
    { label: "SFL.World · Flores", url: "https://sfl.world/info/flowers", kind: "source" },
    { label: "SFL.World · Pesca", url: "https://sfl.world/info/fishing/type", kind: "source" },
    { label: "SFL.World · Crafting", url: "https://sfl.world/info/crafting", kind: "source" },
    { label: "SFL.World · Cozinha", url: "https://sfl.world/info/cooking", kind: "source" },
    { label: "SFL.World · Entregas", url: "https://sfl.world/info/deliveries", kind: "source" },
    { label: "Código oficial SFL", url: "https://github.com/sunflower-land/sunflower-land", kind: "source" }
  ],

  seasons: [
    { id: "spring", label: "Primavera", icon: "🌸" },
    { id: "summer", label: "Verão", icon: "☀️" },
    { id: "autumn", label: "Outono", icon: "🍂" },
    { id: "winter", label: "Inverno", icon: "❄️" }
  ],

  flowerSeeds: [
    { name: "Sunpetal Seed", level: 13, coins: 16, days: 1, season: "all", family: "Sunpetal" },
    { name: "Bloom Seed", level: 22, coins: 32, days: 2, season: "all", family: "Bloom" },
    { name: "Lily Seed", level: 27, coins: 48, days: 5, season: "all", family: "Lily" },
    { name: "Lavender Seed", level: 35, coins: 96, days: 3, season: "spring", family: "Lavender" },
    { name: "Gladiolus Seed", level: 35, coins: 96, days: 3, season: "summer", family: "Gladiolus" },
    { name: "Clover Seed", level: 35, coins: 96, days: 3, season: "autumn", family: "Clover" },
    { name: "Edelweiss Seed", level: 35, coins: 96, days: 3, season: "winter", family: "Edelweiss" }
  ],

  flowers: [
    ...["Red Pansy","Yellow Pansy","Purple Pansy","White Pansy","Blue Pansy"].map(name => ({ name, seed: "Sunpetal Seed", family: "Pansy", season: "all", rarity: "normal" })),
    ...["Red Cosmos","Yellow Cosmos","Purple Cosmos","White Cosmos","Blue Cosmos"].map(name => ({ name, seed: "Sunpetal Seed", family: "Cosmos", season: "all", rarity: "normal" })),
    { name: "Prism Petal", seed: "Sunpetal Seed", family: "Sunpetal", season: "all", rarity: "epic" },

    ...["Red Balloon Flower","Yellow Balloon Flower","Purple Balloon Flower","White Balloon Flower","Blue Balloon Flower"].map(name => ({ name, seed: "Bloom Seed", family: "Balloon Flower", season: "all", rarity: "normal" })),
    ...["Red Daffodil","Yellow Daffodil","Purple Daffodil","White Daffodil","Blue Daffodil"].map(name => ({ name, seed: "Bloom Seed", family: "Daffodil", season: "all", rarity: "normal" })),
    { name: "Celestial Frostbloom", seed: "Bloom Seed", family: "Bloom", season: "all", rarity: "epic" },

    ...["Red Carnation","Yellow Carnation","Purple Carnation","White Carnation","Blue Carnation"].map(name => ({ name, seed: "Lily Seed", family: "Carnation", season: "all", rarity: "normal" })),
    ...["Red Lotus","Yellow Lotus","Purple Lotus","White Lotus","Blue Lotus"].map(name => ({ name, seed: "Lily Seed", family: "Lotus", season: "all", rarity: "normal" })),
    { name: "Primula Enigma", seed: "Lily Seed", family: "Lily", season: "all", rarity: "epic" },

    ...["Red Lavender","Yellow Lavender","Purple Lavender","White Lavender","Blue Lavender"].map(name => ({ name, seed: "Lavender Seed", family: "Lavender", season: "spring", rarity: "seasonal" })),
    ...["Red Gladiolus","Yellow Gladiolus","Purple Gladiolus","White Gladiolus","Blue Gladiolus"].map(name => ({ name, seed: "Gladiolus Seed", family: "Gladiolus", season: "summer", rarity: "seasonal" })),
    ...["Red Clover","Yellow Clover","Purple Clover","White Clover","Blue Clover"].map(name => ({ name, seed: "Clover Seed", family: "Clover", season: "autumn", rarity: "seasonal" })),
    ...["Red Edelweiss","Yellow Edelweiss","Purple Edelweiss","White Edelweiss","Blue Edelweiss"].map(name => ({ name, seed: "Edelweiss Seed", family: "Edelweiss", season: "winter", rarity: "seasonal" }))
  ],

  flowerCrossbreedInputs: {
    set1: [
      ["Sunflower",50],["Beetroot",10],["Cauliflower",5],["Parsnip",5],["Eggplant",5],["Radish",5],["Kale",5],["Blueberry",3],["Apple",3],["Banana",3]
    ],
    set2: [["Rhubarb",25],["Pepper",15],["Onion",10],["Artichoke",8],["Barley",5]]
  },

  fish: [
    { name:"Anchovy", type:"basic", baits:["Earthworm"], likes:["Carrot","Egg"], seasons:["spring","summer","autumn","winter"] },
    { name:"Butterflyfish", type:"basic", baits:["Earthworm"], likes:["Sunflower"], seasons:["summer","autumn"] },
    { name:"Blowfish", type:"basic", baits:["Earthworm"], likes:["Yam"], seasons:["winter"] },
    { name:"Clownfish", type:"basic", baits:["Earthworm"], likes:["Cabbage"], seasons:["summer","winter"] },
    { name:"Sea Bass", type:"basic", baits:["Earthworm"], likes:["Anchovy"], seasons:["spring","autumn"] },
    { name:"Sea Horse", type:"basic", baits:["Earthworm"], likes:["Seaweed"], seasons:["spring","summer"] },
    { name:"Horse Mackerel", type:"basic", baits:["Earthworm"], likes:["Blueberry"], seasons:["summer","winter"] },
    { name:"Halibut", type:"basic", baits:["Earthworm"], likes:["Anchovy"], seasons:["spring","autumn"] },
    { name:"Squid", type:"basic", baits:["Earthworm"], likes:["Eggplant","Onion"], seasons:["spring","winter"] },
    { name:"Porgy", type:"basic", baits:["Earthworm"], likes:["Yam"], seasons:["spring"] },
    { name:"Muskellunge", type:"basic", baits:["Earthworm"], likes:["Turnip"], seasons:["autumn"] },

    { name:"Red Snapper", type:"advanced", baits:["Grub","Red Wiggler","Fishing Lure"], likes:["Apple","Honey"], seasons:["spring","summer","autumn","winter"] },
    { name:"Moray Eel", type:"advanced", baits:["Earthworm","Grub","Fishing Lure"], likes:["Gold"], seasons:["summer","autumn"] },
    { name:"Olive Flounder", type:"advanced", baits:["Earthworm","Grub","Fishing Lure"], likes:["Rhubarb"], seasons:["spring","autumn"] },
    { name:"Napoleanfish", type:"advanced", baits:["Grub","Fishing Lure"], likes:["Carrot"], seasons:["summer","autumn"] },
    { name:"Surgeonfish", type:"advanced", baits:["Grub","Fishing Lure"], likes:["Orange"], seasons:["summer","autumn"] },
    { name:"Angelfish", type:"advanced", baits:["Grub","Fishing Lure"], likes:["Banana"], seasons:["summer","winter"] },
    { name:"Zebra Turkeyfish", type:"advanced", baits:["Grub","Fishing Lure"], likes:["Beetroot","Rhubarb"], seasons:["spring","summer"] },
    { name:"Ray", type:"advanced", baits:["Grub","Fishing Lure"], likes:["Squid"], seasons:["spring","summer"] },
    { name:"Hammerhead shark", type:"advanced", baits:["Grub","Fishing Lure"], likes:["Iron"], seasons:["summer","autumn"], difficulty:2 },
    { name:"Barred Knifejaw", type:"advanced", baits:["Grub","Fishing Lure"], likes:["Anchovy"], seasons:["spring","summer"], difficulty:3 },
    { name:"Walleye", type:"advanced", baits:["Grub"], likes:["Broccoli"], seasons:["winter"] },
    { name:"Rock Blackfish", type:"advanced", baits:["Grub"], likes:["Onion"], seasons:["autumn"] },
    { name:"Tilapia", type:"advanced", baits:["Grub"], likes:["Zucchini"], seasons:["summer"] },

    { name:"Tuna", type:"expert", baits:["Grub","Red Wiggler","Fishing Lure"], likes:["Orange","Wild Mushroom"], seasons:["spring","summer","autumn","winter"] },
    { name:"Mahi Mahi", type:"expert", baits:["Grub","Red Wiggler","Fishing Lure"], likes:["Corn"], seasons:["summer","autumn"] },
    { name:"Blue Marlin", type:"expert", baits:["Grub","Red Wiggler","Fishing Lure"], likes:["Wheat"], seasons:["summer","winter"] },
    { name:"Oarfish", type:"expert", baits:["Red Wiggler","Fishing Lure"], likes:["Kale"], seasons:["spring","winter"] },
    { name:"Football fish", type:"expert", baits:["Red Wiggler","Fishing Lure"], likes:["Sunflower"], seasons:["winter"] },
    { name:"Sunfish", type:"expert", baits:["Red Wiggler","Fishing Lure"], likes:["Anchovy"], seasons:["summer","autumn"], difficulty:2 },
    { name:"Coelacanth", type:"expert", baits:["Red Wiggler","Fishing Lure"], likes:["Cabbage"], seasons:["spring","winter"], difficulty:2 },
    { name:"Parrotfish", type:"expert", baits:["Red Wiggler","Fishing Lure"], likes:["Seaweed"], seasons:["spring","summer"] },
    { name:"Whale Shark", type:"expert", baits:["Red Wiggler","Fishing Lure"], likes:["Crab","Fat Chicken"], seasons:["summer","winter"], difficulty:3 },
    { name:"Saw Shark", type:"expert", baits:["Red Wiggler","Fishing Lure"], likes:["Red Snapper","Speed Chicken"], seasons:["spring","summer"], difficulty:4 },
    { name:"White Shark", type:"expert", baits:["Red Wiggler","Fishing Lure"], likes:["Tuna","Rich Chicken"], seasons:["summer","winter"], difficulty:4 },
    { name:"Cobia", type:"expert", baits:["Red Wiggler"], likes:["Broccoli"], seasons:["summer"] },
    { name:"Trout", type:"expert", baits:["Red Wiggler"], likes:["Pepper"], seasons:["winter"] },
    { name:"Weakfish", type:"expert", baits:["Red Wiggler"], likes:["Artichoke"], seasons:["spring"] },

    { name:"Twilight Anglerfish", type:"marine marvel", baits:["Red Wiggler","Grub","Fishing Lure"], likes:["Sunfish"], seasons:["spring","summer","autumn","winter"], difficulty:5 },
    { name:"Starlight Tuna", type:"marine marvel", baits:["Red Wiggler","Fishing Lure"], likes:["Horse Mackerel","Zebra Turkeyfish"], seasons:["spring","summer","autumn","winter"], difficulty:5 },
    { name:"Radiant Ray", type:"marine marvel", baits:["Red Wiggler","Fishing Lure"], likes:["Iron"], seasons:["spring","summer","autumn","winter"], difficulty:4 },
    { name:"Phantom Barracuda", type:"marine marvel", baits:["Grub","Fishing Lure"], likes:["Squid"], seasons:["spring","summer","autumn","winter"], difficulty:4 },
    { name:"Gilded Swordfish", type:"marine marvel", baits:["Earthworm","Red Wiggler","Fishing Lure"], likes:["Gold"], seasons:["spring","summer","autumn","winter"], difficulty:3 }
  ],

  crafting: [
    { name:"Axe", category:"Ferramentas", coins:20, ingredients:{}, stock:200, island:"basic", note:"Cortar árvores" },
    { name:"Pickaxe", category:"Ferramentas", coins:20, ingredients:{Wood:3}, stock:60, island:"basic", note:"Minerar Stone" },
    { name:"Stone Pickaxe", category:"Ferramentas", coins:20, ingredients:{Wood:3,Stone:5}, stock:20, island:"basic", note:"Minerar Iron" },
    { name:"Iron Pickaxe", category:"Ferramentas", coins:80, ingredients:{Wood:3,Iron:5}, stock:5, island:"basic", note:"Minerar Gold" },
    { name:"Gold Pickaxe", category:"Ferramentas", coins:100, ingredients:{Wood:3,Gold:3}, stock:5, island:"basic", note:"Minerar Crimstone" },
    { name:"Rod", category:"Ferramentas", coins:20, ingredients:{Wood:3,Stone:1}, stock:50, island:"basic", note:"Pesca" },
    { name:"Sand Shovel", category:"Tesouro", coins:20, ingredients:{Wood:2,Stone:1}, island:"basic", note:"Escavação" },
    { name:"Sand Drill", category:"Tesouro", coins:40, ingredients:{Oil:1,Crimstone:1,Wood:3,Leather:1}, island:"desert", note:"Escavação avançada" },
    { name:"Oil Drill", category:"Ferramentas", coins:100, ingredients:{Wood:20,Iron:9,Leather:10}, stock:5, island:"desert", note:"Extrair Oil" },
    { name:"Crab Pot", category:"Pesca", coins:250, ingredients:{Feather:5,Wool:3}, stock:15, island:"basic", note:"Armadilha aquática" },
    { name:"Mariner Pot", category:"Pesca", coins:500, ingredients:{Feather:10,"Merino Wool":10}, stock:10, island:"basic", note:"Armadilha aquática avançada" },

    { name:"Basic Scarecrow", category:"Collectibles", coins:0, ingredients:{Wood:2}, island:"basic", note:"Boost de crops" },
    { name:"Scary Mike", category:"Collectibles", coins:4800, ingredients:{Wood:30,Carrot:50,Wheat:10,Parsnip:10}, island:"basic", note:"Boost de crops" },
    { name:"Laurie the Chuckle Crow", category:"Collectibles", coins:14400, ingredients:{Wood:100,Radish:60,Kale:40,Wheat:20}, island:"basic", note:"Boost avançado de crops" },
    { name:"Bale", category:"Collectibles", coins:1600, ingredients:{Egg:200,Wheat:200,Wood:100,Stone:30}, island:"basic", note:"Boost de Egg" },
    { name:"Immortal Pear", category:"Collectibles", coins:0, ingredients:{Gold:5,Apple:10,Blueberry:10,Orange:10}, island:"basic", note:"Boost de frutas" },
    { name:"Squirrel", category:"Collectibles", coins:1000, ingredients:{Wood:100}, island:"basic", note:"Collectible permanente" },
    { name:"Iron Beetle", category:"Collectibles", coins:2000, ingredients:{Iron:20}, island:"basic", note:"+0,1 Iron por mineração" },
    { name:"Gold Beetle", category:"Collectibles", coins:10000, ingredients:{Gold:20}, island:"basic", note:"+0,1 Gold por mineração" },
    { name:"Fairy Circle", category:"Collectibles", coins:25000, ingredients:{"Wild Mushroom":20}, island:"basic", note:"Collectible permanente" },
    { name:"Macaw", category:"Collectibles", coins:10000, ingredients:{Apple:10,Blueberry:10,Orange:10,Banana:10,Tomato:10,Lemon:10}, island:"basic", note:"Boost de frutas" },
    { name:"Butterfly", category:"Collectibles", coins:15000, ingredients:{}, island:"basic", note:"20% de chance de +1 Flower" }
  ],

  recipes: [
    {name:"Mashed Potato",building:"Fire Pit",xp:3,seconds:30,ingredients:{Potato:8}},
    {name:"Pumpkin Soup",building:"Fire Pit",xp:24,seconds:180,ingredients:{Pumpkin:10}},
    {name:"Mushroom Soup",building:"Fire Pit",xp:56,seconds:600,ingredients:{"Wild Mushroom":5}},
    {name:"Bumpkin Broth",building:"Fire Pit",xp:96,seconds:1200,ingredients:{Carrot:10,Cabbage:5}},
    {name:"Boiled Eggs",building:"Fire Pit",xp:90,seconds:3600,ingredients:{Egg:10}},
    {name:"Kale Stew",building:"Fire Pit",xp:400,seconds:7200,ingredients:{Kale:10}},
    {name:"Kale Omelette",building:"Fire Pit",xp:1250,seconds:12600,ingredients:{Egg:40,Kale:5}},
    {name:"Gumbo",building:"Fire Pit",xp:600,seconds:14400,ingredients:{Potato:50,Pumpkin:30,Carrot:20,"Red Snapper":3}},
    {name:"Fried Tofu",building:"Fire Pit",xp:400,seconds:5400,ingredients:{Soybean:15,Sunflower:200}},
    {name:"Rice Bun",building:"Fire Pit",xp:2600,seconds:18000,ingredients:{Rice:2,Wheat:50}},
    {name:"Antipasto",building:"Fire Pit",xp:3000,seconds:10800,ingredients:{Olive:2,Grape:2}},
    {name:"Pizza Margherita",building:"Fire Pit",xp:25000,seconds:72000,ingredients:{Tomato:30,Cheese:5,Wheat:20},featured:true},

    {name:"Sunflower Crunch",building:"Kitchen",xp:50,seconds:600,ingredients:{Sunflower:300}},
    {name:"Mushroom Jacket Potatoes",building:"Kitchen",xp:240,seconds:600,ingredients:{"Wild Mushroom":10,Potato:5}},
    {name:"Fruit Salad",building:"Kitchen",xp:225,seconds:1800,ingredients:{Apple:1,Orange:1,Blueberry:1}},
    {name:"Pancakes",building:"Kitchen",xp:1000,seconds:3600,ingredients:{Wheat:10,Egg:10,Honey:6}},
    {name:"Roast Veggies",building:"Kitchen",xp:170,seconds:7200,ingredients:{Cauliflower:15,Carrot:10}},
    {name:"Cauliflower Burger",building:"Kitchen",xp:255,seconds:10800,ingredients:{Cauliflower:15,Wheat:5}},
    {name:"Bumpkin Salad",building:"Kitchen",xp:290,seconds:12600,ingredients:{Beetroot:20,Parsnip:10}},
    {name:"Steamed Red Rice",building:"Kitchen",xp:3000,seconds:14400,ingredients:{Rice:3,Beetroot:50}},
    {name:"Tofu Scramble",building:"Kitchen",xp:1000,seconds:10800,ingredients:{Soybean:20,Egg:20,Cauliflower:10}},
    {name:"Fried Calamari",building:"Kitchen",xp:1500,seconds:18000,ingredients:{Sunflower:200,Wheat:15,Squid:1}},
    {name:"Fish Burger",building:"Kitchen",xp:1300,seconds:7200,ingredients:{Beetroot:10,Wheat:10,"Horse Mackerel":1}},
    {name:"Fish Omelette",building:"Kitchen",xp:1500,seconds:18000,ingredients:{Egg:40,Surgeonfish:1,Butterflyfish:2}},
    {name:"Ocean's Olive",building:"Kitchen",xp:2000,seconds:7200,ingredients:{"Olive Flounder":1,Olive:2}},
    {name:"Seafood Basket",building:"Kitchen",xp:2200,seconds:18000,ingredients:{Blowfish:2,Napoleanfish:2,Sunfish:2}},
    {name:"Fish n Chips",building:"Kitchen",xp:2000,seconds:14400,ingredients:{"Fancy Fries":1,Halibut:1}},
    {name:"Sushi Roll",building:"Kitchen",xp:2000,seconds:3600,ingredients:{Angelfish:1,Seaweed:1,Rice:2}},
    {name:"Caprese Salad",building:"Kitchen",xp:6000,seconds:10800,ingredients:{Cheese:1,Tomato:25,Kale:20}},
    {name:"Spaghetti al Limone",building:"Kitchen",xp:15000,seconds:54000,ingredients:{Wheat:10,Lemon:15,Cheese:3},featured:true},

    {name:"Apple Pie",building:"Bakery",xp:720,seconds:14400,ingredients:{Apple:5,Wheat:10,Egg:20}},
    {name:"Orange Cake",building:"Bakery",xp:730,seconds:14400,ingredients:{Orange:5,Egg:30,Wheat:10}},
    {name:"Kale & Mushroom Pie",building:"Bakery",xp:720,seconds:14400,ingredients:{"Wild Mushroom":10,Kale:5,Wheat:5}},
    {name:"Sunflower Cake",building:"Bakery",xp:525,seconds:23400,ingredients:{Sunflower:1000,Wheat:10,Egg:30}},
    {name:"Honey Cake",building:"Bakery",xp:4000,seconds:28800,ingredients:{Honey:10,Wheat:10,Egg:20}},
    {name:"Potato Cake",building:"Bakery",xp:650,seconds:37800,ingredients:{Potato:500,Wheat:10,Egg:30}},
    {name:"Pumpkin Cake",building:"Bakery",xp:625,seconds:37800,ingredients:{Pumpkin:130,Wheat:10,Egg:30}},
    {name:"Carrot Cake",building:"Bakery",xp:750,seconds:46800,ingredients:{Carrot:120,Wheat:10,Egg:30}},
    {name:"Cabbage Cake",building:"Bakery",xp:860,seconds:54000,ingredients:{Cabbage:90,Wheat:10,Egg:30}},
    {name:"Beetroot Cake",building:"Bakery",xp:1250,seconds:79200,ingredients:{Beetroot:100,Wheat:10,Egg:30}},
    {name:"Cauliflower Cake",building:"Bakery",xp:1190,seconds:79200,ingredients:{Cauliflower:60,Wheat:10,Egg:30}},
    {name:"Parsnip Cake",building:"Bakery",xp:1300,seconds:86400,ingredients:{Parsnip:45,Wheat:10,Egg:30}},
    {name:"Eggplant Cake",building:"Bakery",xp:1400,seconds:86400,ingredients:{Eggplant:30,Wheat:10,Egg:30}},
    {name:"Radish Cake",building:"Bakery",xp:1200,seconds:86400,ingredients:{Radish:25,Wheat:10,Egg:30}},
    {name:"Wheat Cake",building:"Bakery",xp:1100,seconds:86400,ingredients:{Wheat:35,Egg:30}},
    {name:"Lemon Cheesecake",building:"Bakery",xp:30000,seconds:108000,ingredients:{Lemon:20,Cheese:5,Egg:40},featured:true},

    {name:"Blueberry Jam",building:"Deli",xp:500,seconds:43200,ingredients:{Blueberry:5}},
    {name:"Fermented Carrots",building:"Deli",xp:250,seconds:86400,ingredients:{Carrot:20}},
    {name:"Sauerkraut",building:"Deli",xp:500,seconds:86400,ingredients:{Cabbage:20}},
    {name:"Fancy Fries",building:"Deli",xp:1000,seconds:86400,ingredients:{Sunflower:500,Potato:500}},
    {name:"Fermented Fish",building:"Deli",xp:3000,seconds:86400,ingredients:{Tuna:6}},
    {name:"Cheese",building:"Deli",xp:1,seconds:1200,ingredients:{Milk:3}},
    {name:"Blue Cheese",building:"Deli",xp:6000,seconds:10800,ingredients:{Cheese:2,Blueberry:10}},
    {name:"Honey Cheddar",building:"Deli",xp:15000,seconds:43200,ingredients:{Cheese:3,Honey:5}},

    {name:"Purple Smoothie",building:"Smoothie Shack",xp:310,seconds:1800,ingredients:{Blueberry:5,Cabbage:10}},
    {name:"Orange Juice",building:"Smoothie Shack",xp:375,seconds:2700,ingredients:{Orange:5}},
    {name:"Apple Juice",building:"Smoothie Shack",xp:500,seconds:3600,ingredients:{Apple:5}},
    {name:"Power Smoothie",building:"Smoothie Shack",xp:775,seconds:5400,ingredients:{Blueberry:10,Kale:5}},
    {name:"Bumpkin Detox",building:"Smoothie Shack",xp:975,seconds:7200,ingredients:{Apple:5,Orange:5,Carrot:10}},
    {name:"Banana Blast",building:"Smoothie Shack",xp:1200,seconds:10800,ingredients:{Banana:10,Egg:10}},
    {name:"Grape Juice",building:"Smoothie Shack",xp:3300,seconds:10800,ingredients:{Grape:5,Radish:20}}
  ],

  deliveryNPCs: [
    {name:"Betty",id:"betty",reward:"coins",level:1,focus:"Crops / itens básicos",skill:"Betty's Friend"},
    {name:"Blacksmith",id:"blacksmith",reward:"coins",level:1,focus:"Recursos / mineração",skill:"Forge-Ward Profits"},
    {name:"Peggy",id:"peggy",reward:"coins",level:3,focus:"Pedidos variados"},
    {name:"Corale",id:"corale",reward:"coins",level:7,focus:"Peixes",skill:"Fishy Fortune"},
    {name:"Tango",id:"tango",reward:"coins",level:13,focus:"Frutas",skill:"Fruity Profit"},
    {name:"Old Salty",id:"old salty",reward:"coins",level:15,focus:"Pedidos do mar"},
    {name:"Victoria",id:"victoria",reward:"coins",level:30,focus:"Pedidos avançados",skill:"Victoria's Secretary"},

    {name:"Grimbly",id:"grimbly",reward:"sfl",level:10,focus:"FLOWER / SFL · pedido gerado pelo servidor"},
    {name:"Grimtooth",id:"grimtooth",reward:"sfl",level:12,focus:"FLOWER / SFL · requer Cropkeeper para alguns goblins"},
    {name:"Grubnuk",id:"grubnuk",reward:"sfl",level:16,focus:"FLOWER / SFL · pedido gerado pelo servidor"},
    {name:"Gambit",id:"gambit",reward:"sfl",level:25,focus:"FLOWER / SFL · pedido gerado pelo servidor"},
    {name:"Gordo",id:"gordo",reward:"sfl",level:30,focus:"FLOWER / SFL · pedido gerado pelo servidor"},
    {name:"Guria",id:"guria",reward:"sfl",level:40,focus:"FLOWER / SFL · pedido gerado pelo servidor"}
  ],

  ticketNPCs: [
    ["Pumpkin' Pete",5,1],["Bert",8,2],["Finley",12,2],["Raven",14,4],["Miranda",15,2],["Finn",16,5],["Cornwell",18,3],["Timmy",20,5],["Tywin",22,10],["Jester",26,4],["Pharaoh",17,6]
  ].map(([name,level,tickets]) => ({name,level,tickets})),

  priceItems: [
    "Sunflower","Potato","Pumpkin","Carrot","Cabbage","Beetroot","Cauliflower","Parsnip","Eggplant","Radish","Wheat","Kale","Corn","Soybean","Rhubarb","Yam","Broccoli","Pepper","Onion","Artichoke","Barley",
    "Apple","Orange","Blueberry","Banana","Tomato","Lemon","Grape","Olive","Rice",
    "Egg","Milk","Cheese","Honey","Wild Mushroom","Magic Mushroom","Seaweed","Crab",
    "Anchovy","Butterflyfish","Blowfish","Horse Mackerel","Red Snapper","Squid","Tuna","Surgeonfish","Halibut","Angelfish","Olive Flounder","Napoleanfish","Sunfish",
    "Wood","Stone","Iron","Gold","Crimstone","Oil","Leather","Wool","Merino Wool","Feather",
    "Mashed Potato","Roast Veggies","Boiled Eggs","Goblin's Treat","Fancy Fries"
  ]
};
