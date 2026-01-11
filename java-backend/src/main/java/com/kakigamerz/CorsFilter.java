package com.kakigamerz;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

public class CorsFilter implements Filter {
    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;

      
        System.out.println("🔥 CORS FILTER HIT: " + request.getMethod() + " request from " + request.getHeader("Origin"));
      
        String localFrontend = "http://localhost:3000";
        String cloudFrontend = "https://your-frontend-name.onrender.com";

        String origin = request.getHeader("Origin");
        System.out.println("Your origin:" + origin);
       
        if ("http://localhost:5173".equals(origin)) { 
            response.setHeader("Access-Control-Allow-Origin", "*");
        }

        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Origin, Accept");
        response.setHeader("Access-Control-Allow-Credentials", "true");

        
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        chain.doFilter(req, res);
    }
}
