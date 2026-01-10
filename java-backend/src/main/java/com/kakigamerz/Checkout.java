package com.kakigamerz;

import java.util.List;

public class Checkout {
    public List<CartItem> items;

    public static class CartItem {
        public long id;
        public String name;
        // The frontend uses 'id' to find the product in the backend
    }
}
