package com.kakigamerz;

public class User {
    // 1. Private fields (Encapsulation)
    private String id;
    private String email;
    private String password;
    private String name;
    private String role;

    // 2. No-Arg Constructor (Required for Gson/Standard Java Beans)
    public User() {
    }

    // 3. Parameterized Constructor
    public User(String id, String email, String password, String name, String role) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.name = name;
        this.role = role;
    }

    // 4. Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}