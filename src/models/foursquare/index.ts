interface FSQRichPlace {
  fsq_id: string;
  categories: Array<
    | {
        id: number;
        name: string;
        icon: {
          id: string;
          created_at: string;
          prefix: string;
          suffix: string;
          width: number;
          height: number;
          classifications: [string];
          tip: {
            id: string;
            created_at: string;
            text: string;
            url: string;
            lang: string;
            agree_count: number;
            disagree_count: number;
          };
        };
      }
    | undefined
  >;
  census_block_id: string;
  chains: [
    {
      id: string;
      name: string;
    }
  ];
  date_closed: string;
  description: string;
  distance: number;
  email: string;
  fax: string;
  features: {
    payment: {
      credit_cards: {
        accepts_credit_cards: any;
        discover: any;
        visa: any;
        diners_club: any;
        master_card: any;
      };
      digital_wallet: {
        accepts_nfc: any;
      };
    };
    food_and_drink: {
      alcohol: {
        beer: any;
        byo: any;
        cocktails: any;
        full_bar: any;
        wine: any;
      };
      meals: {
        breakfast: any;
        brunch: any;
        lunch: any;
        happy_hour: any;
        dessert: any;
        dinner: any;
      };
    };
    services: {
      delivery: any;
      takeout: any;
      drive_through: any;
      dine_in: {
        reservations: any;
        online_reservations: any;
        groups_only_reservations: any;
      };
    };
    amenities: {
      restroom: any;
      smoking: any;
      jukebox: any;
      music: any;
      live_music: any;
      private_room: any;
      outdoor_seating: any;
      tvs: any;
      atm: any;
      coat_check: any;
      wheelchair_accessible: any;
      parking: {
        parking: any;
        street_parking: any;
        valet_parking: any;
        public_lot: any;
        private_lot: any;
      };
    };
  };
  geocodes: {
    drop_off: {
      latitude: number;
      longitude: number;
    };
    front_door: {
      latitude: number;
      longitude: number;
    };
    main: {
      latitude: number;
      longitude: number;
    };
    road: {
      latitude: number;
      longitude: number;
    };
    roof: {
      latitude: number;
      longitude: number;
    };
  };
  hours: {
    display: string;
    is_local_holiday: true;
    open_now: true;
    regular: Array<
      | {
          close: string;
          day: number;
          open: string;
        }
      | undefined
    >;
    seasonal: [
      {
        closed: true;
        end_date: string;
        hours: [
          {
            close: string;
            day: number;
            open: string;
          }
        ];
        start_date: string;
      }
    ];
  };
  hours_popular: Array<
    | {
        close: string;
        day: number;
        open: string;
      }
    | undefined
  >;
  location: {
    address: string;
    address_extended: string;
    admin_region: string;
    country: string;
    cross_street: string;
    dma: string;
    formatted_address: string;
    locality: string;
    po_box: string;
    post_town: string;
    postcode: string;
    region: string;
  };
  menu: string;
  name: string;
  photos: Array<
    | {
        id: string;
        created_at: string;
        prefix: string;
        suffix: string;
        width: number;
        height: number;
        classifications: string[];
        tip: {
          id: string;
          created_at: string;
          text: string;
          url: string;
          lang: string;
          agree_count: number;
          disagree_count: number;
        };
      }
    | undefined
  >;
  popularity: number;
  price: number;
  rating: number;
  related_places: {
    children: any[];
  };
  social_media: {
    facebook_id: string;
    instagram: string;
    twitter: string;
  };
  stats: {
    total_photos: number;
    total_ratings: number;
    total_tips: number;
  };
  tastes: string[];
  tel: string;
  timezone: string;
  tips: Array<
    | {
        id: string;
        created_at: string;
        text: string;
        url: string;
        lang: string;
        agree_count: number;
        disagree_count: number;
      }
    | undefined
  >;
  verified: true;
  website: string;
}

export interface FSQGeocodeLatLng {
  latitude: number;
  longitude: number;
}

export interface FSQPlace extends Partial<FSQRichPlace> {}

export interface FSQContext {
  geo_bounds: {
    circle: {
      /** Meters */
      radius: number;
      center: FSQGeocodeLatLng;
    };
  };
}
