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

    // UPDATE: Pointing to your new Data folder
    private final File jsonFile = new File("src/Data/users.json");

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        // 2. Read the JSON body from React
        Gson gson = new Gson();
        User newUser = gson.fromJson(req.getReader(), User.class);

        // 3. Read Existing Users
        List<User> users = new ArrayList<>();
        if (jsonFile.exists()) {
            String content = Files.readString(jsonFile.toPath(), StandardCharsets.UTF_8);
            users = gson.fromJson(content, new TypeToken<ArrayList<User>>() {
            }.getType());
        }

        // 4. Check if email already exists
        for (User u : users) {
            if (u.email.equals(newUser.email)) {
                resp.setStatus(HttpServletResponse.SC_CONFLICT); // 409 Conflict
                resp.getWriter().write("{\"message\": \"Email already exists\"}");
                return;
            }
        }

        // 5. Add the new user
        newUser.id = UUID.randomUUID().toString(); // Generate unique ID
        newUser.role = "customer";
        users.add(newUser);

        // 6. Save back to file
        String updatedJson = gson.toJson(users);
        Files.writeString(jsonFile.toPath(), updatedJson);

        // 7. Success
        resp.getWriter().write("{\"message\": \"User registered successfully\"}");
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        // 1. Prepare JSON response
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        // 2. Read the file
        if (jsonFile.exists()) {
            String jsonContent = Files.readString(jsonFile.toPath(), StandardCharsets.UTF_8);
            resp.getWriter().print(jsonContent);
        } else {
            resp.getWriter().print("[]"); // Return empty list if no users yet
        }
    }
}