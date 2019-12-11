package edu.mit.mkjwk;

import java.security.Security;

import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MkJwk {

    public static void main(String[] args) {
    	Security.addProvider(new BouncyCastleProvider());

    	SpringApplication.run(MkJwk.class, args);
    }

}
