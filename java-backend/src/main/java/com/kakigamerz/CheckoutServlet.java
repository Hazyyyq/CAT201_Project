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

public class CheckoutServlet extends HttpServlet {
    private final File jsonFile = new File("src/Data/products.json");
    private final Gson gson = new Gson();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        // 1. Parse the incoming cart items from React
        Checkout order = gson.fromJson(req.getReader(), Checkout.class);

        // 2. Load the current products database
        String content = Files.readString(jsonFile.toPath(), StandardCharsets.UTF_8);
        List<Product> databaseProducts = gson.fromJson(content, new TypeToken<ArrayList<Product>>(){}.getType());

        // 3. Logic: For every item in the cart, find it in the database and reduce stock
        for (Checkout.CartItem cartItem : order.items) {
            for (Product dbProduct : databaseProducts) {
                // IMPORTANT: We use originalId if your cart uses Date.now(),
                // but usually we pass the product's actual database ID.
                if (dbProduct.id == cartItem.id) {
                    if (dbProduct.stock > 0) {
                        dbProduct.stock -= 1; // Reduce by 1
                    }
                }
            }
        }

        // 4. Save the updated list back to products.json
        Files.writeString(jsonFile.toPath(), gson.toJson(databaseProducts), StandardCharsets.UTF_8);

        // 5. Respond to frontend
        resp.setContentType("application/json");
        resp.getWriter().write("{\"status\": \"success\", \"message\": \"Inventory Updated\"}");
    }
}