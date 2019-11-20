package edu.mit.mkjwk;

import java.util.Map;

import org.mitre.jose.jwk.ECKeyMaker;
import org.mitre.jose.jwk.OctetSequenceKeyMaker;
import org.mitre.jose.jwk.RSAKeyMaker;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.google.common.collect.ImmutableMap;
import com.google.common.collect.ImmutableSet;
import com.nimbusds.jose.Algorithm;
import com.nimbusds.jose.JWEAlgorithm;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.jwk.Curve;
import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.KeyUse;

@RestController
@CrossOrigin
@RequestMapping(value = "/jwk", produces = "application/json")
public class API {

	ImmutableSet<Algorithm> rsaAlgs = ImmutableSet.of(JWSAlgorithm.RS256, JWSAlgorithm.RS384, JWSAlgorithm.RS512,
		JWSAlgorithm.PS256, JWSAlgorithm.PS384, JWSAlgorithm.PS512,
		JWEAlgorithm.RSA1_5, JWEAlgorithm.RSA_OAEP, JWEAlgorithm.RSA_OAEP_256);
	ImmutableSet<JWSAlgorithm> octAlgs = ImmutableSet.of(JWSAlgorithm.HS256, JWSAlgorithm.HS384, JWSAlgorithm.HS512);
	ImmutableSet<JWSAlgorithm> ecAlgs = ImmutableSet.of(JWSAlgorithm.ES256, JWSAlgorithm.ES384, JWSAlgorithm.ES512,
		JWSAlgorithm.EdDSA, JWSAlgorithm.ES256K);

	@RequestMapping(value = "/rsa", method = RequestMethod.GET)
	public Map<String,Json> makeRSA(
			@RequestParam(value = "size", required = false, defaultValue = "2048") int keySize,
			@RequestParam(value = "use", required = false) KeyUse keyUse,
			@RequestParam(value = "alg", required = false) Algorithm alg,
			@RequestParam(value = "kid", required = false) String kid
			) {

		if (!rsaAlgs.contains(alg)) {
			alg = null;
		}

		JWK jwk = RSAKeyMaker.make(keySize, keyUse, alg, kid);

		return wrapJwk(jwk);
	}

	@RequestMapping(value = "/oct", method = RequestMethod.GET)
	public Map<String, Json> makeOct(
			@RequestParam(value = "size", required = false, defaultValue = "2048") int keySize,
			@RequestParam(value = "use", required = false) KeyUse keyUse,
			@RequestParam(value = "alg", required = false) Algorithm alg,
			@RequestParam(value = "kid", required = false) String kid
			) {

		if (!octAlgs.contains(alg)) {
			alg = null;
		}

		JWK jwk = OctetSequenceKeyMaker.make(keySize, keyUse, alg, kid);

		return wrapJwk(jwk);
	}

	@RequestMapping(value = "/ec", method = RequestMethod.GET)
	public Map<String, Json> makeEC(
			@RequestParam(value = "crv", required = false, defaultValue = "P-256") Curve crv,
			@RequestParam(value = "use", required = false) KeyUse keyUse,
			@RequestParam(value = "alg", required = false) Algorithm alg,
			@RequestParam(value = "kid", required = false) String kid
			) {

		if (!ecAlgs.contains(alg)) {
			alg = null;
		}

		JWK jwk = ECKeyMaker.make(crv, keyUse, alg, kid);

		return wrapJwk(jwk);

	}

	private ImmutableMap<String, Json> wrapJwk(JWK jwk) {

		JWKSet jwks = new JWKSet(jwk);

		JWK pub = jwk.toPublicJWK();

		if (pub != null) {

			return ImmutableMap.of("jwk", new Json(jwk.toJSONString()),
					"jwks", new Json(jwks.toJSONObject(false).toJSONString()),
					"pub", new Json(pub.toJSONString()));

		} else {

			return ImmutableMap.of("jwk", new Json(jwk.toJSONString()),
					"jwks", new Json(jwks.toJSONObject(false).toJSONString()),
					"pub", new Json("null"));

		}
	}

}
