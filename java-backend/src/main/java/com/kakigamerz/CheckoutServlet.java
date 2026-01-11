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

        Checkout order = gson.fromJson(req.getReader(), Checkout.class);

   
        if (!jsonFile.exists()) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            return;
        }
        String content = Files.readString(jsonFile.toPath(), StandardCharsets.UTF_8);
        List<Product> databaseProducts = gson.fromJson(content, new TypeToken<ArrayList<Product>>(){}.getType());

     
        if (order.getItems() != null) {
            for (Checkout.CartItem cartItem : order.getItems()) {
                for (Product dbProduct : databaseProducts) {

                    
                    if (dbProduct.getId() == cartItem.getId()) {

                      
                        int currentStock = dbProduct.getStock();
                        if (currentStock > 0) {
                            dbProduct.setStock(currentStock - 1);
                        }
                    }
                }
            }
        }

        Files.writeString(jsonFile.toPath(), gson.toJson(databaseProducts), StandardCharsets.UTF_8);

      
        resp.setContentType("application/json");
        resp.getWriter().write("{\"status\": \"success\", \"message\": \"Inventory Updated\"}");
    }
}
