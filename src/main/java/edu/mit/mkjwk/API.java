package edu.mit.mkjwk;

import java.io.IOException;
import java.io.StringWriter;
import java.math.BigInteger;
import java.net.URLEncoder;
import java.nio.charset.Charset;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.cert.Certificate;
import java.security.cert.CertificateEncodingException;
import java.security.cert.CertificateException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Map;

import org.bouncycastle.asn1.x500.X500Name;
import org.bouncycastle.cert.jcajce.JcaX509CertificateConverter;
import org.bouncycastle.cert.jcajce.JcaX509v3CertificateBuilder;
import org.bouncycastle.operator.ContentSigner;
import org.bouncycastle.operator.OperatorException;
import org.bouncycastle.operator.jcajce.JcaContentSignerBuilder;
import org.bouncycastle.util.io.pem.PemObject;
import org.bouncycastle.util.io.pem.PemWriter;
import org.mitre.jose.jwk.ECKeyMaker;
import org.mitre.jose.jwk.KeyIdGenerator;
import org.mitre.jose.jwk.OKPKeyMaker;
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
import com.nimbusds.jose.JOSEException;
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
	ImmutableSet<Algorithm> octAlgs = ImmutableSet.of(JWSAlgorithm.HS256, JWSAlgorithm.HS384, JWSAlgorithm.HS512,
		JWEAlgorithm.A128KW, JWEAlgorithm.A192KW, JWEAlgorithm.A256KW,
		JWEAlgorithm.A128GCMKW, JWEAlgorithm.A192GCMKW, JWEAlgorithm.A256GCMKW,
		JWEAlgorithm.DIR);
	ImmutableSet<Algorithm> ecAlgs = ImmutableSet.of(JWSAlgorithm.ES256, JWSAlgorithm.ES384, JWSAlgorithm.ES512,
		JWSAlgorithm.EdDSA, JWSAlgorithm.ES256K,
		JWEAlgorithm.ECDH_ES, JWEAlgorithm.ECDH_ES_A128KW, JWEAlgorithm.ECDH_ES_A192KW, JWEAlgorithm.ECDH_ES_A256KW);

	ImmutableSet<Curve> ecCurves = ImmutableSet.of(Curve.P_256, Curve.SECP256K1, Curve.P_384, Curve.P_521);
	ImmutableSet<Curve> okpCurves = ImmutableSet.of(Curve.Ed25519, Curve.Ed448, Curve.X25519, Curve.X448);

	@RequestMapping(value = "/rsa", method = RequestMethod.GET)
	public Map<?,?> makeRSA(
			@RequestParam(value = "size", required = false, defaultValue = "2048") int keySize,
			@RequestParam(value = "use", required = false) KeyUse keyUse,
			@RequestParam(value = "alg", required = false) Algorithm alg,
			@RequestParam(value = "kid", required = false) String kid,
			@RequestParam(value = "gen", required = false) String gen,
			@RequestParam(value = "x509", required = false) boolean x509
			) throws CertificateException, OperatorException, JOSEException, IOException {

		if (!rsaAlgs.contains(alg)) {
			alg = null;
		}

		KeyIdGenerator generator = getKeyIdGenerator(kid, gen);

		JWK jwk = RSAKeyMaker.make(keySize, keyUse, alg, generator);

		if (x509) {
			Certificate cert = selfSign(jwk.toRSAKey().toPublicKey(),
				jwk.toRSAKey().toPrivateKey(),
				jwk.getKeyID() != null ? jwk.getKeyID() : jwk.computeThumbprint().toString(),
				"SHA256withRSA"
				);

			return wrapCerts(jwk,
				writePEM(jwk.toRSAKey().toPublicKey().getEncoded(), "PUBLIC KEY"),
				writePEM(jwk.toRSAKey().toPrivateKey().getEncoded(), "PRIVATE KEY"),
				writePEM(cert.getEncoded(), "CERTIFICATE"));
		} else {
			return wrapJwk(jwk);
		}
	}

	@RequestMapping(value = "/oct", method = RequestMethod.GET)
	public Map<String, Json> makeOct(
			@RequestParam(value = "size", required = false, defaultValue = "2048") int keySize,
			@RequestParam(value = "use", required = false) KeyUse keyUse,
			@RequestParam(value = "alg", required = false) Algorithm alg,
			@RequestParam(value = "kid", required = false) String kid,
			@RequestParam(value = "gen", required = false) String gen
			) {

		if (!octAlgs.contains(alg)) {
			alg = null;
		}

		KeyIdGenerator generator = getKeyIdGenerator(kid, gen);

		JWK jwk = OctetSequenceKeyMaker.make(keySize, keyUse, alg, generator);

		return wrapJwk(jwk);
	}

	@RequestMapping(value = "/ec", method = RequestMethod.GET)
	public Map<?, ?> makeEC(
			@RequestParam(value = "crv") Curve crv,
			@RequestParam(value = "use", required = false) KeyUse keyUse,
			@RequestParam(value = "alg", required = false) Algorithm alg,
			@RequestParam(value = "kid", required = false) String kid,
			@RequestParam(value = "gen", required = false) String gen,
			@RequestParam(value = "x509", required = false) boolean x509
			) throws CertificateException, OperatorException, JOSEException, IOException {

		if (!ecAlgs.contains(alg)) {
			alg = null;
		}

		if (!ecCurves.contains(crv)) {
			crv = null;
		}

		KeyIdGenerator generator = getKeyIdGenerator(kid, gen);

		JWK jwk = ECKeyMaker.make(crv, keyUse, alg, generator);

		if (x509) {
			Certificate cert = selfSign(jwk.toECKey().toPublicKey(),
				jwk.toECKey().toPrivateKey(),
				jwk.getKeyID() != null ? jwk.getKeyID() : jwk.computeThumbprint().toString(),
				"SHA256withECDSA"
				);

			return wrapCerts(jwk,
				writePEM(jwk.toECKey().toPublicKey().getEncoded(), "PUBLIC KEY"),
				writePEM(jwk.toECKey().toPrivateKey().getEncoded(), "PRIVATE KEY"),
				writePEM(cert.getEncoded(), "CERTIFICATE"));
		} else {
			return wrapJwk(jwk);
		}

	}

	@RequestMapping(value = "/okp", method = RequestMethod.GET)
	public Map<String, Json> makeOKP(
		@RequestParam(value = "crv") Curve crv,
		@RequestParam(value = "use", required = false) KeyUse keyUse,
		@RequestParam(value = "alg", required = false) Algorithm alg,
		@RequestParam(value = "kid", required = false) String kid,
		@RequestParam(value = "gen", required = false) String gen
		) {

		if (!ecAlgs.contains(alg)) {
			alg = null;
		}

		if (!okpCurves.contains(crv)) {
			crv = null;
		}

		KeyIdGenerator generator = getKeyIdGenerator(kid, gen);

		JWK jwk = OKPKeyMaker.make(crv, keyUse, alg, generator);

		return wrapJwk(jwk);

	}

	private Map<String, Json> wrapJwk(JWK jwk) {

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

	private Map<Object, Object> wrapCerts(JWK jwk, String pubKey, String privKey, String cert) {
		Map<String, Json> wrappedJwk = wrapJwk(jwk);

		return ImmutableMap.builder().putAll(wrappedJwk)
			.put("cert", cert)
			.put("x509pub", pubKey)
			.put("x509priv", privKey)
			.build();

	}

	private KeyIdGenerator getKeyIdGenerator(String kid, String gen) {
		if ("specified".equals(gen) || gen == null) {
			if (kid != null && !kid.trim().isEmpty()) {
				return KeyIdGenerator.specified(kid);
			} else {
				return KeyIdGenerator.NONE;
			}
		} else {
			return KeyIdGenerator.get(gen);
		}
	}

	private String writePEM(byte[] encoded, String header) throws IOException, CertificateEncodingException {

		StringWriter sw = new StringWriter();
		PemWriter pw = new PemWriter(sw);

		pw.writeObject(new PemObject(header, encoded));
		pw.flush();

		pw.close();

		sw.flush();

		return sw.toString();
	}

	public Certificate selfSign(PublicKey pub, PrivateKey priv, String subjectDN, String signatureAlgorithm) throws OperatorException, CertificateException
	{
		X500Name dn = new X500Name("CN=" + URLEncoder.encode(subjectDN, Charset.defaultCharset()));

		BigInteger certSerialNumber = BigInteger.valueOf(Instant.now().toEpochMilli());

		ContentSigner contentSigner = new JcaContentSignerBuilder(signatureAlgorithm)
			.build(priv);

		Instant startDate = Instant.now();
		Instant endDate = startDate.plus(300, ChronoUnit.DAYS);

		JcaX509v3CertificateBuilder certBuilder = new JcaX509v3CertificateBuilder(
			dn, certSerialNumber, Date.from(startDate), Date.from(endDate),
			dn, pub);

		return new JcaX509CertificateConverter()
			.getCertificate(certBuilder.build(contentSigner));
	}


}
