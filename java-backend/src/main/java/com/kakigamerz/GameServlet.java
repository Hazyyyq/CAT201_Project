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

    
    private final File jsonFile = new File("src/Data/products.json");
    private final Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        
        if (!jsonFile.exists()) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().print("[]");
            return;
        }

       
        String content = Files.readString(jsonFile.toPath(), StandardCharsets.UTF_8);
        List<Product> allProducts = gson.fromJson(content, new TypeToken<ArrayList<Product>>(){}.getType());

        if (allProducts == null) {
            allProducts = new ArrayList<>();
        }

     
        List<Product> gamesOnly = allProducts.stream()
                .filter(p -> p.getCategory() != null && p.getCategory().equalsIgnoreCase("Game"))
                .collect(Collectors.toList());

       
        String jsonResponse = gson.toJson(gamesOnly);
        resp.getWriter().print(jsonResponse);
    }
}
