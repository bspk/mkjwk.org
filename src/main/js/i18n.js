import i18n from "i18next";
import { initReactI18next } from "react-i18next";

//the translations
const resources = {
		en: {
			translation: {
				about: {
					what: 'A <a href="https://tools.ietf.org/html/rfc7517">JSON Web Key (JWK)</a> is a cryptographic key or keypair expressed in JSON format. This site offers a mechanism to easily generate random keys for use in servers and other projects.',
					never: 'This server will <em>never log or store any generated keys</em>. The source code for this server is <a href="https://github.com/mitreid-connect/mkjwk.org">available on GitHub</a> for inspection and re-use. If you would like to generate your own key locally (so as not to trust a remote service with your secret keys), you can use the <a href="https://github.com/mitreid-connect/json-web-key-generator">command line utility</a> version of the library that powers this site.'
				},
				curve_required: 'Curve is required.',
				tabs: {
					rsa: 'RSA',
					ec: 'EC',
					oct: 'oct',
					okp: 'OKP'
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
					make_x509: 'Include X509',
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
			            SECP256K1: 'secp256k1',
			            Ed25519: 'Ed25519',
			            Ed448: 'Ed448',
			            X25519: 'X25519',
			            X448: 'X448'
		            },
		            gen: {
		            	specified: 'Specify',
		            	sha256: 'SHA-256',
		            	sha1: 'SHA-1',
		            	date: 'ISO Date',
		            	timestamp: 'Timestamp'
		            },
		            x509: {
		            	yes: 'Yes',
		            	no: 'No'
		            }
				},
				key_display: {
					jwk: 'Public and Private Keypair',
					jwks: 'Public and Private Keypair Set',
					pub: 'Public Key',
					shared_jwk: 'Shared Key',
					shared_jwks: 'Shared Key Set',
					copy: 'Copy to Clipboard' 
				},
				footer: 'Provided as a free service by <a href="https://bspk.io/">Bespoke Engineering</a> and <a href="https://www.authlete.com/">Authlete</a>.'
			}
		},
		ja: {
			translation: {
				about: {
					what: '<a href="https://tools.ietf.org/html/rfc7517">JSON Web Key (JWK)</a> は暗号鍵やそれらの組を JSON 形式で表現したものです。このサイトは、サーバーやその他のプロジェクトで利用できるランダムな鍵を簡単に生成する機能を提供します。',
					never: 'このサーバーが<em>生成した鍵を保存したりログに残したりすることは決してありません</em>。内容確認や再利用を可能とするため、このサーバーのソースコードは <a href="https://github.com/mitreid-connect/mkjwk.org">GitHub 上で公開</a>してあります。（離れた場所で動いているサービスを信用することを避けて）自分用の鍵を手元で生成したいのであれば、このサイトでも利用している<a href="https://github.com/mitreid-connect/json-web-key-generator">コマンドライン・ユーティリティー</a>版を使うことができます。'
				},
				key_props: {
					generate: '生成する',
					size: '鍵のサイズ',
					use: '鍵の用途',
					sig: '署名',
					enc: '暗号',
					alg: 'アルゴリズム',
					kid: '鍵の ID',
					crv: '曲線',
				},
				key_display: {
					jwk: '公開鍵と秘密鍵',
					jwks: '公開鍵と秘密鍵を含む JWK Set',
					pub: '公開鍵',
					shared_jwk: '共有鍵',
					shared_jwks: '共有鍵の JWK Set',
					copy: 'クリップボードにコピー'
				},
				footer: '<a href="https://bspk.io/">Bespoke Engineering 社</a>と <a href="https://www.authlete.com/">Authlete 社</a>が提供する無料サービス'
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