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
import java.util.stream.Collectors;

public class ProductServlet extends HttpServlet {

    private final File jsonFile = new File("src/Data/products.json");
    private final Gson gson = new Gson();

    // --- 1. GET: Read all products ---
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        List<Product> allProducts = readProducts();
        String categoryFilter = req.getParameter("category");

        if (categoryFilter != null && !categoryFilter.isEmpty()) {
            List<Product> filteredProducts = allProducts.stream()
                    // OOP FIX: Use .getCategory() instead of .category
                    .filter(p -> p.getCategory() != null && p.getCategory().equalsIgnoreCase(categoryFilter))
                    .collect(Collectors.toList());

            resp.getWriter().write(gson.toJson(filteredProducts));
        } else {
            resp.getWriter().write(gson.toJson(allProducts));
        }
    }

    // --- 2. POST: Add a new product ---
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Product newProduct = gson.fromJson(req.getReader(), Product.class);
        List<Product> products = readProducts();

        // OOP FIX: Use .getId() and .setId()
        if (newProduct.getId() == 0) {
            newProduct.setId(System.currentTimeMillis());
        }

        products.add(newProduct);
        saveProducts(products);

        resp.setContentType("application/json");
        resp.getWriter().write("{\"message\": \"Product added successfully\", \"id\": " + newProduct.getId() + "}");
    }

    // --- 3. PUT: Edit an existing product ---
    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Product updatedData = gson.fromJson(req.getReader(), Product.class);
        List<Product> products = readProducts();

        boolean found = false;
        for (Product existing : products) {

            // OOP FIX: Use getters to compare ID
            if (existing.getId() == updatedData.getId()) {

                // --- MERGE LOGIC (Using Setters) ---
                existing.setName(updatedData.getName());
                existing.setCategory(updatedData.getCategory());
                existing.setStock(updatedData.getStock());
                existing.setPrice(updatedData.getPrice());
                existing.setOldPrice(updatedData.getOldPrice());
                existing.setBadge(updatedData.getBadge());
                existing.setDesc(updatedData.getDesc());
                existing.setImage(updatedData.getImage());

                // We deliberately do NOT update specs/colors here to preserve them
                // unless you want to update them too.

                found = true;
                break;
            }
        }

        if (found) {
            saveProducts(products);
            resp.setContentType("application/json");
            resp.getWriter().write("{\"message\": \"Product updated\"}");
        } else {
            resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
            resp.getWriter().write("{\"error\": \"Product ID not found\"}");
        }
    }

    // --- 4. DELETE: Remove a product ---
    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String idParam = req.getParameter("id");
        if (idParam == null) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        long idToDelete = Long.parseLong(idParam);
        List<Product> products = readProducts();

        // OOP FIX: Use .getId() in filter
        List<Product> remainingProducts = products.stream()
                .filter(p -> p.getId() != idToDelete)
                .collect(Collectors.toList());

        saveProducts(remainingProducts);

        resp.setContentType("application/json");
        resp.getWriter().write("{\"message\": \"Product deleted\"}");
    }

    // --- Helpers ---
    private List<Product> readProducts() throws IOException {
        if (!jsonFile.exists()) return new ArrayList<>();
        String content = Files.readString(jsonFile.toPath(), StandardCharsets.UTF_8);
        return gson.fromJson(content, new TypeToken<ArrayList<Product>>(){}.getType());
    }

    private void saveProducts(List<Product> products) throws IOException {
        String json = gson.toJson(products);
        Files.writeString(jsonFile.toPath(), json);
    }
}