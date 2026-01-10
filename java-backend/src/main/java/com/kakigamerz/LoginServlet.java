package com.kakigamerz;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;

public class LoginServlet extends HttpServlet {

    // UPDATE: Pointing to your new Data folder
    private final File jsonFile = new File("src/Data/users.json");

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        // 2. Parse Login Data
        Gson gson = new Gson();
        User loginAttempt = gson.fromJson(req.getReader(), User.class);

        // 3. Read Users File
        if (!jsonFile.exists()) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            resp.getWriter().write("{\"success\": false, \"message\": \"User database empty\"}");
            return;
        }

        String content = Files.readString(jsonFile.toPath(), StandardCharsets.UTF_8);
        List<User> users = gson.fromJson(content, new TypeToken<ArrayList<User>>(){}.getType());

        // 4. Check Credentials
        if (users != null) {
            for (User u : users) {
                if (u.email.equals(loginAttempt.email) && u.password.equals(loginAttempt.password)) {
                    u.password = null; // Don't send password back to frontend
                    String userJson = gson.toJson(u);
                    resp.getWriter().write(userJson);
                    return;
                }
            }
        }

        // 5. Fail
        resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        resp.getWriter().write("{\"success\": false, \"message\": \"Invalid email or password\"}");
    }

}