package com.kakigamerz;

public class User {
    public String id;
    public String email;
    public String password; // In a real app, never store plain text passwords!
    public String name;
    public String role; // "admin" or "customer"

    public User(String id, String email, String password, String name, String role) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.name = name;
        this.role = role;
    }
}