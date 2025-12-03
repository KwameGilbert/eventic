// Mock event data - replace with API calls later
export const featuredEvents = [
    {
        id: 1,
        title: "ProSoccer FC vs Tigers FC",
        eventSlug: "prosoccer-fc-vs-tigers-fc",
        venue: "ProSoccer Stadium: Fulham, United Kingdom",
        date: "Sat 27 Dec 2025, 9:00 PM EST",
        image: "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=1920&q=80",
        category: "Sport / Fitness",
    },
    {
        id: 2,
        title: "Summer Music Festival 2025",
        eventSlug: "summer-music-festival-2025",
        venue: "Central Park Arena: New York, United States",
        date: "Fri 15 Aug 2025, 6:00 PM EDT",
        image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1920&q=80",
        category: "Concert / Music",
    },
    {
        id: 3,
        title: "Tech Innovation Summit",
        eventSlug: "tech-innovation-summit",
        venue: "Convention Center: San Francisco, United States",
        date: "Mon 10 Nov 2025, 9:00 AM PST",
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80",
        category: "Conference",
    },
    {
        id: 4,
        title: "Broadway Night: Hamilton",
        eventSlug: "broadway-night-hamilton",
        venue: "Grand Theater: London, United Kingdom",
        date: "Thu 5 Sep 2025, 7:30 PM GMT",
        image: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=1920&q=80",
        category: "Theater / Arts",
    },
    {
        id: 5,
        title: "Marathon Challenge 2025",
        eventSlug: "marathon-challenge-2025",
        venue: "City Marathon Route: Boston, United States",
        date: "Sun 20 Apr 2025, 7:00 AM EDT",
        image: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=1920&q=80",
        category: "Sport / Fitness",
    },
];

export const upcomingEvents = [
    // Featured Events (also in carousel)
    {
        id: 1,
        title: "ProSoccer FC vs Tigers FC",
        eventSlug: "prosoccer-fc-vs-tigers-fc",
        description: "Experience the thrill of live football as ProSoccer FC takes on Tigers FC in this highly anticipated match. Watch world-class players compete in an electrifying atmosphere at the iconic ProSoccer Stadium. This Premier League showdown promises to deliver non-stop action, incredible goals, and unforgettable moments.",
        venue: "ProSoccer Stadium",
        location: "Fulham",
        country: "United Kingdom",
        date: "2025-12-27",
        time: "9:00 PM EST",
        price: "$75",
        numericPrice: 75,
        category: "Sport / Fitness",
        slug: "sport-fitness",
        audience: "Sports Fans, Families, All Ages",
        isOnline: false,
        image: "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=1920&q=80",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2484.!2d-0.221!3d51.475!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTHCsDI4JzMwLjAiTiAwwrAxMycxNS42Ilc!5e0!3m2!1sen!2suk!4v1234567890",
        tags: ["Football", "Soccer", "Premier League", "Sports"],
        ticketTypes: [
            {
                name: "General Admission",
                price: 75,
                originalPrice: 95,
                available: true,
                availableQuantity: 5000,
                maxPerAttendee: 8,
                description: "Standard stadium seating with great views"
            },
            {
                name: "Premium Seats",
                price: 150,
                originalPrice: 180,
                available: true,
                availableQuantity: 500,
                maxPerAttendee: 6,
                description: "Premium seating closer to the pitch"
            },
            {
                name: "VIP Box",
                price: 350,
                available: true,
                availableQuantity: 50,
                maxPerAttendee: 4,
                description: "Private box with catering and premium amenities"
            }
        ],
        contact: {
            website: "https://prosoccerfc.com",
            email: "tickets@prosoccerfc.com",
            phone: "+44 20 7946 0958"
        },
        socialMedia: {
            facebook: "https://www.facebook.com/prosoccerfc",
            twitter: "https://twitter.com/prosoccerfc",
            instagram: "https://www.instagram.com/prosoccerfc"
        },
        videoUrl: "https://www.youtube.com/embed/MusyO7J2inM"
    },
    {
        id: 2,
        title: "Summer Music Festival 2025",
        eventSlug: "summer-music-festival-2025",
        description: "Join us for the biggest music event of the summer! Summer Music Festival 2025 features over 50 artists across multiple stages, including headliners from pop, rock, hip-hop, and electronic music. Enjoy food trucks, art installations, and an unforgettable weekend of live music in the heart of Central Park.",
        venue: "Central Park Arena",
        location: "New York",
        country: "United States",
        date: "2025-08-15",
        time: "6:00 PM EDT",
        price: "$120",
        numericPrice: 120,
        category: "Concert / Music",
        slug: "concert-music",
        audience: "Music Lovers, Young Adults, Festival Goers",
        isOnline: false,
        image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1920&q=80",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.!2d-73.968!3d40.785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQ3JzA2LjAiTiA3M8KwNTgnMDQuOCJX!5e0!3m2!1sen!2sus!4v1234567890",
        tags: ["Music Festival", "Live Music", "Summer", "Outdoor"],
        ticketTypes: [
            {
                name: "General Admission",
                price: 120,
                originalPrice: 150,
                available: true,
                availableQuantity: 10000,
                maxPerAttendee: 6,
                description: "Access to all stages and festival grounds"
            },
            {
                name: "VIP Pass",
                price: 250,
                originalPrice: 300,
                available: true,
                availableQuantity: 1000,
                maxPerAttendee: 4,
                description: "VIP viewing areas, express entry, and exclusive lounge access"
            },
            {
                name: "Weekend Pass",
                price: 350,
                available: true,
                availableQuantity: 500,
                maxPerAttendee: 2,
                description: "All-access 3-day pass with backstage tours"
            }
        ],
        contact: {
            website: "https://summermusicfest.com",
            email: "info@summermusicfest.com",
            phone: "+1 212 555 0199"
        },
        socialMedia: {
            facebook: "https://www.facebook.com/summermusicfest",
            twitter: "https://twitter.com/summermusicfest",
            instagram: "https://www.instagram.com/summermusicfest",
            linkedin: "https://www.linkedin.com/company/summer-music-festival"
        },
        videoUrl: "https://www.youtube.com/embed/IHNzOHi8sJs"
    },
    {
        id: 3,
        title: "Tech Innovation Summit",
        eventSlug: "tech-innovation-summit",
        description: "The premier technology conference bringing together industry leaders, innovators, and entrepreneurs. Explore cutting-edge technologies, attend keynote speeches from tech giants, participate in workshops, and network with professionals from around the world. Topics include AI, blockchain, cloud computing, and sustainable tech.",
        venue: "Convention Center",
        location: "San Francisco",
        country: "United States",
        date: "2025-11-10",
        time: "9:00 AM PST",
        price: "$299",
        numericPrice: 299,
        category: "Conference",
        slug: "conference",
        audience: "Tech Professionals, Entrepreneurs, Developers",
        isOnline: false,
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.!2d-122.401!3d37.784!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDQ3JzAyLjQiTiAxMjLCsDI0JzAzLjYiVw!5e0!3m2!1sen!2sus!4v1234567890",
        tags: ["Technology", "Conference", "Innovation", "Networking"],
        ticketTypes: [
            {
                name: "Early Bird",
                price: 299,
                originalPrice: 399,
                available: true,
                availableQuantity: 500,
                maxPerAttendee: 3,
                description: "Full conference access with early bird discount"
            },
            {
                name: "Professional Pass",
                price: 499,
                available: true,
                availableQuantity: 1000,
                maxPerAttendee: 5,
                description: "Conference access plus workshop sessions"
            },
            {
                name: "VIP Package",
                price: 899,
                available: true,
                availableQuantity: 100,
                maxPerAttendee: 2,
                description: "All-access pass with exclusive networking dinners and speaker meet-and-greets"
            }
        ],
        contact: {
            website: "https://techinnovationsummit.com",
            email: "register@techinnovationsummit.com",
            phone: "+1 415 555 0147"
        },
        socialMedia: {
            facebook: "https://www.facebook.com/techinnovationsummit",
            twitter: "https://twitter.com/techinnovsummit",
            instagram: "https://www.instagram.com/techinnovationsummit",
            linkedin: "https://www.linkedin.com/company/tech-innovation-summit"
        },
        videoUrl: "https://www.youtube.com/embed/d1MWxduI_2g"
    },
    {
        id: 4,
        title: "Broadway Night: Hamilton",
        eventSlug: "broadway-night-hamilton",
        description: "Experience the award-winning musical phenomenon Hamilton at the Grand Theater! This revolutionary story of American founding father Alexander Hamilton is an explosive blend of hip-hop, jazz, R&B, and Broadway. Don't miss this critically acclaimed production that has captivated audiences worldwide.",
        venue: "Grand Theater",
        location: "London",
        country: "United Kingdom",
        date: "2025-09-05",
        time: "7:30 PM GMT",
        price: "$125",
        numericPrice: 125,
        category: "Theater / Arts",
        slug: "theater-arts",
        audience: "Theater Lovers, Families, Musical Enthusiasts",
        isOnline: false,
        image: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=1920&q=80",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.!2d-0.128!3d51.507!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTHCsDMwJzI1LjIiTiAwwrAwNyc0MC44Ilc!5e0!3m2!1sen!2suk!4v1234567890",
        tags: ["Musical", "Broadway", "Theater", "Hamilton"],
        ticketTypes: [
            {
                name: "Balcony",
                price: 125,
                available: true,
                availableQuantity: 300,
                maxPerAttendee: 6,
                description: "Upper level seating with full stage view"
            },
            {
                name: "Orchestra",
                price: 225,
                originalPrice: 275,
                available: true,
                availableQuantity: 200,
                maxPerAttendee: 4,
                description: "Premium ground floor seating"
            },
            {
                name: "Premium Orchestra",
                price: 350,
                available: true,
                availableQuantity: 50,
                maxPerAttendee: 4,
                description: "Best seats in the house, center orchestra"
            }
        ],
        contact: {
            website: "https://grandtheater.co.uk",
            email: "boxoffice@grandtheater.co.uk",
            phone: "+44 20 7492 1500"
        },
        socialMedia: {
            facebook: "https://www.facebook.com/grandtheaterlondon",
            twitter: "https://twitter.com/grandtheatre",
            instagram: "https://www.instagram.com/grandtheatrelondon"
        },
        videoUrl: "https://www.youtube.com/embed/VU0GYNJ8yfA"
    },
    {
        id: 5,
        title: "Marathon Challenge 2025",
        eventSlug: "marathon-challenge-2025",
        description: "Lace up your running shoes for the annual Boston Marathon Challenge! Choose from the full marathon (26.2 miles), half marathon (13.1 miles), or 10K fun run. The scenic route takes you through historic Boston neighborhoods with thousands of cheering spectators. All proceeds support local charities.",
        venue: "City Marathon Route",
        location: "Boston",
        country: "United States",
        date: "2025-04-20",
        time: "7:00 AM EDT",
        price: "$85",
        numericPrice: 85,
        category: "Sport / Fitness",
        slug: "sport-fitness",
        audience: "Runners, Fitness Enthusiasts, All Ages",
        isOnline: false,
        image: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=1920&q=80",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2948.!2d-71.058!3d42.361!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDLCsDIxJzM5LjYiTiA3McKwMDMnMjguOCJX!5e0!3m2!1sen!2sus!4v1234567890",
        tags: ["Marathon", "Running", "Charity", "Fitness"],
        ticketTypes: [
            {
                name: "10K Registration",
                price: 85,
                available: true,
                availableQuantity: 2000,
                maxPerAttendee: 1,
                description: "10K fun run entry with race packet and finisher medal"
            },
            {
                name: "Half Marathon",
                price: 125,
                available: true,
                availableQuantity: 1500,
                maxPerAttendee: 1,
                description: "Half marathon entry with timing chip and official certificate"
            },
            {
                name: "Full Marathon",
                price: 175,
                originalPrice: 200,
                available: true,
                availableQuantity: 1000,
                maxPerAttendee: 1,
                description: "Full marathon entry with premium race packet and exclusive finisher jacket"
            }
        ],
        contact: {
            website: "https://bostonmarathonchallenge.com",
            email: "info@bostonmarathonchallenge.com",
            phone: "+1 617 555 0189"
        },
        socialMedia: {
            facebook: "https://www.facebook.com/bostonmarathonchallenge",
            twitter: "https://twitter.com/bostonmarathon",
            instagram: "https://www.instagram.com/bostonmarathonchallenge"
        },
        videoUrl: "https://www.youtube.com/embed/8BVc4_flBJs"
    },
    // Original Upcoming Events
    {
        id: 6,
        title: "Jazz Night Live",
        eventSlug: "jazz-night-live",
        description: "Experience an unforgettable evening of smooth jazz with world-renowned artists. This intimate performance features a carefully curated selection of contemporary and classic jazz pieces that will transport you to a world of musical excellence. The Blue Note Club provides the perfect ambiance for an evening of sophisticated entertainment.",
        venue: "Blue Note Club",
        location: "Accra",
        country: "Ghana",
        date: "2025-12-15",
        time: "8:00 PM",
        price: "$45",
        numericPrice: 45,
        category: "Concert / Music",
        slug: "concert-music",
        audience: "Adults, Jazz Enthusiasts, Music Lovers",
        isOnline: false,
        image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&q=80",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.773449735772!2d-0.186964!3d5.603717!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwMzYnMTMuNCJOIDDCsDExJzEzLjEiVw!5e0!3m2!1sen!2sgh!4v1234567890",
        tags: ["Jazz", "Live Music", "Concert", "Night Event"],
        ticketTypes: [
            {
                name: "Regular",
                price: 45,
                originalPrice: 60,
                available: true,
                availableQuantity: 150,
                maxPerAttendee: 4,
                description: "Standard entry with general seating"
            },
            {
                name: "VIP",
                price: 85,
                originalPrice: 100,
                available: true,
                availableQuantity: 50,
                maxPerAttendee: 2,
                description: "Premium seating, complimentary drinks, and meet & greet"
            },
            {
                name: "Premium Table",
                price: 150,
                available: false,
                availableQuantity: 0,
                maxPerAttendee: 1,
                description: "Reserved table for 4 with bottle service"
            }
        ],
        contact: {
            website: "https://bluenoteclubaccra.com",
            email: "info@bluenoteclubaccra.com",
            phone: "+233 30 276 5432"
        },
        socialMedia: {
            facebook: "https://www.facebook.com/bluenoteclubaccra",
            twitter: "https://twitter.com/bluenotejazz",
            instagram: "https://www.instagram.com/bluenoteclubgh"
        },
        videoUrl: "https://www.youtube.com/embed/vmDDOFXSgAs"
    },
    {
        id: 7,
        title: "Food & Wine Expo",
        eventSlug: "food-wine-expo",
        description: "Indulge in a culinary journey featuring the finest local and international cuisines. Meet renowned chefs, sample exclusive wines, and participate in cooking demonstrations. This expo celebrates the rich flavors of Ghana and beyond, offering tastings, masterclasses, and networking opportunities for food enthusiasts.",
        venue: "Exhibition Hall",
        location: "Kumasi",
        country: "Ghana",
        date: "2025-12-20",
        time: "12:00 PM",
        price: "$30",
        numericPrice: 30,
        category: "Food & Drink",
        slug: "food-drink",
        audience: "Food Enthusiasts, Wine Lovers, All Ages",
        isOnline: false,
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3962.445!2d-1.623!3d6.688!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwNDEnMTYuOCJOIDHCsDM3JzIyLjgiVw!5e0!3m2!1sen!2sgh!4v1234567890",
        tags: ["Food", "Wine", "Tasting", "Culinary"],
        ticketTypes: [
            {
                name: "Standard Entry",
                price: 30,
                originalPrice: 40,
                available: true,
                availableQuantity: 500,
                maxPerAttendee: 5,
                description: "Access to all tastings and exhibitions"
            },
            {
                name: "VIP Experience",
                price: 60,
                originalPrice: 80,
                available: true,
                availableQuantity: 100,
                maxPerAttendee: 3,
                description: "Includes masterclass sessions and premium wine tasting"
            }
        ],
        contact: {
            website: "https://foodwineexpoghana.com",
            email: "hello@foodwineexpo.com",
            phone: "+233 32 202 8765"
        },
        socialMedia: {
            facebook: "https://www.facebook.com/foodwineexpogh",
            twitter: "https://twitter.com/foodwineexpo",
            instagram: "https://www.instagram.com/foodwineexpogh",
            linkedin: "https://www.linkedin.com/company/food-wine-expo-ghana"
        },
        videoUrl: "https://www.youtube.com/embed/Yia77tcPr9A"
    },
    {
        id: 8,
        title: "Comedy Show",
        eventSlug: "comedy-show",
        description: "Get ready for a night of non-stop laughter with Ghana's top comedians! This hilarious show features stand-up performances, improv comedy, and special guest appearances. Perfect for a fun evening out with friends and family. Doors open at 8:30 PM for pre-show entertainment.",
        venue: "Laugh Factory",
        location: "Accra",
        country: "Ghana",
        date: "2025-12-18",
        time: "9:00 PM",
        price: "$35",
        numericPrice: 35,
        category: "Entertainment",
        slug: "entertainment",
        audience: "Adults, Families, Comedy Fans",
        isOnline: false,
        image: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&q=80",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.773449735772!2d-0.186964!3d5.603717!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwMzYnMTMuNCJOIDDCsDExJzEzLjEiVw!5e0!3m2!1sen!2sgh!4v1234567890",
        tags: ["Comedy", "Stand-up", "Entertainment", "Night Out"],
        ticketTypes: [
            {
                name: "General Admission",
                price: 35,
                available: true,
                availableQuantity: 200,
                maxPerAttendee: 6,
                description: "Standard seating with full show access"
            },
            {
                name: "VIP Seating",
                price: 55,
                originalPrice: 70,
                available: true,
                availableQuantity: 75,
                maxPerAttendee: 4,
                description: "Front row seating with complimentary snacks"
            },
            {
                name: "Table for 4",
                price: 180,
                originalPrice: 220,
                available: true,
                availableQuantity: 25,
                maxPerAttendee: 1,
                description: "Reserved table seating for group of 4 with table service"
            }
        ],
        contact: {
            website: "https://laughfactoryaccra.com",
            email: "bookings@laughfactory.gh",
            phone: "+233 24 567 8901"
        },
        socialMedia: {
            facebook: "https://www.facebook.com/laughfactorygh",
            twitter: "https://twitter.com/laughfactorygh",
            instagram: "https://www.instagram.com/laughfactoryaccra"
        },
        videoUrl: "https://www.youtube.com/embed/yuXm-VHQkV8"
    },
    {
        id: 9,
        title: "Art Gallery Opening",
        eventSlug: "art-gallery-opening",
        venue: "Modern Art Museum",
        location: "Takoradi",
        country: "Ghana",
        date: "2025-12-22",
        time: "6:00 PM",
        price: "Free",
        numericPrice: 0,
        category: "Theater / Arts",
        slug: "theater-arts",
        isOnline: false,
        image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&q=80",
    },
    {
        id: 10,
        title: "Basketball Championship",
        eventSlug: "basketball-championship",
        venue: "Sports Arena",
        location: "Accra",
        country: "Ghana",
        date: "2025-12-25",
        time: "7:00 PM",
        price: "$60",
        numericPrice: 60,
        category: "Sport / Fitness",
        slug: "sport-fitness",
        isOnline: false,
        image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80",
    },
    {
        id: 11,
        title: "Digital Marketing Summit",
        eventSlug: "digital-marketing-summit",
        venue: "Business Convention Center",
        location: "Online",
        country: "USA",
        date: "2026-01-05",
        time: "9:00 AM",
        price: "$150",
        numericPrice: 150,
        category: "Conference",
        slug: "conference",
        isOnline: true,
        image: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&q=80",
    },
    {
        id: 12,
        title: "Indie Film Festival",
        eventSlug: "indie-film-festival",
        venue: "Grand Cinema",
        location: "Kumasi",
        country: "Ghana",
        date: "2026-01-08",
        time: "5:00 PM",
        price: "$25",
        numericPrice: 25,
        category: "Cinema",
        slug: "cinema",
        isOnline: false,
        image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80",
    },
    {
        id: 13,
        title: "Rock Concert: The Legends",
        eventSlug: "rock-concert-the-legends",
        venue: "Stadium Arena",
        location: "Accra",
        country: "Ghana",
        date: "2026-01-12",
        time: "8:00 PM",
        price: "$85",
        numericPrice: 85,
        category: "Concert / Music",
        slug: "concert-music",
        isOnline: false,
        image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80",
    },
    {
        id: 14,
        title: "Yoga & Wellness Retreat",
        eventSlug: "yoga-wellness-retreat",
        venue: "Serenity Wellness Center",
        location: "Takoradi",
        country: "Ghana",
        date: "2026-01-15",
        time: "7:00 AM",
        price: "$40",
        numericPrice: 40,
        category: "Sport / Fitness",
        slug: "sport-fitness",
        isOnline: false,
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
    },
];

export const featuredCategories = [
    {
        id: 1,
        name: "Concert / Music",
        icon: "🎵",
        eventCount: 128,
        image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80",
        color: "from-purple-500 to-pink-500",
    },
    {
        id: 2,
        name: "Sport / Fitness",
        icon: "⚽",
        eventCount: 94,
        image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80",
        color: "from-green-500 to-emerald-500",
    },
    {
        id: 3,
        name: "Theater / Arts",
        icon: "🎭",
        eventCount: 76,
        image: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=600&q=80",
        color: "from-red-500 to-orange-500",
    },
    {
        id: 4,
        name: "Food & Drink",
        icon: "🍷",
        eventCount: 52,
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
        color: "from-yellow-500 to-amber-500",
    },
    {
        id: 5,
        name: "Conference",
        icon: "💼",
        eventCount: 68,
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
        color: "from-blue-500 to-cyan-500",
    },
    {
        id: 6,
        name: "Cinema",
        icon: "🎬",
        eventCount: 42,
        image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&q=80",
        color: "from-indigo-500 to-purple-500",
    },
];

// Categories for navigation dropdown
export const categories = [
    { id: 1, name: "Concert / Music", icon: "🎵", slug: "concert-music" },
    { id: 2, name: "Sport / Fitness", icon: "⚽", slug: "sport-fitness" },
    { id: 3, name: "Theater / Arts", icon: "🎭", slug: "theater-arts" },
    { id: 4, name: "Food & Drink", icon: "🍷", slug: "food-drink" },
    { id: 5, name: "Conference", icon: "💼", slug: "conference" },
    { id: 6, name: "Cinema", icon: "🎬", slug: "cinema" },
    { id: 7, name: "Exhibition", icon: "🖼️", slug: "exhibition" },
    { id: 8, name: "Workshop", icon: "🔧", slug: "workshop" },
];

