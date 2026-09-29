import { RecommendedItem, HomePlannerRequest, PartyPlannerRequest, JewelryPlannerRequest } from '../../src/types/index';

// High-fidelity simulated scraping and catalog across e-commerce ecosystems
export class MockCatalogService {
  
  // Home Interior Catalog
  static getHomeRecommendations(req: HomePlannerRequest): { items: RecommendedItem[]; tips: string[]; summary: string } {
    const budget = req.budget || 50000;
    const isUSD = req.currency === '$';
    const rateMultiplier = isUSD ? 0.012 : 1; // 1 INR ~ 0.012 USD
    const q = req.quantities || {};

    const items: RecommendedItem[] = [];

    // Calculate safe budget proportions
    const fanQty = Math.max(q.ceilingFans ?? 2, 1);
    const lightQty = Math.max(q.lights ?? 4, 1);
    const diningQty = Math.max(q.diningTable ?? 1, 1);
    const sofaQty = Math.max(q.sofas ?? 1, 1);
    const storageQty = Math.max(q.storage ?? 1, 1);
    const curtainQty = Math.max(q.curtains ?? 2, 1);

    // Target weights totaling 0.90 (leaving 10% surplus)
    const fanTotal = budget * 0.12;
    const lightTotal = budget * 0.08;
    const diningTotal = budget * 0.25;
    const sofaTotal = budget * 0.28;
    const storageTotal = budget * 0.12;
    const curtainTotal = budget * 0.05;

    // 1. Ceiling Fans
    if ((q.ceilingFans ?? 2) > 0) {
      const unit = Math.round((fanTotal / fanQty) * 100) / 100;
      items.push({
        id: 'home-fan-1',
        name: 'Atomberg Renesa BLDC Energy-Saving Smart Ceiling Fan',
        category: 'Cooling & Appliances',
        quantity: q.ceilingFans ?? 2,
        unitPrice: unit,
        totalPrice: unit * (q.ceilingFans ?? 2),
        platform: 'Amazon',
        platformUrl: 'https://www.amazon.in/s?k=atomberg+renesa+bldc+ceiling+fan',
        imageUrl: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80',
        rating: 4.6,
        reviewsCount: 14200,
        specs: '5-Star BLDC Motor, 28W Power Saving, RF Remote with Sleep Mode',
        reason: 'Consumes 65% less electricity than regular fans, reducing monthly utility bills.',
        inStock: true
      });
    }

    // 2. Ambient / Pendant Lights
    if ((q.lights ?? 4) > 0) {
      const unit = Math.round((lightTotal / lightQty) * 100) / 100;
      items.push({
        id: 'home-light-1',
        name: 'IKEA SINNERLIG Bamboo Pendant Lamp & Warm LED Bulbs',
        category: 'Lighting',
        quantity: q.lights ?? 4,
        unitPrice: unit,
        totalPrice: unit * (q.lights ?? 4),
        platform: 'IKEA',
        platformUrl: 'https://www.ikea.com/in/en/p/sinnerlig-pendant-lamp-bamboo-70315030/',
        imageUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=80',
        rating: 4.8,
        reviewsCount: 3100,
        specs: 'Handmade Braided Bamboo Lattice, Warm Ambient Diffused Glow, E27 Fitting',
        reason: 'Adds an architectural designer flair at an accessible IKEA price point.',
        inStock: true
      });
    }

    // 3. Dining Table / Coffee Table
    if ((q.diningTable ?? 1) > 0) {
      const unit = Math.round((diningTotal / diningQty) * 100) / 100;
      items.push({
        id: 'home-dining-1',
        name: 'IKEA JOKKMOKK Solid Pine Table and 4 Chairs Dining Set',
        category: 'Furniture & Dining',
        quantity: q.diningTable ?? 1,
        unitPrice: unit,
        totalPrice: unit * (q.diningTable ?? 1),
        platform: 'IKEA',
        platformUrl: 'https://www.ikea.com/in/en/p/jokkmokk-table-and-4-chairs-antique-stain-80211104/',
        imageUrl: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=600&q=80',
        rating: 4.7,
        reviewsCount: 5280,
        specs: 'Solid Pine with Antique Wood Stain, 118x74 cm, 4 Ergonomic Padded Chairs',
        reason: 'Classic, durable real wood dining solution engineered for compact contemporary flats.',
        inStock: true
      });
    }

    // 4. Living Room Sofa / Seating
    if ((q.sofas ?? 1) > 0) {
      const unit = Math.round((sofaTotal / sofaQty) * 100) / 100;
      items.push({
        id: 'home-sofa-1',
        name: 'Wakefit 3-Seater Fabric Sofa with High-Density Foam (Petal Blue)',
        category: 'Living Seating',
        quantity: q.sofas ?? 1,
        unitPrice: unit,
        totalPrice: unit * (q.sofas ?? 1),
        platform: 'Amazon',
        platformUrl: 'https://www.amazon.in/s?k=wakefit+sofa+3+seater',
        imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
        rating: 4.5,
        reviewsCount: 8900,
        specs: 'Neem Wood Frame, High Resilient Foam, Breathable Jute Fabric, 3-Year Warranty',
        reason: 'Optimal posture support and anti-sag construction balanced for living room aesthetics.',
        inStock: true
      });
    }

    // 5. Storage / Media Console
    if ((q.storage ?? 1) > 0) {
      const unit = Math.round((storageTotal / storageQty) * 100) / 100;
      items.push({
        id: 'home-storage-1',
        name: 'Flipkart Perfect Homes Purewood Engineered Wood TV Entertainment Unit',
        category: 'Storage & Media',
        quantity: q.storage ?? 1,
        unitPrice: unit,
        totalPrice: unit * (q.storage ?? 1),
        platform: 'Flipkart',
        platformUrl: 'https://www.flipkart.com/search?q=tv+entertainment+unit',
        imageUrl: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=600&q=80',
        rating: 4.4,
        reviewsCount: 3450,
        specs: 'Wenge & Teak Finish, Cable Management Cutouts, 4 Storage Compartments',
        reason: 'Keeps clutter hidden while anchoring the living media wall smartly.',
        inStock: true
      });
    }

    // 6. Curtains & Rug
    if ((q.curtains ?? 2) > 0) {
      const unit = Math.round((curtainTotal / curtainQty) * 100) / 100;
      items.push({
        id: 'home-curtain-1',
        name: 'Amazon Basics Blackout Thermal Insulated Eyelet Curtains (Set of 2)',
        category: 'Soft Furnishings',
        quantity: q.curtains ?? 2,
        unitPrice: unit,
        totalPrice: unit * (q.curtains ?? 2),
        platform: 'Amazon',
        platformUrl: 'https://www.amazon.in/s?k=amazonbasics+blackout+curtains',
        imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
        rating: 4.5,
        reviewsCount: 9200,
        specs: 'Triple Weave Fabric, 85% Light Blockage, Thermal Noise Dampening',
        reason: 'Reduces heat load and controls harsh sunlight while adding texture.',
        inStock: true
      });
    }

    // Tips
    const tips = [
      `Selected ${req.style || 'Modern'} theme creates a cohesive spatial flow across ${req.roomTypes.join(', ')}.`,
      'Cross-platform allocation distributes 45% IKEA (fixtures & dining), 40% Amazon (appliances & comfort seating), and 15% Flipkart (media unit).',
      'By choosing BLDC technology for fans and LED pendant lights, you preserve ~₹450/month in operating power costs.'
    ];

    const summary = `Allocated recommendations for ${req.roomTypes.join(' & ')} tailored to a ${req.style || 'Contemporary'} style within your defined budget.`;

    return { items, tips, summary };
  }

  // Party Planner Catalog
  static getPartyRecommendations(req: PartyPlannerRequest): { items: RecommendedItem[]; tips: string[]; summary: string; perGuest: number } {
    const budget = req.budget || 25000;
    const guests = Math.max(req.guestCount || 20, 1);
    const isUSD = req.currency === '$';
    const perGuest = Math.round((budget / guests) * 100) / 100;

    const items: RecommendedItem[] = [];

    // 1. Catering / Food via Swiggy / Zomato
    const foodAlloc = Math.round(budget * 0.48);
    items.push({
      id: 'party-food-1',
      name: `Zomato Gourmet Party Platter & Live Appetizers (Catering for ${guests} Pax)`,
      category: 'Food & Gourmet Catering',
      quantity: 1,
      unitPrice: foodAlloc,
      totalPrice: foodAlloc,
      platform: 'Zomato',
      platformUrl: 'https://www.zomato.com',
      imageUrl: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=600&q=80',
      rating: 4.8,
      reviewsCount: 1840,
      specs: `3 Starters (Veg & Non-Veg), 2 Mains, Biryani/Breads, Assorted Dips & Desserts`,
      reason: 'Chef-prepared party box delivered in insulated warm containers right before guest arrival.',
      inStock: true
    });

    // 2. Drinks & Mocktails via Swiggy Instamart / Minis
    const drinksAlloc = Math.round(budget * 0.15);
    items.push({
      id: 'party-drinks-1',
      name: 'Swiggy Instamart Artisanal Mocktail Mixers, Craft Tonics & Ice Supply',
      category: 'Beverages & Refreshments',
      quantity: 1,
      unitPrice: drinksAlloc,
      totalPrice: drinksAlloc,
      platform: 'Swiggy',
      platformUrl: 'https://www.swiggy.com/instamart',
      imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
      rating: 4.9,
      reviewsCount: 6500,
      specs: 'Ginger Ale, Cranberry Spritz, Mojito Concentrates, Edible Garnishes & 5kg Chilled Ice',
      reason: '10-minute instant delivery allows replenishing fresh ice and mixers as the night progresses.',
      inStock: true
    });

    // 3. Venue / Stay space via OYO Townhouse / Airbnb Party Pod
    const venueAlloc = Math.round(budget * 0.22);
    items.push({
      id: 'party-venue-1',
      name: 'OYO Townhouse Party Lounge Suite & Rooftop Terrace Access',
      category: 'Venue & Ambiance Space',
      quantity: 1,
      unitPrice: venueAlloc,
      totalPrice: venueAlloc,
      platform: 'OYO',
      platformUrl: 'https://www.oyorooms.com',
      imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80',
      rating: 4.6,
      reviewsCount: 4200,
      specs: 'Air Conditioned Event Space, High-top Cocktail Tables, Sound Insulation, Dedicated Restrooms',
      reason: 'Cost-effective alternative to expensive 5-star banquet halls with zero post-party clean-up hassle at home.',
      inStock: true
    });

    // 4. Decor & Lighting via Amazon / Flipkart
    const decorAlloc = Math.round(budget * 0.10);
    items.push({
      id: 'party-decor-1',
      name: `${req.eventType || 'Celebration'} Themed Metallic Balloon Arch, Fairy String Lights & Photo Backdrop`,
      category: 'Decor & Styling',
      quantity: 1,
      unitPrice: decorAlloc,
      totalPrice: decorAlloc,
      platform: 'Amazon',
      platformUrl: 'https://www.amazon.in/s?k=party+balloon+arch+fairy+lights',
      imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=80',
      rating: 4.7,
      reviewsCount: 11200,
      specs: '120-Piece Rose Gold/Silver Balloons, Electric Balloon Pump, 20m Warm String LEDs, Shimmer Foil Curtain',
      reason: 'Provides Instagrammable photo moments for guests with 30-minute fast assembly.',
      inStock: true
    });

    // 5. Entertainment / Games via Flipkart
    const gamesAlloc = Math.round(budget * 0.05);
    items.push({
      id: 'party-games-1',
      name: 'Portronics 20W Bluetooth Wireless Party Speaker with Karaoke Mic & RGB Lights',
      category: 'Entertainment',
      quantity: 1,
      unitPrice: gamesAlloc,
      totalPrice: gamesAlloc,
      platform: 'Flipkart',
      platformUrl: 'https://www.flipkart.com/search?q=bluetooth+party+speaker+karaoke',
      imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80',
      rating: 4.5,
      reviewsCount: 8100,
      specs: '20W Deep Bass, 8-Hour Battery Life, Dynamic Beat-synced LED Rings, Wireless Mic Included',
      reason: 'Drives energetic music vibes and karaoke sing-alongs without hiring an expensive DJ.',
      inStock: true
    });

    const tips = [
      `Budget scales gracefully to ${req.currency || '₹'}${perGuest} per guest for ${guests} attendees.`,
      'Leverage Swiggy Instamart for late-hour snacks/ice to avoid over-ordering upfront.',
      'OYO Townhouse venue reservation includes basic cleanup, saving significant post-event labor.'
    ];

    const summary = `Complete ${req.eventType} plan for ${guests} guests balanced across food, refreshments, venue, and decor.`;

    return { items, tips, summary, perGuest };
  }

  // Jewelry Planner Catalog
  static getJewelryRecommendations(req: JewelryPlannerRequest): { items: RecommendedItem[]; tips: string[]; summary: string; outfitAnalysis?: any } {
    const budget = req.budget || 40000;
    const metal = req.metalPreference || 'Gold & Diamonds';
    const occasion = req.occasion || 'Wedding & Festive';
    const isUSD = req.currency === '$';

    const items: RecommendedItem[] = [];

    // 1. Statement Necklace / Choker
    const neckAlloc = Math.round(budget * 0.45);
    items.push({
      id: 'jewel-neck-1',
      name: 'CaratLane 14K Yellow Gold & Diamond Cascade Solitaire Pendant Necklace',
      category: 'Necklace & Chokers',
      quantity: 1,
      unitPrice: neckAlloc,
      totalPrice: neckAlloc,
      platform: 'CaratLane',
      platformUrl: 'https://www.caratlane.com/jewellery/necklaces.html',
      imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
      rating: 4.9,
      reviewsCount: 3200,
      specs: 'BIS Hallmarked 14KT Gold, IGI Certified Natural Diamonds (SI-IJ), Adjustable Chain',
      reason: 'Perfect centerpiece that draws eyes to the neckline while retaining genuine buyback value.',
      inStock: true
    });

    // 2. Matching Earrings / Jhumkas
    const earAlloc = Math.round(budget * 0.28);
    items.push({
      id: 'jewel-ear-1',
      name: 'Tanishq Mia 14K Gold Geometric Drop Earrings with Subtle Enamel',
      category: 'Earrings & Jhumkas',
      quantity: 1,
      unitPrice: earAlloc,
      totalPrice: earAlloc,
      platform: 'Tanishq',
      platformUrl: 'https://www.tanishq.co.in/mia',
      imageUrl: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80',
      rating: 4.8,
      reviewsCount: 2150,
      specs: '14 Karat Yellow Gold, Push-back Lock, Lightweight Ergonomic Wear for Long Occasions',
      reason: 'Complements the necklace harmoniously without clashing or weighing down the earlobes.',
      inStock: true
    });

    // 3. Bangles / Delicate Bracelet
    const bangleAlloc = Math.round(budget * 0.17);
    items.push({
      id: 'jewel-bangle-1',
      name: 'GIVA 925 Sterling Silver Rose Gold Plated Tennis Bracelet with Zircons',
      category: 'Bracelets & Bangles',
      quantity: 1,
      unitPrice: bangleAlloc,
      totalPrice: bangleAlloc,
      platform: 'Amazon',
      platformUrl: 'https://www.amazon.in/s?k=giva+925+sterling+silver+bracelet',
      imageUrl: 'https://images.unsplash.com/photo-1611591475876-0f73f1d39b8c?auto=format&fit=crop&w=600&q=80',
      rating: 4.7,
      reviewsCount: 8800,
      specs: 'Authentic 925 Silver Stamp, AAA+ Grade Swiss Cubic Zirconia, Anti-tarnish E-coating',
      reason: 'Adds sparkle to the wrist when gesturing, fitting smoothly with traditional or modern sleeves.',
      inStock: true
    });

    // 4. Cocktail Ring
    const ringAlloc = Math.round(budget * 0.10);
    items.push({
      id: 'jewel-ring-1',
      name: 'Nykaa Fashion Kundan & Meenakari Floral Statement Cocktail Ring',
      category: 'Rings',
      quantity: 1,
      unitPrice: ringAlloc,
      totalPrice: ringAlloc,
      platform: 'Nykaa Fashion',
      platformUrl: 'https://www.nykaafashion.com',
      imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80',
      rating: 4.6,
      reviewsCount: 1400,
      specs: '24K Gold Plated Brass, Uncut Polki Kundan Glass Stones, Adjustable Band',
      reason: 'Affordable high-impact luxury accent that completes the festive/wedding ensemble.',
      inStock: true
    });

    const outfitAnalysis = {
      detectedColors: ['Rich Royal/Jewel Tones', 'Gold Thread Highlights'],
      detectedStyle: `${occasion} Occasion Aesthetic`,
      necklineRecommendation: 'V-Neck / Sweetheart Cut harmonizes with cascading pendants and drop earrings.',
      metalHarmony: `${metal} provides radiant contrast against the fabric color without overwhelming.`
    };

    const tips = [
      `Curated mix: 73% fine gold/diamond jewelry from CaratLane/Tanishq + 27% designer silver/festive accents.`,
      'Hallmarked BIS certified gold and IGI certified diamonds safeguard investment value.',
      'Earrings feature comfort push-backs so you can dance and socialize for 8+ hours comfortably.'
    ];

    const summary = `Coordinated jewelry ensemble tailored for ${occasion} paired with ${metal} aesthetics.`;

    return { items, tips, summary, outfitAnalysis };
  }
}
