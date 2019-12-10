import i18n from "i18next";
import { initReactI18next } from "react-i18next";

//the translations
const resources = {
		en: {
			translation: {
				about: {
					what: 'A <a href="https://tools.ietf.org/html/draft-ietf-jose-json-web-key">JSON Web Key (JWK)</a> is a cryptographic key or keypair expressed in JSON format. This site offers a mechanism to easily generate random keys for use in servers and other projects.',
					never: 'This server will <em>never log or store any generated keys</em>. The source code for this server is <a href="https://github.com/mitreid-connect/mkjwk.org">available on GitHub</a> for inspection and re-use. If you would like to generate your own key locally (so as not to trust a remote service with your secret keys), you can use the <a href="https://github.com/mitreid-connect/json-web-key-generator">command line utility</a> version of the library that powers this site.'
				},
				tabs: {
					rsa: 'RSA',
					ec: 'EC',
					oct: 'oct'
				},
				key_props: {
					generate: 'Generate',
					size: 'Key Size',
					use: 'Key Use',
					sig: 'Signature',
					enc: 'Encryption',
					alg: 'Algorithm',
					kid: 'Key ID',
					crv: 'Curve',
					signing_alg: {
			            none: 'none',
			            HS256: 'HS256 (HMAC using SHA-256)',
			            HS384: 'HS384 (HMAC using SHA-384)',
			            HS512: 'HS512 (HMAC using SHA-512)',
			            RS256: 'RS256 (RSASSA-PKCS1-v1_5 using SHA-256)',
			            RS384: 'RS384 (RSASSA-PKCS1-v1_5 using SHA-384)',
			            RS512: 'RS512 (RSASSA-PKCS1-v1_5 using SHA-512)',
			            ES256: 'ES256 (ECDSA using P-256 and SHA-256)',
			            ES384: 'ES384 (ECDSA using P-384 and SHA-384)',
			            ES512: 'ES512 (ECDSA using P-521 and SHA-512)',
			            PS256: 'PS256 (RSASSA-PSS using SHA-256 and MGF1 with SHA-256)',
			            PS384: 'PS384 (RSASSA-PSS using SHA-384 and MGF1 with SHA-384)',
			            PS512: 'PS512 (RSASSA-PSS using SHA-512 and MGF1 with SHA-512)',
			            EdDSA: 'EdDSA',
			            ES256K: 'ES256K'
					},
		            ec_crv: {
			            P256: 'P-256',
			            P384: 'P-384',
			            P521: 'P-521',
			            P256K: 'P-256K',
			            Ed25519: 'Ed25519',
			            Ed448: 'Ed448',
			            X25519: 'X25519',
			            X448: 'X448'
		            }
				},
				key_display: {
					jwk: 'Public and Private Keypair',
					jwks: 'Public and Private Keypair Set',
					pub: 'Public Key',
					copy: 'Copy to Clipboard' 
				},
				footer: 'Provided as a free service by <a href="https://bspk.io/">Bespoke Engineering</a> and <a href="https://www.authlete.com/">Authlete</a>.'
			}
		},
		ja: {
			translation: {
				key_props: {
					generate: '生成する'
				},
				key_display: {
					copy: 'クリップボードにコピー'
				}
			}
		}
};

i18n
	.use(initReactI18next) // passes i18n down to react-i18next
	.init({
		resources,
		lng: "en",
		fallbackLng: "en",
	
		interpolation: {
			escapeValue: false // react already safes from xss
		}
});

export default i18n;