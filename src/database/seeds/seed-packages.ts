import { DataSource } from "typeorm";
import {
  Package,
  PackageType,
  PackageStatus,
} from "../../packages/entities/package.entity";
import {
  PackageSchedule,
  PackageScheduleStatus,
} from "../../packages/entities/package-schedule.entity";
import { User } from "../../users/entities/user.entity";

export async function seedPackages(dataSource: DataSource) {
  const packageRepository = dataSource.getRepository(Package);
  const scheduleRepository = dataSource.getRepository(PackageSchedule);
  const userRepository = dataSource.getRepository(User);

  // Get admin user
  const adminUser = await userRepository.findOne({
    where: { email: "admin@manali.com" },
  });

  if (!adminUser) {
    throw new Error("Admin user not found. Please run admin seed first.");
  }

  const packagesData = [
    {
      name: "Manali Adventure Extravaganza",
      description:
        "Ultimate adventure package combining the best of Manali's outdoor activities. Perfect for thrill-seekers and nature lovers.",
      highlights:
        "River Rafting in Beas, Paragliding in Solang Valley, Trekking to Jogini Falls, Mountain Biking, Rock Climbing",
      itinerary:
        "Day 1: Arrival in Manali, Local sightseeing, Mall Road walk\nDay 2: Solang Valley - Paragliding, Zorbing, Cable Car\nDay 3: River Rafting in Beas, Visit to Vashisht Hot Springs\nDay 4: Trek to Jogini Falls, Mountain biking\nDay 5: Rohtang Pass (subject to permits), Departure",
      duration: 5,
      nights: 4,
      price: 18500,
      originalPrice: 22000,
      maxGroupSize: 15,
      minGroupSize: 2,
      type: PackageType.ADVENTURE,
      inclusions: [
        "4 nights accommodation in 3-star hotel",
        "All meals (breakfast, lunch, dinner)",
        "All adventure activities as per itinerary",
        "Professional guide and instructor",
        "Transportation in Tempo Traveller",
        "All entry fees and permits",
      ],
      exclusions: [
        "Personal expenses",
        "Tips and gratuities",
        "Travel insurance",
        "Any activity not mentioned in inclusions",
      ],
      images: ["adventure1.jpg", "adventure2.jpg", "adventure3.jpg"],
      destinations: [
        "Manali",
        "Solang Valley",
        "Rohtang Pass",
        "Vashisht",
        "Jogini Falls",
      ],
      rating: 4.7,
      reviewCount: 95,
      terms:
        "Minimum age 12 years. Subject to weather conditions. Rohtang Pass visit depends on permits and road conditions.",
      cancellationPolicy:
        "50% refund if cancelled 7 days before departure. 25% refund if cancelled 3-6 days before. No refund if cancelled within 3 days.",
    },
    {
      name: "Manali Family Fun Package",
      description:
        "Perfect family getaway package with activities suitable for all ages. Create memorable moments with your loved ones.",
      highlights:
        "Hadimba Temple visit, Solang Valley sightseeing, Apple orchards visit, Local culture experience",
      itinerary:
        "Day 1: Arrival, Hadimba Temple, Local market\nDay 2: Solang Valley, Cable car ride\nDay 3: Rohtang Pass (subject to availability), Local sightseeing\nDay 4: Apple orchards, Naggar Castle, Departure",
      duration: 4,
      nights: 3,
      price: 12500,
      originalPrice: 14000,
      maxGroupSize: 25,
      minGroupSize: 4,
      type: PackageType.FAMILY,
      inclusions: [
        "3 nights accommodation in family-friendly hotel",
        "Daily breakfast and dinner",
        "All sightseeing as per itinerary",
        "Transportation in AC vehicle",
        "Professional guide",
      ],
      exclusions: [
        "Lunch",
        "Personal expenses",
        "Entry fees not mentioned",
        "Any meals not specified",
      ],
      images: ["family1.jpg", "family2.jpg", "family3.jpg"],
      destinations: ["Manali", "Solang Valley", "Rohtang Pass", "Naggar"],
      rating: 4.3,
      reviewCount: 156,
      terms:
        "Children below 5 years free. Extra bed charges applicable for children above 5 years.",
      cancellationPolicy:
        "Free cancellation up to 5 days before departure. 30% charges for 2-4 days before departure.",
    },
    {
      name: "Romantic Manali Honeymoon Special",
      description:
        "Intimate honeymoon package designed for couples with romantic settings, private dinners, and couple activities.",
      highlights:
        "Couple spa sessions, Private candlelight dinners, Romantic walks, Photography sessions, Special decorations",
      itinerary:
        "Day 1: Arrival, Welcome drink, Couple spa\nDay 2: Solang Valley, Romantic dinner\nDay 3: Rohtang Pass, Photography session\nDay 4: Local sightseeing, Departure",
      duration: 4,
      nights: 3,
      price: 25000,
      originalPrice: 29000,
      maxGroupSize: 2,
      minGroupSize: 2,
      type: PackageType.ROMANTIC,
      inclusions: [
        "3 nights in luxury honeymoon suite",
        "All meals with special romantic setups",
        "Couple spa sessions",
        "Private transportation",
        "Photography sessions",
        "Room decorations",
      ],
      exclusions: [
        "Personal shopping",
        "Additional spa treatments",
        "Alcoholic beverages",
        "Tips",
      ],
      images: ["romantic1.jpg", "romantic2.jpg", "romantic3.jpg"],
      destinations: ["Manali", "Solang Valley", "Rohtang Pass"],
      rating: 4.8,
      reviewCount: 87,
      terms:
        "Valid marriage certificate required. Package valid for 1 year from booking.",
      cancellationPolicy:
        "Free cancellation up to 10 days before. 50% charges for 5-10 days before.",
    },
    {
      name: "Budget Manali Explorer",
      description:
        "Affordable package covering major attractions of Manali without compromising on experience. Perfect for budget-conscious travelers.",
      highlights:
        "Major sightseeing spots, Local transportation, Basic accommodation, Meals included",
      itinerary:
        "Day 1: Arrival, Mall Road\nDay 2: Hadimba Temple, Vashisht\nDay 3: Solang Valley\nDay 4: Local market, Departure",
      duration: 4,
      nights: 3,
      price: 8500,
      originalPrice: 9500,
      maxGroupSize: 30,
      minGroupSize: 6,
      type: PackageType.BUDGET,
      inclusions: [
        "3 nights in budget hotel",
        "Daily breakfast",
        "Shared transportation",
        "Basic sightseeing",
      ],
      exclusions: [
        "Lunch and dinner",
        "Adventure activities",
        "Personal expenses",
        "Entry fees",
      ],
      images: ["budget1.jpg", "budget2.jpg"],
      destinations: ["Manali", "Solang Valley", "Vashisht"],
      rating: 4.0,
      reviewCount: 234,
      terms:
        "Minimum 6 people required. Shared accommodation and transportation.",
      cancellationPolicy: "No refund within 5 days of departure.",
    },
    {
      name: "Luxury Manali Retreat",
      description:
        "Premium luxury package with 5-star accommodations, private services, and exclusive experiences.",
      highlights:
        "5-star luxury hotel, Private helicopter ride, Exclusive dining, Personal butler service, Luxury spa",
      itinerary:
        "Day 1: Arrival in helicopter, Luxury hotel check-in\nDay 2: Private sightseeing, Exclusive dining\nDay 3: Helicopter tour, Luxury spa\nDay 4: Shopping, Departure",
      duration: 4,
      nights: 3,
      price: 75000,
      originalPrice: 85000,
      maxGroupSize: 6,
      minGroupSize: 2,
      type: PackageType.LUXURY,
      inclusions: [
        "3 nights in presidential suite",
        "Helicopter transfers",
        "All gourmet meals",
        "Private guide and driver",
        "Luxury spa treatments",
        "Personal butler service",
      ],
      exclusions: [
        "Personal shopping",
        "Alcoholic beverages beyond package",
        "Additional helicopter tours",
        "Gratuities",
      ],
      images: ["luxury1.jpg", "luxury2.jpg", "luxury3.jpg", "luxury4.jpg"],
      destinations: ["Manali", "Solang Valley", "Helicopter Tour Routes"],
      rating: 4.9,
      reviewCount: 45,
      terms: "Subject to helicopter availability. Weather dependent services.",
      cancellationPolicy:
        "50% refund if cancelled 15 days before. No refund within 10 days.",
    },
    {
      name: "Spiritual Manali Journey",
      description:
        "Spiritual and religious tour covering temples, monasteries, and spiritual sites around Manali.",
      highlights:
        "Temple visits, Monastery tours, Meditation sessions, Religious ceremonies, Spiritual guidance",
      itinerary:
        "Day 1: Arrival, Hadimba Temple\nDay 2: Buddhist monasteries, Meditation\nDay 3: Vashisht Temple, Hot springs\nDay 4: Morning prayers, Departure",
      duration: 4,
      nights: 3,
      price: 11000,
      originalPrice: 12500,
      maxGroupSize: 20,
      minGroupSize: 4,
      type: PackageType.RELIGIOUS,
      inclusions: [
        "3 nights in spiritual retreat center",
        "Vegetarian meals",
        "Guided temple visits",
        "Meditation sessions",
        "Spiritual literature",
      ],
      exclusions: [
        "Non-vegetarian meals",
        "Personal expenses",
        "Donations to temples",
        "Shopping",
      ],
      images: ["spiritual1.jpg", "spiritual2.jpg"],
      destinations: ["Manali", "Vashisht", "Buddhist Monasteries"],
      rating: 4.4,
      reviewCount: 78,
      terms: "Vegetarian meals only. Dress code applicable for temples.",
      cancellationPolicy: "Free cancellation up to 7 days before departure.",
    },
    {
      name: "Manali Trekking Expedition",
      description:
        "Challenging trekking package for experienced trekkers covering multiple high-altitude trails.",
      highlights:
        "High altitude trekking, Camping under stars, Professional trek guides, Mountain climbing, Survival skills",
      itinerary:
        "Day 1: Arrival, Equipment check\nDay 2-3: Hampta Pass Trek\nDay 4-5: Chandratal Lake trek\nDay 6: Rest and recovery\nDay 7: Departure",
      duration: 7,
      nights: 6,
      price: 22000,
      originalPrice: 25000,
      maxGroupSize: 12,
      minGroupSize: 4,
      type: PackageType.ADVENTURE,
      inclusions: [
        "6 nights camping/guesthouse",
        "All meals during trek",
        "Professional trek guide",
        "Camping equipment",
        "Permits and fees",
        "Emergency support",
      ],
      exclusions: [
        "Personal trekking gear",
        "Insurance",
        "Personal expenses",
        "Medical expenses",
      ],
      images: ["trek1.jpg", "trek2.jpg", "trek3.jpg"],
      destinations: ["Manali", "Hampta Pass", "Chandratal Lake"],
      rating: 4.6,
      reviewCount: 67,
      terms: "Good physical fitness required. Medical certificate needed.",
      cancellationPolicy:
        "Weather dependent. 70% refund for weather cancellations.",
    },
    {
      name: "Manali Photography Tour",
      description:
        "Specialized photography tour for enthusiasts with professional guidance and exclusive locations.",
      highlights:
        "Professional photographer guide, Exclusive shooting locations, Equipment rental, Photo editing workshop",
      itinerary:
        "Day 1: Arrival, Golden hour shoot\nDay 2: Sunrise at Solang, Landscape photography\nDay 3: Cultural photography, Sunset shots\nDay 4: Photo review, Departure",
      duration: 4,
      nights: 3,
      price: 16000,
      originalPrice: 19000,
      maxGroupSize: 8,
      minGroupSize: 3,
      type: PackageType.ADVENTURE,
      inclusions: [
        "3 nights accommodation",
        "Professional photographer guide",
        "Transportation to locations",
        "Equipment rental available",
        "Photo editing workshop",
      ],
      exclusions: [
        "Personal camera equipment",
        "Meals",
        "Photo printing",
        "Additional equipment",
      ],
      images: ["photo1.jpg", "photo2.jpg"],
      destinations: [
        "Manali",
        "Solang Valley",
        "Rohtang Pass",
        "Hidden Locations",
      ],
      rating: 4.5,
      reviewCount: 43,
      terms: "Basic photography knowledge required. Own camera recommended.",
      cancellationPolicy:
        "Equipment booking dependent. 50% refund if cancelled 5 days before.",
    },
    {
      name: "Manali Culinary Experience",
      description:
        "Food lover's paradise with local cuisine exploration, cooking classes, and restaurant tours.",
      highlights:
        "Local cuisine tasting, Cooking classes, Restaurant tours, Food market visits, Recipe collection",
      itinerary:
        "Day 1: Arrival, Food market tour\nDay 2: Cooking class, Local restaurant dinner\nDay 3: Mountain cuisine experience\nDay 4: Recipe collection, Departure",
      duration: 4,
      nights: 3,
      price: 13500,
      originalPrice: 15000,
      maxGroupSize: 15,
      minGroupSize: 5,
      type: PackageType.FAMILY,
      inclusions: [
        "3 nights accommodation",
        "All meals as per itinerary",
        "Cooking classes",
        "Restaurant tours",
        "Recipe book",
        "Market tours",
      ],
      exclusions: [
        "Alcoholic beverages",
        "Personal expenses",
        "Additional meals",
        "Shopping",
      ],
      images: ["food1.jpg", "food2.jpg", "food3.jpg"],
      destinations: ["Manali", "Local Villages", "Mountain Restaurants"],
      rating: 4.3,
      reviewCount: 92,
      terms: "Dietary restrictions accommodated with advance notice.",
      cancellationPolicy: "Free cancellation up to 5 days before departure.",
    },
    {
      name: "Manali Winter Wonderland",
      description:
        "Special winter package for snow activities, winter sports, and cozy mountain experiences.",
      highlights:
        "Snow activities, Skiing lessons, Snowman building, Winter photography, Cozy bonfire nights",
      itinerary:
        "Day 1: Arrival, Snow activities\nDay 2: Skiing lessons at Solang\nDay 3: Rohtang snow experience\nDay 4: Winter photography, Departure",
      duration: 4,
      nights: 3,
      price: 17500,
      originalPrice: 20000,
      maxGroupSize: 20,
      minGroupSize: 6,
      type: PackageType.ADVENTURE,
      inclusions: [
        "3 nights in heated accommodation",
        "Winter gear rental",
        "Skiing lessons",
        "Snow activity equipment",
        "Bonfire arrangements",
        "Hot meals and beverages",
      ],
      exclusions: [
        "Personal winter clothing",
        "Advanced skiing equipment",
        "Medical expenses",
        "Personal expenses",
      ],
      images: ["winter1.jpg", "winter2.jpg", "winter3.jpg"],
      destinations: ["Manali", "Solang Valley", "Rohtang Pass"],
      rating: 4.4,
      reviewCount: 118,
      terms: "Available December to February only. Weather dependent.",
      cancellationPolicy: "Full refund if cancelled due to weather conditions.",
    },
    {
      name: "Manali Wellness Retreat",
      description:
        "Holistic wellness package focusing on health, relaxation, and rejuvenation in mountain serenity.",
      highlights:
        "Yoga sessions, Spa treatments, Meditation, Healthy cuisine, Nature walks, Wellness workshops",
      itinerary:
        "Day 1: Arrival, Wellness assessment\nDay 2: Yoga, Spa treatments\nDay 3: Meditation, Nature walks\nDay 4: Wellness workshop, Departure",
      duration: 4,
      nights: 3,
      price: 19500,
      originalPrice: 22000,
      maxGroupSize: 12,
      minGroupSize: 4,
      type: PackageType.LUXURY,
      inclusions: [
        "3 nights in wellness resort",
        "All spa treatments",
        "Yoga and meditation sessions",
        "Healthy meals",
        "Wellness consultations",
        "Nature walks",
      ],
      exclusions: [
        "Personal shopping",
        "Additional treatments",
        "Alcoholic beverages",
        "Personal expenses",
      ],
      images: ["wellness1.jpg", "wellness2.jpg", "wellness3.jpg"],
      destinations: ["Manali", "Wellness Centers", "Nature Spots"],
      rating: 4.7,
      reviewCount: 89,
      terms: "Health assessment required. Suitable for all ages.",
      cancellationPolicy: "Free cancellation up to 7 days before departure.",
    },
    {
      name: "Manali Bike Expedition",
      description:
        "Thrilling bike tour through mountain roads and scenic routes for motorcycle enthusiasts.",
      highlights:
        "Royal Enfield bikes, Mountain passes, Scenic routes, Professional bike guides, Mechanical support",
      itinerary:
        "Day 1: Arrival, Bike orientation\nDay 2: Manali to Rohtang Pass\nDay 3: Exploring mountain routes\nDay 4: Local rides, Departure",
      duration: 4,
      nights: 3,
      price: 21000,
      originalPrice: 24000,
      maxGroupSize: 10,
      minGroupSize: 3,
      type: PackageType.ADVENTURE,
      inclusions: [
        "3 nights accommodation",
        "Royal Enfield bike rental",
        "Professional guide",
        "Mechanical support",
        "Safety gear",
        "Fuel for planned routes",
      ],
      exclusions: [
        "Personal riding gear",
        "Additional fuel",
        "Bike damage charges",
        "Personal expenses",
      ],
      images: ["bike1.jpg", "bike2.jpg", "bike3.jpg"],
      destinations: ["Manali", "Rohtang Pass", "Mountain Routes"],
      rating: 4.6,
      reviewCount: 76,
      terms: "Valid driving license required. Riding experience mandatory.",
      cancellationPolicy:
        "Bike availability dependent. 60% refund if cancelled 7 days before.",
    },
    {
      name: "Manali Cultural Immersion",
      description:
        "Deep cultural experience with local families, traditional practices, and authentic lifestyle.",
      highlights:
        "Homestay experience, Traditional cooking, Local festivals, Cultural performances, Handicraft workshops",
      itinerary:
        "Day 1: Arrival, Homestay settlement\nDay 2: Cultural activities, Traditional cooking\nDay 3: Local festival participation\nDay 4: Handicraft workshop, Departure",
      duration: 4,
      nights: 3,
      price: 9500,
      originalPrice: 11000,
      maxGroupSize: 8,
      minGroupSize: 4,
      type: PackageType.FAMILY,
      inclusions: [
        "3 nights homestay",
        "All traditional meals",
        "Cultural activities",
        "Handicraft workshops",
        "Local guide",
        "Cultural performances",
      ],
      exclusions: [
        "Personal expenses",
        "Shopping",
        "Additional activities",
        "Tips to families",
      ],
      images: ["culture1.jpg", "culture2.jpg"],
      destinations: ["Manali", "Local Villages", "Cultural Centers"],
      rating: 4.5,
      reviewCount: 64,
      terms: "Respect for local customs required. Basic Hindi helpful.",
      cancellationPolicy: "Free cancellation up to 5 days before departure.",
    },
    {
      name: "Manali River Rafting Special",
      description:
        "Dedicated river rafting package with multiple rapids and professional water sports activities.",
      highlights:
        "Multi-day rafting, Different rapids, Professional instructors, Camping by river, Water sports",
      itinerary:
        "Day 1: Arrival, Rafting basics\nDay 2: Beas River rafting\nDay 3: Advanced rapids\nDay 4: River camping, Departure",
      duration: 4,
      nights: 3,
      price: 14500,
      originalPrice: 16500,
      maxGroupSize: 16,
      minGroupSize: 6,
      type: PackageType.ADVENTURE,
      inclusions: [
        "3 nights riverside camping",
        "All rafting equipment",
        "Professional instructors",
        "All meals",
        "Safety equipment",
        "Transportation",
      ],
      exclusions: [
        "Personal clothing",
        "Insurance",
        "Personal expenses",
        "Additional water sports",
      ],
      images: ["rafting1.jpg", "rafting2.jpg", "rafting3.jpg"],
      destinations: ["Manali", "Beas River", "Rafting Camps"],
      rating: 4.4,
      reviewCount: 103,
      terms: "Swimming knowledge required. Age 12-60 years only.",
      cancellationPolicy:
        "Water level dependent. 80% refund for weather cancellations.",
    },
    {
      name: "Manali Wildlife Safari",
      description:
        "Wildlife exploration package covering national parks and wildlife sanctuaries around Manali.",
      highlights:
        "Wildlife spotting, Bird watching, Nature photography, Forest walks, Wildlife education",
      itinerary:
        "Day 1: Arrival, Forest orientation\nDay 2: Wildlife sanctuary visit\nDay 3: Bird watching tour\nDay 4: Nature photography, Departure",
      duration: 4,
      nights: 3,
      price: 12000,
      originalPrice: 13500,
      maxGroupSize: 12,
      minGroupSize: 4,
      type: PackageType.ADVENTURE,
      inclusions: [
        "3 nights forest lodge",
        "All safari activities",
        "Professional naturalist",
        "Transportation",
        "Entry fees",
        "Binoculars rental",
      ],
      exclusions: [
        "Personal expenses",
        "Photography equipment",
        "Additional safaris",
        "Meals not mentioned",
      ],
      images: ["wildlife1.jpg", "wildlife2.jpg"],
      destinations: ["Manali", "Wildlife Sanctuaries", "Forest Areas"],
      rating: 4.2,
      reviewCount: 57,
      terms: "Quiet behavior required. Wildlife sighting not guaranteed.",
      cancellationPolicy: "Free cancellation up to 5 days before departure.",
    },
    {
      name: "Manali Paragliding Championship",
      description:
        "Specialized paragliding package with professional training and competitive flying opportunities.",
      highlights:
        "Professional paragliding training, Competitive flying, Certification course, Equipment rental, Video recording",
      itinerary:
        "Day 1: Arrival, Ground training\nDay 2: Basic flying lessons\nDay 3: Advanced techniques\nDay 4: Solo flight, Certification",
      duration: 4,
      nights: 3,
      price: 24000,
      originalPrice: 29000,
      maxGroupSize: 6,
      minGroupSize: 2,
      type: PackageType.ADVENTURE,
      inclusions: [
        "3 nights accommodation",
        "Professional paragliding training",
        "All equipment rental",
        "Certification course",
        "Video recording of flights",
        "Insurance coverage",
      ],
      exclusions: [
        "Personal flying gear",
        "Additional flights",
        "Medical expenses",
        "Personal expenses",
      ],
      images: ["paragliding1.jpg", "paragliding2.jpg", "paragliding3.jpg"],
      destinations: ["Manali", "Solang Valley", "Billing"],
      rating: 4.8,
      reviewCount: 39,
      terms: "Age 16-50 years. Medical fitness required. Weather dependent.",
      cancellationPolicy:
        "Weather dependent. 70% refund for weather cancellations.",
    },
    {
      name: "Manali Apple Harvest Festival",
      description:
        "Seasonal package during apple harvest season with orchard visits and local celebrations.",
      highlights:
        "Apple orchard visits, Harvest participation, Local festivals, Apple processing, Cultural programs",
      itinerary:
        "Day 1: Arrival, Orchard visit\nDay 2: Harvest participation\nDay 3: Apple processing, Local festival\nDay 4: Cultural programs, Departure",
      duration: 4,
      nights: 3,
      price: 10500,
      originalPrice: 12000,
      maxGroupSize: 20,
      minGroupSize: 8,
      type: PackageType.FAMILY,
      inclusions: [
        "3 nights accommodation",
        "Orchard visits",
        "Harvest activities",
        "Local festival participation",
        "Apple products",
        "Cultural programs",
      ],
      exclusions: [
        "Personal expenses",
        "Shopping",
        "Additional activities",
        "Tips",
      ],
      images: ["apple1.jpg", "apple2.jpg"],
      destinations: ["Manali", "Apple Orchards", "Local Villages"],
      rating: 4.1,
      reviewCount: 82,
      terms: "Available September-October only. Season dependent.",
      cancellationPolicy:
        "Season dependent. Free cancellation up to 7 days before.",
    },
    {
      name: "Manali Meditation Retreat",
      description:
        "Peaceful meditation and mindfulness retreat in the serene Himalayan environment.",
      highlights:
        "Guided meditation, Mindfulness sessions, Silent retreats, Spiritual discussions, Yoga practice",
      itinerary:
        "Day 1: Arrival, Meditation introduction\nDay 2: Guided meditation sessions\nDay 3: Silent retreat day\nDay 4: Group discussions, Departure",
      duration: 4,
      nights: 3,
      price: 8500,
      originalPrice: 9500,
      maxGroupSize: 15,
      minGroupSize: 5,
      type: PackageType.RELIGIOUS,
      inclusions: [
        "3 nights meditation center",
        "All meditation sessions",
        "Vegetarian meals",
        "Yoga classes",
        "Spiritual guidance",
        "Meditation materials",
      ],
      exclusions: [
        "Personal expenses",
        "Non-vegetarian meals",
        "Entertainment",
        "Shopping",
      ],
      images: ["meditation1.jpg", "meditation2.jpg"],
      destinations: ["Manali", "Meditation Centers", "Quiet Zones"],
      rating: 4.6,
      reviewCount: 71,
      terms: "Silence maintained during sessions. Vegetarian meals only.",
      cancellationPolicy: "Free cancellation up to 7 days before departure.",
    },
    {
      name: "Manali Extreme Sports Package",
      description:
        "Ultimate extreme sports package for adrenaline junkies with multiple high-risk activities.",
      highlights:
        "Bungee jumping, Rock climbing, Rappelling, Zip-lining, Extreme skiing, Professional safety",
      itinerary:
        "Day 1: Arrival, Safety briefing\nDay 2: Bungee jumping, Rock climbing\nDay 3: Rappelling, Zip-lining\nDay 4: Extreme skiing, Departure",
      duration: 4,
      nights: 3,
      price: 29000,
      originalPrice: 32000,
      maxGroupSize: 8,
      minGroupSize: 2,
      type: PackageType.ADVENTURE,
      inclusions: [
        "3 nights accommodation",
        "All extreme sports activities",
        "Professional instructors",
        "Safety equipment",
        "Medical support",
        "Insurance coverage",
      ],
      exclusions: [
        "Personal expenses",
        "Medical expenses beyond coverage",
        "Personal equipment",
        "Additional activities",
      ],
      images: ["extreme1.jpg", "extreme2.jpg", "extreme3.jpg"],
      destinations: ["Manali", "Solang Valley", "Adventure Zones"],
      rating: 4.7,
      reviewCount: 52,
      terms:
        "Age 18-45 years. Medical fitness mandatory. High-risk activities.",
      cancellationPolicy:
        "Medical fitness dependent. 50% refund if cancelled 10 days before.",
    },
  ];

  const createdPackages = [];

  for (const packageData of packagesData) {
    const existingPackage = await packageRepository.findOne({
      where: { name: packageData.name },
    });

    if (!existingPackage) {
      const packageEntity = packageRepository.create({
        ...packageData,
        createdById: adminUser.id,
        status: PackageStatus.ACTIVE,
        isActive: true,
      });

      const savedPackage = await packageRepository.save(packageEntity);
      createdPackages.push(savedPackage);
    }
  }

  // Create sample schedules for each package
  for (const packageEntity of createdPackages) {
    const schedules = [
      {
        startDate: "2024-12-20",
        endDate: "2024-12-24",
        availableSlots: Math.floor(packageEntity.maxGroupSize * 0.8),
        specialPrice: packageEntity.price * 1.1,
        status: PackageScheduleStatus.AVAILABLE,
        notes: "Christmas special batch",
        pickupLocation: "Mall Road Bus Stand, Manali",
        pickupTime: "08:00:00",
      },
      {
        startDate: "2024-12-25",
        endDate: "2024-12-29",
        availableSlots: Math.floor(packageEntity.maxGroupSize * 0.9),
        specialPrice: packageEntity.price * 1.2,
        status: PackageScheduleStatus.AVAILABLE,
        notes: "New Year special batch",
        pickupLocation: "Mall Road Bus Stand, Manali",
        pickupTime: "07:00:00",
      },
      {
        startDate: "2025-01-15",
        endDate: "2025-01-19",
        availableSlots: packageEntity.maxGroupSize,
        specialPrice: packageEntity.price,
        status: PackageScheduleStatus.AVAILABLE,
        notes: "Regular batch",
        pickupLocation: "Mall Road Bus Stand, Manali",
        pickupTime: "08:30:00",
      },
      {
        startDate: "2025-02-14",
        endDate: "2025-02-18",
        availableSlots: Math.floor(packageEntity.maxGroupSize * 0.7),
        specialPrice: packageEntity.price * 1.15,
        status: PackageScheduleStatus.AVAILABLE,
        notes: "Valentine special batch",
        pickupLocation: "Mall Road Bus Stand, Manali",
        pickupTime: "09:00:00",
      },
      {
        startDate: "2025-03-01",
        endDate: "2025-03-05",
        availableSlots: packageEntity.maxGroupSize,
        specialPrice: packageEntity.price * 0.95,
        status: PackageScheduleStatus.AVAILABLE,
        notes: "Early spring discount",
        pickupLocation: "Mall Road Bus Stand, Manali",
        pickupTime: "08:00:00",
      },
    ];

    for (const scheduleData of schedules) {
      const endDate = new Date(scheduleData.startDate);
      endDate.setDate(endDate.getDate() + packageEntity.duration - 1);

      const existingSchedule = await scheduleRepository.findOne({
        where: {
          packageId: packageEntity.id,
          startDate: new Date(scheduleData.startDate),
        },
      });

      if (!existingSchedule) {
        const schedule = scheduleRepository.create({
          ...scheduleData,
          startDate: new Date(scheduleData.startDate),
          endDate: new Date(scheduleData.endDate),
          packageId: packageEntity.id,
          createdById: adminUser.id,
          isActive: true,
          bookedSlots: 0,
        });

        await scheduleRepository.save(schedule);
      }
    }
  }
}
