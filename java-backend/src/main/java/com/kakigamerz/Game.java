package com.kakigamerz;

public class Game {
    // These names MUST match your JSON keys exactly
    public int id;
    public String name;
    public double price;
    public Double oldPrice; // "Double" (capital D) allows this to be null
    public String image;
    public String badge;

    // Empty constructor (Gson uses this)
    public Game() {}

    // Full constructor (Useful if you want to add games manually later)
    public Game(int id, String name, double price, Double oldPrice, String image, String badge) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.oldPrice = oldPrice;
        this.image = image;
        this.badge = badge;
    }
}