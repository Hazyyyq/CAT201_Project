package com.kakigamerz;

import java.util.List;

public class Product {
    public long id;
    public String name;
    public String category;
    public double price;
    public Double oldPrice; // Use Double so it can be null
    public String badge;    // To hold "-20%", "NEW", etc.
    public int stock;
    public String desc;
    public String image;

    // Complex types for Phone/Watch/Tablet
    public List<Spec> specs;
    public List<Color> colors;

    public static class Spec {
        public String icon;
        public String label;
    }

    public static class Color {
        public String name;
        public String hex;
    }
}