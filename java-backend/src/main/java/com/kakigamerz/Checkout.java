package com.kakigamerz;

import java.util.List;

public class Checkout {
    // 1. Private Field
    private List<CartItem> items;

    // 2. Getter and Setter
    public List<CartItem> getItems() { return items; }
    public void setItems(List<CartItem> items) { this.items = items; }

    // 3. Encapsulated Inner Class
    public static class CartItem {
        private long id;
        private String name;

        public long getId() { return id; }
        public void setId(long id) { this.id = id; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }
}