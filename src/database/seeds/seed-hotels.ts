import { DataSource } from 'typeorm';
import { Hotel, HotelType, HotelStatus } from '../../hotels/entities/hotel.entity';
import { HotelSchedule, ScheduleStatus } from '../../hotels/entities/hotel-schedule.entity';
import { User } from '../../users/entities/user.entity';

export async function seedHotels(dataSource: DataSource) {
  const hotelRepository = dataSource.getRepository(Hotel);
  const scheduleRepository = dataSource.getRepository(HotelSchedule);
  const userRepository = dataSource.getRepository(User);

  // Get admin user
  const adminUser = await userRepository.findOne({
    where: { email: 'admin@manali.com' },
  });

  if (!adminUser) {
    throw new Error('Admin user not found. Please run admin seed first.');
  }

  const hotelsData = [
    {
      name: "Hotel Snow Peak Manali",
      description: "Luxury hotel with stunning mountain views, located in the heart of Manali. Experience world-class hospitality with modern amenities.",
      address: "Mall Road, Near Bus Stand",
      city: "Manali",
      state: "Himachal Pradesh",
      pincode: "175131",
      phone: "+91-1902-252000",
      email: "info@snowpeakmanali.com",
      pricePerNight: 5500,
      totalRooms: 50,
      availableRooms: 45,
      type: HotelType.LUXURY,
      amenities: ["WiFi", "Swimming Pool", "Spa", "Restaurant", "Room Service", "Gym", "Parking"],
      images: ["hotel1.jpg", "hotel2.jpg", "hotel3.jpg"],
      rating: 4.5,
      reviewCount: 128,
      latitude: 32.2396,
      longitude: 77.1887
    },
    {
      name: "Mountain View Lodge",
      description: "Cozy budget-friendly accommodation with beautiful mountain views. Perfect for backpackers and budget travelers.",
      address: "Old Manali Road",
      city: "Manali",
      state: "Himachal Pradesh",
      pincode: "175131",
      phone: "+91-1902-252001",
      email: "info@mountainviewlodge.com",
      pricePerNight: 2000,
      totalRooms: 25,
      availableRooms: 20,
      type: HotelType.BUDGET,
      amenities: ["WiFi", "Restaurant", "Parking"],
      images: ["lodge1.jpg", "lodge2.jpg"],
      rating: 4.0,
      reviewCount: 85,
      latitude: 32.2450,
      longitude: 77.1900
    },
    {
      name: "Royal Himalayan Resort",
      description: "Premium resort offering luxurious stays with panoramic Himalayan views. Features spa, multiple restaurants and recreational facilities.",
      address: "Hadimba Road, Near Hadimba Temple",
      city: "Manali",
      state: "Himachal Pradesh",
      pincode: "175131",
      phone: "+91-1902-252002",
      email: "reservations@royalhimalayan.com",
      pricePerNight: 8500,
      totalRooms: 75,
      availableRooms: 68,
      type: HotelType.RESORT,
      amenities: ["WiFi", "Swimming Pool", "Spa", "Multiple Restaurants", "Conference Hall", "Kids Play Area", "Garden"],
      images: ["resort1.jpg", "resort2.jpg", "resort3.jpg", "resort4.jpg"],
      rating: 4.8,
      reviewCount: 245,
      latitude: 32.2345,
      longitude: 77.1756
    },
    {
      name: "Manali Heights Hotel",
      description: "Premium hotel with modern amenities and breathtaking valley views. Ideal for both business and leisure travelers.",
      address: "Circuit House Road",
      city: "Manali",
      state: "Himachal Pradesh",
      pincode: "175131",
      phone: "+91-1902-252003",
      email: "info@manaliheights.com",
      pricePerNight: 4200,
      totalRooms: 40,
      availableRooms: 35,
      type: HotelType.PREMIUM,
      amenities: ["WiFi", "Restaurant", "Bar", "Room Service", "Laundry", "Travel Desk"],
      images: ["heights1.jpg", "heights2.jpg"],
      rating: 4.3,
      reviewCount: 156,
      latitude: 32.2380,
      longitude: 77.1820
    },
    {
      name: "Solang Valley Inn",
      description: "Charming inn located near Solang Valley, perfect for adventure enthusiasts. Offers easy access to skiing and paragliding.",
      address: "Solang Valley Road",
      city: "Manali",
      state: "Himachal Pradesh",
      pincode: "175131",
      phone: "+91-1902-252004",
      email: "bookings@solangvalleyinn.com",
      pricePerNight: 3200,
      totalRooms: 30,
      availableRooms: 25,
      type: HotelType.BUDGET,
      amenities: ["WiFi", "Restaurant", "Adventure Sports Booking", "Parking"],
      images: ["solang1.jpg", "solang2.jpg"],
      rating: 4.1,
      reviewCount: 92,
      latitude: 32.3019,
      longitude: 77.1574
    },
    {
      name: "Beas River Resort",
      description: "Riverside resort offering tranquil stays by the Beas River. Features riverside dining and water sports activities.",
      address: "Beas River Bank, Kullu-Manali Highway",
      city: "Manali",
      state: "Himachal Pradesh",
      pincode: "175131",
      phone: "+91-1902-252005",
      email: "info@beasriverresort.com",
      pricePerNight: 6200,
      totalRooms: 45,
      availableRooms: 40,
      type: HotelType.RESORT,
      amenities: ["WiFi", "Riverside Restaurant", "Water Sports", "Fishing", "Bonfire", "Spa"],
      images: ["beas1.jpg", "beas2.jpg", "beas3.jpg"],
      rating: 4.6,
      reviewCount: 178,
      latitude: 32.2425,
      longitude: 77.1945
    },
    {
      name: "Apple Orchard Hotel",
      description: "Unique hotel set amidst apple orchards, offering an authentic Himachali experience with organic food and nature walks.",
      address: "Naggar Road, Apple Orchard Area",
      city: "Manali",
      state: "Himachal Pradesh",
      pincode: "175131",
      phone: "+91-1902-252006",
      email: "stay@appleorchardhotel.com",
      pricePerNight: 3800,
      totalRooms: 20,
      availableRooms: 18,
      type: HotelType.PREMIUM,
      amenities: ["WiFi", "Organic Restaurant", "Nature Walks", "Apple Picking", "Library"],
      images: ["orchard1.jpg", "orchard2.jpg"],
      rating: 4.4,
      reviewCount: 67,
      latitude: 32.2156,
      longitude: 77.1634
    },
    {
      name: "Backpacker's Haven",
      description: "Budget hostel perfect for solo travelers and backpackers. Offers dormitory and private rooms with communal areas.",
      address: "Vashisht Road, Near Hot Springs",
      city: "Manali",
      state: "Himachal Pradesh",
      pincode: "175131",
      phone: "+91-1902-252007",
      email: "hello@backpackershaven.com",
      pricePerNight: 800,
      totalRooms: 15,
      availableRooms: 12,
      type: HotelType.BUDGET,
      amenities: ["WiFi", "Common Kitchen", "Laundry", "Travel Information"],
      images: ["hostel1.jpg", "hostel2.jpg"],
      rating: 3.8,
      reviewCount: 143,
      latitude: 32.2489,
      longitude: 77.1623
    },
    {
      name: "Himalayan Grand Hotel",
      description: "Grand luxury hotel offering five-star amenities with traditional Himachali architecture and world-class service.",
      address: "The Mall, Central Manali",
      city: "Manali",
      state: "Himachal Pradesh",
      pincode: "175131",
      phone: "+91-1902-252008",
      email: "reservations@himalayangrand.com",
      pricePerNight: 9500,
      totalRooms: 80,
      availableRooms: 72,
      type: HotelType.LUXURY,
      amenities: ["WiFi", "Multiple Restaurants", "Spa", "Fitness Center", "Business Center", "Concierge", "Valet Parking"],
      images: ["grand1.jpg", "grand2.jpg", "grand3.jpg", "grand4.jpg"],
      rating: 4.9,
      reviewCount: 312,
      latitude: 32.2387,
      longitude: 77.1898
    },
    {
      name: "Pine Valley Resort",
      description: "Serene resort nestled among pine trees, offering peaceful accommodation with nature views and meditation spaces.",
      address: "Pine Forest Area, Manali-Leh Highway",
      city: "Manali",
      state: "Himachal Pradesh",
      pincode: "175131",
      phone: "+91-1902-252009",
      email: "bookings@pinevalleyresort.com",
      pricePerNight: 4800,
      totalRooms: 35,
      availableRooms: 30,
      type: HotelType.PREMIUM,
      amenities: ["WiFi", "Restaurant", "Meditation Hall", "Nature Trails", "Yoga Classes"],
      images: ["pine1.jpg", "pine2.jpg", "pine3.jpg"],
      rating: 4.2,
      reviewCount: 98,
      latitude: 32.2467,
      longitude: 77.2012
    },
    {
      name: "Rohtang View Hotel",
      description: "Hotel offering spectacular views of Rohtang Pass and snow-capped peaks. Perfect base for Rohtang excursions.",
      address: "Manali-Rohtang Highway",
      city: "Manali",
      state: "Himachal Pradesh",
      pincode: "175131",
      phone: "+91-1902-252010",
      email: "info@rohtangview.com",
      pricePerNight: 5200,
      totalRooms: 42,
      availableRooms: 38,
      type: HotelType.PREMIUM,
      amenities: ["WiFi", "Restaurant", "Rohtang Tour Booking", "Heating", "Mountain View Rooms"],
      images: ["rohtang1.jpg", "rohtang2.jpg"],
      rating: 4.3,
      reviewCount: 134,
      latitude: 32.2534,
      longitude: 77.1456
    },
    {
      name: "Kullu Valley Inn",
      description: "Traditional inn showcasing local Kullu architecture and culture. Offers authentic local cuisine and cultural programs.",
      address: "Kullu Road, Near Kullu Valley",
      city: "Manali",
      state: "Himachal Pradesh",
      pincode: "175131",
      phone: "+91-1902-252011",
      email: "stay@kulluvalleyinn.com",
      pricePerNight: 2800,
      totalRooms: 28,
      availableRooms: 24,
      type: HotelType.BUDGET,
      amenities: ["WiFi", "Local Cuisine Restaurant", "Cultural Programs", "Traditional Decor"],
      images: ["kullu1.jpg", "kullu2.jpg"],
      rating: 4.0,
      reviewCount: 76,
      latitude: 32.2298,
      longitude: 77.1987
    },
    {
      name: "Snow Valley Resort",
      description: "High-altitude resort perfect for snow activities and mountain adventures. Features heated pools and ski equipment rental.",
      address: "Upper Manali, Near Snow Point",
      city: "Manali",
      state: "Himachal Pradesh",
      pincode: "175131",
      phone: "+91-1902-252012",
      email: "bookings@snowvalleyresort.com",
      pricePerNight: 7200,
      totalRooms: 55,
      availableRooms: 50,
      type: HotelType.RESORT,
      amenities: ["WiFi", "Heated Pool", "Ski Equipment Rental", "Restaurant", "Bar", "Spa"],
      images: ["snow1.jpg", "snow2.jpg", "snow3.jpg"],
      rating: 4.5,
      reviewCount: 189,
      latitude: 32.2612,
      longitude: 77.1389
    },
    {
      name: "River Bank Cottage",
      description: "Cozy cottages along the riverbank offering intimate stays with private balconies and river views.",
      address: "Manalsu River Bank",
      city: "Manali",
      state: "Himachal Pradesh",
      pincode: "175131",
      phone: "+91-1902-252013",
      email: "info@riverbankcottage.com",
      pricePerNight: 3600,
      totalRooms: 16,
      availableRooms: 14,
      type: HotelType.PREMIUM,
      amenities: ["WiFi", "River View Balconies", "Restaurant", "Fishing", "Private Gardens"],
      images: ["cottage1.jpg", "cottage2.jpg"],
      rating: 4.4,
      reviewCount: 58,
      latitude: 32.2367,
      longitude: 77.1723
    },
    {
      name: "Adventure Base Camp",
      description: "Specialized accommodation for adventure sports enthusiasts with equipment storage and expert guides.",
      address: "Adventure Sports Complex, Solang",
      city: "Manali",
      state: "Himachal Pradesh",
      pincode: "175131",
      phone: "+91-1902-252014",
      email: "stay@adventurebasecamp.com",
      pricePerNight: 2400,
      totalRooms: 22,
      availableRooms: 18,
      type: HotelType.BUDGET,
      amenities: ["WiFi", "Equipment Storage", "Guide Services", "Cafeteria", "First Aid"],
      images: ["adventure1.jpg", "adventure2.jpg"],
      rating: 4.1,
      reviewCount: 112,
      latitude: 32.3087,
      longitude: 77.1598
    },
    {
      name: "Heritage Manali Palace",
      description: "Historic palace converted into luxury hotel, featuring royal architecture and premium amenities with heritage charm.",
      address: "Palace Road, Old Manali",
      city: "Manali",
      state: "Himachal Pradesh",
      pincode: "175131",
      phone: "+91-1902-252015",
      email: "bookings@heritagemanalipalace.com",
      pricePerNight: 8800,
      totalRooms: 38,
      availableRooms: 35,
      type: HotelType.LUXURY,
      amenities: ["WiFi", "Heritage Restaurant", "Royal Suites", "Museum", "Palace Gardens", "Butler Service"],
      images: ["palace1.jpg", "palace2.jpg", "palace3.jpg"],
      rating: 4.7,
      reviewCount: 167,
      latitude: 32.2445,
      longitude: 77.1834
    },
    {
      name: "Eco Valley Resort",
      description: "Environmentally conscious resort focusing on sustainable tourism with solar power and organic farming.",
      address: "Green Valley, Eco Zone",
      city: "Manali",
      state: "Himachal Pradesh",
      pincode: "175131",
      phone: "+91-1902-252016",
      email: "info@ecovalleyresort.com",
      pricePerNight: 4600,
      totalRooms: 32,
      availableRooms: 28,
      type: HotelType.PREMIUM,
      amenities: ["WiFi", "Solar Power", "Organic Restaurant", "Eco Tours", "Recycling Program"],
      images: ["eco1.jpg", "eco2.jpg"],
      rating: 4.3,
      reviewCount: 89,
      latitude: 32.2523,
      longitude: 77.1667
    },
    {
      name: "Family Paradise Hotel",
      description: "Family-oriented hotel with special facilities for children and families. Features play areas and family-friendly activities.",
      address: "Family Zone, Near Schools",
      city: "Manali",
      state: "Himachal Pradesh",
      pincode: "175131",
      phone: "+91-1902-252017",
      email: "bookings@familyparadise.com",
      pricePerNight: 3400,
      totalRooms: 48,
      availableRooms: 42,
      type: HotelType.BUDGET,
      amenities: ["WiFi", "Kids Play Area", "Family Restaurant", "Game Room", "Baby Sitting"],
      images: ["family1.jpg", "family2.jpg"],
      rating: 4.2,
      reviewCount: 201,
      latitude: 32.2401,
      longitude: 77.1845
    },
    {
      name: "Serenity Spa Resort",
      description: "Wellness-focused resort offering comprehensive spa services, yoga sessions, and healing therapies in serene environment.",
      address: "Wellness Valley, Meditation Center",
      city: "Manali",
      state: "Himachal Pradesh",
      pincode: "175131",
      phone: "+91-1902-252018",
      email: "wellness@serenitysparesort.com",
      pricePerNight: 6800,
      totalRooms: 26,
      availableRooms: 23,
      type: HotelType.LUXURY,
      amenities: ["WiFi", "Full Spa", "Yoga Studio", "Meditation Hall", "Wellness Cuisine", "Therapists"],
      images: ["spa1.jpg", "spa2.jpg", "spa3.jpg"],
      rating: 4.6,
      reviewCount: 145,
      latitude: 32.2478,
      longitude: 77.1756
    },
    {
      name: "Budget Valley Stay",
      description: "Simple and clean budget accommodation perfect for budget-conscious travelers. Offers basic amenities with friendly service.",
      address: "Budget Lane, Market Area",
      city: "Manali",
      state: "Himachal Pradesh",
      pincode: "175131",
      phone: "+91-1902-252019",
      email: "info@budgetvalleystay.com",
      pricePerNight: 1200,
      totalRooms: 24,
      availableRooms: 20,
      type: HotelType.BUDGET,
      amenities: ["WiFi", "Basic Restaurant", "Travel Desk", "Laundry"],
      images: ["budget1.jpg", "budget2.jpg"],
      rating: 3.9,
      reviewCount: 87,
      latitude: 32.2365,
      longitude: 77.1876
    }
  ];

  const createdHotels = [];

  for (const hotelData of hotelsData) {
    const existingHotel = await hotelRepository.findOne({
      where: { name: hotelData.name },
    });

    if (!existingHotel) {
      const hotel = hotelRepository.create({
        ...hotelData,
        createdById: adminUser.id,
        status: HotelStatus.ACTIVE,
        isActive: true,
      });

      const savedHotel = await hotelRepository.save(hotel);
      createdHotels.push(savedHotel);
    }
  }

  // Create sample schedules for each hotel
  for (const hotel of createdHotels) {
    const dates = [
      '2024-12-25', '2024-12-26', '2024-12-27', '2024-12-28', '2024-12-29', '2024-12-30', '2024-12-31',
      '2025-01-01', '2025-01-02', '2025-01-03', '2025-01-15', '2025-01-16', '2025-01-17', '2025-02-14',
      '2025-02-15', '2025-02-16', '2025-03-01', '2025-03-02', '2025-03-15', '2025-03-16'
    ];

    for (const date of dates) {
      const existingSchedule = await scheduleRepository.findOne({
        where: { hotelId: hotel.id, date: new Date(date) },
      });

      if (!existingSchedule) {
        const availableRooms = Math.floor(hotel.totalRooms * 0.7); // 70% availability
        const specialPrice = hotel.pricePerNight * (1 + Math.random() * 0.3); // 0-30% price variation

        const schedule = scheduleRepository.create({
          date: new Date(date),
          availableRooms,
          bookedRooms: 0,
          specialPrice: Math.round(specialPrice),
          status: ScheduleStatus.AVAILABLE,
          notes: `Schedule for ${date}`,
          hotelId: hotel.id,
          createdById: adminUser.id,
          isActive: true,
        });

        await scheduleRepository.save(schedule);
      }
    }
  }

}