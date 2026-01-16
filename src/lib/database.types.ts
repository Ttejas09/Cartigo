export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          icon: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          icon: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          icon?: string;
          created_at?: string;
        };
      };
      stores: {
        Row: {
          id: string;
          name: string;
          location: string;
          address: string;
          rating: number;
          verified: boolean;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          location: string;
          address: string;
          rating?: number;
          verified?: boolean;
          image_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          location?: string;
          address?: string;
          rating?: number;
          verified?: boolean;
          image_url?: string | null;
          created_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          price: number;
          original_price: number | null;
          category_id: string | null;
          store_id: string | null;
          images: string[];
          open_box_delivery: boolean;
          return_policy: string;
          stock: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          price: number;
          original_price?: number | null;
          category_id?: string | null;
          store_id?: string | null;
          images?: string[];
          open_box_delivery?: boolean;
          return_policy?: string;
          stock?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          price?: number;
          original_price?: number | null;
          category_id?: string | null;
          store_id?: string | null;
          images?: string[];
          open_box_delivery?: boolean;
          return_policy?: string;
          stock?: number;
          created_at?: string;
        };
      };
      delivery_slots: {
        Row: {
          id: string;
          label: string;
          start_time: string;
          end_time: string;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          label: string;
          start_time: string;
          end_time: string;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          label?: string;
          start_time?: string;
          end_time?: string;
          active?: boolean;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string | null;
          product_id: string | null;
          quantity: number;
          delivery_slot_id: string | null;
          delivery_address: string;
          payment_method: string;
          status: string;
          total_amount: number;
          delivery_fee: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          product_id?: string | null;
          quantity?: number;
          delivery_slot_id?: string | null;
          delivery_address: string;
          payment_method: string;
          status?: string;
          total_amount: number;
          delivery_fee?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          product_id?: string | null;
          quantity?: number;
          delivery_slot_id?: string | null;
          delivery_address?: string;
          payment_method?: string;
          status?: string;
          total_amount?: number;
          delivery_fee?: number;
          created_at?: string;
        };
      };
      cart: {
        Row: {
          id: string;
          user_id: string | null;
          product_id: string | null;
          quantity: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          product_id?: string | null;
          quantity?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          product_id?: string | null;
          quantity?: number;
          created_at?: string;
        };
      };
    };
  };
}
