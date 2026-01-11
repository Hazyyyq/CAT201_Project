package com.kakigamerz;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class SignUpServlet extends HttpServlet {

    private final File jsonFile = new File("src/Data/users.json");

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Gson gson = new Gson();
        User newUser = gson.fromJson(req.getReader(), User.class);

        List<User> users = new ArrayList<>();
        if (jsonFile.exists()) {
            String content = Files.readString(jsonFile.toPath(), StandardCharsets.UTF_8);
            users = gson.fromJson(content, new TypeToken<ArrayList<User>>() {}.getType());
        }

        // OOP FIX: Use .getEmail()
        for (User u : users) {
            if (u.getEmail().equals(newUser.getEmail())) {
                resp.setStatus(HttpServletResponse.SC_CONFLICT);
                resp.getWriter().write("{\"message\": \"Email already exists\"}");
                return;
            }
        }

        // OOP FIX: Use Setters
        newUser.setId(UUID.randomUUID().toString());
        newUser.setRole("customer");
        users.add(newUser);

        String updatedJson = gson.toJson(users);
        Files.writeString(jsonFile.toPath(), updatedJson);

        resp.getWriter().write("{\"message\": \"User registered successfully\"}");
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        if (jsonFile.exists()) {
            String jsonContent = Files.readString(jsonFile.toPath(), StandardCharsets.UTF_8);
            resp.getWriter().print(jsonContent);
        } else {
            resp.getWriter().print("[]");
        }
    }
}