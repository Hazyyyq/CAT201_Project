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

    // Make sure this points to your actual JSON file location
    private final File jsonFile = new File("src/Data/products.json");
    private final Gson gson = new Gson();

    // --- 1. GET: Read all products (Loads the grid) ---
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        // 1. Read all products from the JSON file
        List<Product> allProducts = readProducts();

        // 2. Get the "category" parameter from the URL (e.g., /api/products?category=Games)
        String categoryFilter = req.getParameter("category");

        if (categoryFilter != null && !categoryFilter.isEmpty()) {
            // 3. Filter the list to only include matching categories (case-insensitive)
            List<Product> filteredProducts = allProducts.stream()
                    .filter(p -> p.category != null && p.category.equalsIgnoreCase(categoryFilter))
                    .collect(Collectors.toList());

            resp.getWriter().write(gson.toJson(filteredProducts));
        } else {
            // 4. If no category provided, return everything
            resp.getWriter().write(gson.toJson(allProducts));
        }
    }

    // --- 2. POST: Add a new product ---
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Product newProduct = gson.fromJson(req.getReader(), Product.class);
        List<Product> products = readProducts();

        // Generate a simple ID based on time
        if (newProduct.id == 0) {
            newProduct.id = System.currentTimeMillis();
        }

        products.add(newProduct);
        saveProducts(products);

        resp.setContentType("application/json");
        resp.getWriter().write("{\"message\": \"Product added successfully\", \"id\": " + newProduct.id + "}");
    }

    // --- 3. PUT: Edit an existing product ---
    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Product updatedData = gson.fromJson(req.getReader(), Product.class);
        List<Product> products = readProducts();

        boolean found = false;
        for (int i = 0; i < products.size(); i++) {
            Product existing = products.get(i);

            if (existing.id == updatedData.id) {
                // --- MERGE LOGIC START ---
                // Only update the fields the Admin Panel knows about
                existing.name = updatedData.name;
                existing.category = updatedData.category;
                existing.stock = updatedData.stock;
                existing.price = updatedData.price;
                existing.oldPrice = updatedData.oldPrice; // Update oldPrice
                existing.badge = updatedData.badge;       // Update badge
                existing.desc = updatedData.desc;
                existing.image = updatedData.image;

                // DO NOT touch 'specs' or 'colors'.
                // Since 'updatedData' won't have them (null),
                // keeping 'existing' preserves the original data.
                // --- MERGE LOGIC END ---

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
        // We expect the ID in the URL, e.g., /api/games?id=123
        String idParam = req.getParameter("id");
        if (idParam == null) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        long idToDelete = Long.parseLong(idParam);
        List<Product> products = readProducts();

        // Filter out the product to delete
        List<Product> remainingProducts = products.stream()
                .filter(p -> p.id != idToDelete)
                .collect(Collectors.toList());

        saveProducts(remainingProducts);

        resp.setContentType("application/json");
        resp.getWriter().write("{\"message\": \"Product deleted\"}");
    }

    // --- Helpers to Read/Write JSON File ---
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