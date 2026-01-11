package com.kakigamerz;

import org.apache.catalina.Context;
import org.apache.catalina.LifecycleException;
import org.apache.catalina.startup.Tomcat;
import org.apache.tomcat.util.descriptor.web.FilterDef; 
import org.apache.tomcat.util.descriptor.web.FilterMap; 

import java.io.File;

public class Main {
    public static void main(String[] args) throws LifecycleException {

        Tomcat tomcat = new Tomcat();
        tomcat.setPort(8080);

        String docBase = new File("src/main/webapp").getAbsolutePath();
        Context ctx = tomcat.addContext("", docBase);

       

        
        FilterDef corsFilter = new FilterDef();
        corsFilter.setFilterName("CorsFilter");
        corsFilter.setFilterClass(CorsFilter.class.getName());
        ctx.addFilterDef(corsFilter);

        FilterMap corsMapping = new FilterMap();
        corsMapping.setFilterName("CorsFilter");
        corsMapping.addURLPattern("/*");
        ctx.addFilterMap(corsMapping);

       




        Tomcat.addServlet(ctx, "ProductServlet", new ProductServlet());
        ctx.addServletMappingDecoded("/api/products", "ProductServlet");

        Tomcat.addServlet(ctx, "SignUpServlet", new SignUpServlet());
        ctx.addServletMappingDecoded("/api/signup", "SignUpServlet");

        Tomcat.addServlet(ctx, "ForgotPasswordServlet", new ForgotPasswordServlet());
        ctx.addServletMappingDecoded("/api/forgot-password", "ForgotPasswordServlet");

        Tomcat.addServlet(ctx, "LoginServlet", new LoginServlet());
        ctx.addServletMappingDecoded("/api/login", "LoginServlet");

        Tomcat.addServlet(ctx, "CheckoutServlet", new CheckoutServlet());
        ctx.addServletMappingDecoded("/api/checkout", "CheckoutServlet");

       
        tomcat.getConnector();
        tomcat.start();

        System.out.println("--------------------------------------------------");

        System.out.println("✅ SERVER STARTED SUCCESSFULLY");

        System.out.println("👉 Click here to test: http://localhost:8080/api/products");

        System.out.println("--------------------------------------------------");

        tomcat.getServer().await();
    }
}
