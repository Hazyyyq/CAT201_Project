package com.kakigamerz;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;

public class GameServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        // 2. Set Response Type
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        // 3. Read the file from disk
        File jsonFile = new File("src/Data/products.json");
        PrintWriter out = resp.getWriter();

        if (jsonFile.exists()) {
            // Read the file content as a String
            String jsonContent = Files.readString(jsonFile.toPath(), StandardCharsets.UTF_8);
            out.print(jsonContent);
        } else {
            // If file not found, return an empty array []
            System.out.println("❌ ERROR: Could not find products.json in project root.");
            out.print("[]");
        }

        out.flush();
    }
}