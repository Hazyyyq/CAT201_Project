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
import java.util.stream.Collectors;

public class GameServlet extends HttpServlet {

    // 1. Define resources
    private final File jsonFile = new File("src/Data/products.json");
    private final Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        // 2. Set Response Type
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        // 3. Check file existence
        if (!jsonFile.exists()) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().print("[]");
            return;
        }

        // 4. OOP Step: Read file -> Convert to Product Objects
        // This ensures the data matches your Product.java class structure
        String content = Files.readString(jsonFile.toPath(), StandardCharsets.UTF_8);
        List<Product> allProducts = gson.fromJson(content, new TypeToken<ArrayList<Product>>(){}.getType());

        if (allProducts == null) {
            allProducts = new ArrayList<>();
        }

        // 5. Logic: Since this is "GameServlet", let's filter for Games only.
        // We use the Getter method .getCategory() we created earlier.
        List<Product> gamesOnly = allProducts.stream()
                .filter(p -> p.getCategory() != null && p.getCategory().equalsIgnoreCase("Game"))
                .collect(Collectors.toList());

        // 6. Send the filtered object list back
        String jsonResponse = gson.toJson(gamesOnly);
        resp.getWriter().print(jsonResponse);
    }
}