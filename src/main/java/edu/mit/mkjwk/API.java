package edu.mit.mkjwk;

import org.mitre.jose.jwk.RSAKeyMaker;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.nimbusds.jose.Algorithm;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.KeyUse;

@RestController
@RequestMapping(value = "/jwk", produces = "application/json")
public class API {

	@RequestMapping(value = "/rsa", method = RequestMethod.GET)
	public Json makeRSA() {
		JWK jwk = RSAKeyMaker.make(2048, KeyUse.SIGNATURE, JWSAlgorithm.RS256, "rsa-1");
		
		return new Json(jwk.toJSONString());
	}
	
}
