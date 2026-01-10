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

public class ForgotPasswordServlet extends HttpServlet {

    private final File jsonFile = new File("src/Data/users.json");

    private static class ResetRequest {
        String email;
        String newPassword;
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        // 1. Setup Gson
        Gson gson = new Gson();
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        try {
            ResetRequest resetReq = gson.fromJson(req.getReader(), ResetRequest.class);

            // 3. Check if file exists
            if (!jsonFile.exists()) {
                resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                resp.getWriter().write("{\"success\": false, \"message\": \"Database not found.\"}");
                return;
            }

            String content = Files.readString(jsonFile.toPath(), StandardCharsets.UTF_8);
            List<User> users = gson.fromJson(content, new TypeToken<ArrayList<User>>(){}.getType());

            if (users == null) users = new ArrayList<>();

            boolean userFound = false;
            for (User u : users) {
                if (u.email.equals(resetReq.email)) {
                    u.password = resetReq.newPassword;
                    userFound = true;
                    break;
                }
            }

            if (userFound) {
                String updatedJson = gson.toJson(users);
                Files.writeString(jsonFile.toPath(), updatedJson, StandardCharsets.UTF_8);

                resp.setStatus(HttpServletResponse.SC_OK);
                resp.getWriter().write("{\"success\": true, \"message\": \"Password updated successfully!\"}");
            } else {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                resp.getWriter().write("{\"success\": false, \"message\": \"Email does not exist.\"}");
            }

        } catch (Exception e) {
            e.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("{\"success\": false, \"message\": \"Server error occurred.\"}");
        }
    }
}