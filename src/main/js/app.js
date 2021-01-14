import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Tabs, Container, Section, Level, Form, Columns, Content } from 'react-bulma-components';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import i18n from './i18n';
import { useTranslation } from 'react-i18next';
import { Translation } from 'react-i18next';


class MkJwk extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
				kty: 'rsa',
				gen: 'specified',
				x509: false,
				use: null,
				alg: null,
				keys: {
					jwk: null,
					jwks: null,
					pub: null
				},
				crv: null,
				kid: null,
				size: 2048
		};
	}
	
	selectTab = (kty) => () => {
		this.setState({
			kty: kty,
			alg: null, // reset the algorithm when tabs change
			crv: null, // reset the curve when tabs change
			keys: { // reset the keys when tabs change
				jwk: null,
				jwks: null,
				pub: null
			}
		});
	}
	
	setSize = (e) => {
		this.setState({size: e.target.value});
	}
	
	setUse = (e) => {
		const algs = keyToAlg(this.state.kty, e.target.value);
		if (this.state.alg && algs.includes(this.state.alg)) {
			this.setState({use: e.target.value});
		} else {
			this.setState({
				use: e.target.value, 
				alg: null // reset the algorithm if it's not available for this use
			});
		}
	}
	
	setAlg = (e) => {
		this.setState({alg: e.target.value});
	}
	
	setCrv = (e) => {
		this.setState({crv: e.target.value});
	}
	
	setKid = (e) => {
		this.setState({kid: e.target.value});
	}
	
	setGen = (e) => {
		this.setState({gen: e.target.value});
	}
	
	setx509 = (e) => {
		// force string to reasonable boolean
		this.setState({x509: !!JSON.parse(e.target.value)});
	}
	
	generate = (e) => {
		const url = new URL('jwk/' + this.state.kty, window.location.href);
		
		
		this.appendParam(url, 'alg', this.state.alg);
		this.appendParam(url, 'use', this.state.use);
		this.appendParam(url, 'kid', this.state.kid);
		this.appendParam(url, 'gen', this.state.gen);

		if (this.state.kty == 'rsa' || this.state.kty == 'ec') {
			this.appendParam(url, 'x509', this.state.x509);
		}
		
		if (this.state.kty == 'rsa' || this.state.kty == 'oct') {
			this.appendParam(url, 'size', this.state.size);
		}
		
		if (this.state.kty == 'ec' || this.state.kty == 'okp') {
			
			if (!this.state.crv) {
				alert(this.props.t('curve_required'));
				return;
			}
			
			this.appendParam(url, 'crv', this.state.crv);
		}
		
		fetch(url).then(res => {
			res.json().then(data => {
				this.setState({keys: data});
			});
		});
	}
	
	// null-safe parameter appender
	appendParam(url, k, v) {
		if (v) {
			url.searchParams.append(k, v);
		}
	}
	
	copyToClipboard = (key) => () => {
		if (this.state.keys[key]) {
			navigator.clipboard.writeText(JSON.stringify(this.state.keys[key], null, 4));
		}
	}
	
	render() {
		return (
		<Section>
			<Container>
				<Tabs type='boxed'>
					<Tabs.Tab active={this.state.kty == 'rsa'} onClick={this.selectTab('rsa')}>
					{this.props.t('tabs.rsa')}
					</Tabs.Tab>
					<Tabs.Tab active={this.state.kty == 'ec'} onClick={this.selectTab('ec')}>
					{this.props.t('tabs.ec')}
					</Tabs.Tab>
					<Tabs.Tab active={this.state.kty == 'oct'} onClick={this.selectTab('oct')}>
					{this.props.t('tabs.oct')}
					</Tabs.Tab>
					<Tabs.Tab active={this.state.kty == 'okp'} onClick={this.selectTab('okp')}>
					{this.props.t('tabs.okp')}
					</Tabs.Tab>
				</Tabs>
				<KeyProps kty={this.state.kty} crv={this.state.crv} size={this.state.size} use={this.state.use} kid={this.state.kid} alg={this.state.alg} gen={this.state.gen} x509={this.state.x509}
					setSize={this.setSize} setUse={this.setUse} setAlg={this.setAlg} setCrv={this.setCrv} setKid={this.setKid} generate={this.generate} setGen={this.setGen} setx509={this.setx509} 
					t={this.props.t} 
					/>
				<KeyDisplay kty={this.state.kty} keys={this.state.keys} t={this.props.t} copyToClipboard={this.copyToClipboard} />
			</Container>
		</Section>
		);
	}
	
}

const AlgSelector = ({...props}) => {

	const algs = keyToAlg(props.kty, props.use);

	const opts = algs.map(a => {
		return(
			<option key={a} value={a}>{a}: {props.t('key_props.algs.' + a)}</option>
		);
	});
	
	return(
		<Form.Field>
			<Form.Label>{props.t('key_props.alg')}</Form.Label>
			<Form.Control>
				<Form.Select onChange={props.setAlg} value={props.alg || ''}  className='is-fullwidth'>
					<option value=''></option>
					{opts}
				</Form.Select>
			</Form.Control>
		</Form.Field>
	);

}

const keyToAlg = (kty, use) => {
	if (use) {
		if (use === 'sig') {
			if (kty === 'rsa') {
				return ['RS256','RS384','RS512','PS256','PS384','PS512'];
			} else if (kty === 'ec') {
				return ['ES256','ES384','ES512','ES256K'];
			} else if (kty === 'oct') {
				return ['HS256','HS384','HS512'];
			} else if (kty === 'okp') {
				return ['EdDSA'];
			} else {
				return [];
			}
		} else if (use === 'enc') {
			if (kty === 'rsa') {
				return ['RSA1_5','RSA-OAEP','RSA-OAEP-256'];
			} else if (kty === 'ec') {
				return ['ECDH-ES','ECDH-ES+A128KW','ECDH-ES+A192KW','ECDH-ES+A256KW'];
			} else if (kty === 'oct') {
				return ['A128KW','A192KW','A256KW','A128GCMKW','A192GCMKW','A256GCMKW','dir'];
			} else if (kty === 'okp') {
				return ['ECDH-ES','ECDH-ES+A128KW','ECDH-ES+A192KW','ECDH-ES+A256KW'];
			} else {
				return [];
			}
		} else {
			return [];
		}
	} else {
		return [
			...keyToAlg(kty, 'sig'),
			...keyToAlg(kty, 'enc')
		];
	}
}


const KeyProps = ({...props}) => {
	if (props.kty == 'rsa') {
		return (
			<Columns>
				<Columns.Column>
						<Form.Field>
							<Form.Label>{props.t('key_props.size')}</Form.Label>
							<Form.Control>
								<Form.Input type='number' onChange={props.setSize} value={props.size || 0} min='0' step='8' />
							</Form.Control>
						</Form.Field>
				</Columns.Column>
				<Columns.Column>
						<Form.Field>
							<Form.Label>{props.t('key_props.use')}</Form.Label>
							<Form.Control>
								<Form.Select onChange={props.setUse} value={props.use || ''}  className='is-fullwidth'>
									<option value=''></option>
									<option value='sig'>{props.t('key_props.sig')}</option>
									<option value='enc'>{props.t('key_props.enc')}</option>
								</Form.Select>
							</Form.Control>
						</Form.Field>
				</Columns.Column>
				<Columns.Column>
					<AlgSelector setAlg={props.setAlg} alg={props.alg} use={props.use} kty={props.kty} t={props.t} />
				</Columns.Column>
				<KeyIdSelector gen={props.gen} kid={props.kid} setGen={props.setGen} setKid={props.setKid} t={props.t} />
				<Columns.Column>
					<Form.Field>
						<Form.Label>{props.t('key_props.make_x509')}</Form.Label>
						<Form.Control>
							<Form.Select onChange={props.setx509} value={props.x509.toString()}>
								<option value='true'>{props.t('key_props.x509.yes')}</option>
								<option value='false'>{props.t('key_props.x509.no')}</option>
							</Form.Select>
						</Form.Control>
					</Form.Field>
				</Columns.Column>
				<Columns.Column>
					<GenerateButton generate={props.generate} t={props.t} />
				</Columns.Column>
			</Columns>
		);
	} else if (props.kty == 'ec') {
		return (
				<Columns>
					<Columns.Column>
						<Form.Field>
							<Form.Label>{props.t('key_props.crv')}</Form.Label>
							<Form.Control>
								<Form.Select onChange={props.setCrv} value={props.crv || ''} className='is-fullwidth'>
									<option value=''></option>
									<option value='P-256'>{props.t('key_props.ec_crv.P256')}</option>
									<option value='P-384'>{props.t('key_props.ec_crv.P384')}</option>
									<option value='P-521'>{props.t('key_props.ec_crv.P521')}</option>
									<option value='secp256k1'>{props.t('key_props.ec_crv.SECP256K1')}</option>
								</Form.Select>
							</Form.Control>
						</Form.Field>
					</Columns.Column>
					<Columns.Column>
						<Form.Field>
							<Form.Label>{props.t('key_props.use')}</Form.Label>
							<Form.Control>
								<Form.Select onChange={props.setUse} value={props.use || ''}  className='is-fullwidth'>
									<option value=''></option>
									<option value='sig'>{props.t('key_props.sig')}</option>
									<option value='enc'>{props.t('key_props.enc')}</option>
								</Form.Select>
							</Form.Control>
							</Form.Field>
					</Columns.Column>
					<Columns.Column>
						<AlgSelector setAlg={props.setAlg} alg={props.alg} use={props.use} kty={props.kty} t={props.t} />
					</Columns.Column>
					<KeyIdSelector gen={props.gen} kid={props.kid} setGen={props.setGen} setKid={props.setKid} t={props.t} />
					<Columns.Column>
						<Form.Field>
							<Form.Label>{props.t('key_props.make_x509')}</Form.Label>
							<Form.Control>
								<Form.Select onChange={props.setx509} value={props.x509.toString()}>
									<option value='true'>{props.t('key_props.x509.yes')}</option>
									<option value='false'>{props.t('key_props.x509.no')}</option>
								</Form.Select>
							</Form.Control>
						</Form.Field>
					</Columns.Column>
					<Columns.Column>
						<GenerateButton generate={props.generate} t={props.t} />
					</Columns.Column>
				</Columns>
		);
	} else if (props.kty == 'oct') {
		return (
				<Columns>
					<Columns.Column>
						<Form.Field>
							<Form.Label>{props.t('key_props.size')}</Form.Label>
							<Form.Control>
								<Form.Input type='number' onChange={props.setSize} value={props.size || 2048} min='0' step='8' />
							</Form.Control>
						</Form.Field>
					</Columns.Column>
					<Columns.Column>
						<Form.Field>
							<Form.Label>{props.t('key_props.use')}</Form.Label>
							<Form.Control>
								<Form.Select onChange={props.setUse} value={props.use || ''}  className='is-fullwidth'>
									<option value=''></option>
									<option value='sig'>{props.t('key_props.sig')}</option>
									<option value='enc'>{props.t('key_props.enc')}</option>
								</Form.Select>
							</Form.Control>
							</Form.Field>
					</Columns.Column>
					<Columns.Column>
						<AlgSelector setAlg={props.setAlg} alg={props.alg} use={props.use} kty={props.kty} t={props.t} />
					</Columns.Column>
					<KeyIdSelector gen={props.gen} kid={props.kid} setGen={props.setGen} setKid={props.setKid} t={props.t} />
					<Columns.Column>
						<GenerateButton generate={props.generate} t={props.t} />
					</Columns.Column>
				</Columns>
		);
	} else if (props.kty == 'okp') {
		return (
				<Columns>
					<Columns.Column>
						<Form.Field>
							<Form.Label>{props.t('key_props.crv')}</Form.Label>
							<Form.Control>
								<Form.Select onChange={props.setCrv} value={props.crv || ''} className='is-fullwidth'>
									<option value=''></option>
									<option value='Ed25519'>{props.t('key_props.ec_crv.Ed25519')}</option>
									<option value='Ed448'>{props.t('key_props.ec_crv.Ed448')}</option>
									<option value='X25519'>{props.t('key_props.ec_crv.X25519')}</option>
									<option value='X448'>{props.t('key_props.ec_crv.X448')}</option>
								</Form.Select>
							</Form.Control>
						</Form.Field>
					</Columns.Column>
					<Columns.Column>
						<Form.Field>
							<Form.Label>{props.t('key_props.use')}</Form.Label>
							<Form.Control>
								<Form.Select onChange={props.setUse} value={props.use || ''}  className='is-fullwidth'>
									<option value=''></option>
									<option value='sig'>{props.t('key_props.sig')}</option>
									<option value='enc'>{props.t('key_props.enc')}</option>
								</Form.Select>
							</Form.Control>
							</Form.Field>
					</Columns.Column>
					<Columns.Column>
						<AlgSelector setAlg={props.setAlg} alg={props.alg} use={props.use} kty={props.kty} t={props.t} />
					</Columns.Column>
					<KeyIdSelector gen={props.gen} kid={props.kid} setGen={props.setGen} setKid={props.setKid} t={props.t} />
					<Columns.Column>
						<GenerateButton generate={props.generate} t={props.t} />
					</Columns.Column>
				</Columns>
		);
	}
}

const KeyIdSelector = ({...props}) => {
	return (
		<Columns.Column size="two-fifths">
			<Form.Label>{props.t('key_props.kid')}</Form.Label>
			<Form.Field kind='addons'>
				<Form.Control>
					<Form.Select onChange={props.setGen} value={props.gen || ''}>
						<option value='specified'>{props.t('key_props.gen.specified')}</option>
						<option value='sha256'>{props.t('key_props.gen.sha256')}</option>
						<option value='sha1'>{props.t('key_props.gen.sha1')}</option>
						<option value='date'>{props.t('key_props.gen.date')}</option>
						<option value='timestamp'>{props.t('key_props.gen.timestamp')}</option>
					</Form.Select>
				</Form.Control>
				{ props.gen == 'specified' && (
					<Form.Control fullwidth>
						<Form.Input type='text' onChange={props.setKid} value={props.kid || ''} />
					</Form.Control>
				)}
			</Form.Field>
		</Columns.Column>
	);
}

const GenerateButton = ({...props}) => {
	return (
		<Button onClick={props.generate} fullwidth color='primary' size='large'>{props.t('key_props.generate')}</Button>
	);
}

const KeyDisplay = ({...props}) => {
	const jwk = props.keys.jwk ? (
		<Columns.Column size={ props.keys.pub ? 'one-third' : 'half' }>
			<p>{props.t(props.keys.pub ? 'key_display.jwk' : 'key_display.shared_jwk')}</p>
			<SyntaxHighlighter language='json'
				customStyle={{wordBreak: 'break-all', wordWrap: 'break-word', whiteSpace: 'pre-wrap'}}
				>{props.keys.jwk ? JSON.stringify(props.keys.jwk, null, 4) : ''}</SyntaxHighlighter>
			<Button size="large" color="primary" fullwidth onClick={props.copyToClipboard('jwk')}>{props.t('key_display.copy')}</Button>
		</Columns.Column>
	) : null;
	
	const jwks = props.keys.jwks ? (
		<Columns.Column size={ props.keys.pub ? 'one-third' : 'half' }>
			<p>{props.t(props.keys.pub ? 'key_display.jwks' : 'key_display.shared_jwks')}</p>
			<SyntaxHighlighter language='json' 
				customStyle={{wordBreak: 'break-all', wordWrap: 'break-word', whiteSpace: 'pre-wrap'}}
				>{props.keys.jwks ? JSON.stringify(props.keys.jwks, null, 4) : ''}</SyntaxHighlighter>
			<Button size="large" color="info" fullwidth onClick={props.copyToClipboard('jwks')}>{props.t('key_display.copy')}</Button>
		</Columns.Column>
	) : null;
	
	const pub = props.keys.pub ? (
		<Columns.Column size='one-third'>
			<p>{props.t('key_display.pub')}</p>
			<SyntaxHighlighter language='json' 
				customStyle={{wordBreak: 'break-all', wordWrap: 'break-word', whiteSpace: 'pre-wrap'}}
				>{props.keys.pub ? JSON.stringify(props.keys.pub, null, 4) : ''}</SyntaxHighlighter>
			<Button size="large" color="link" fullwidth onClick={props.copyToClipboard('pub')}>{props.t('key_display.copy')}</Button>
		</Columns.Column>
	) : null;
	
	const x509pub = props.keys.x509pub ? (
		<Columns.Column size='one-third'>
			<p>{props.t('key_display.x509pub')}</p>
			<SyntaxHighlighter language='text' 
				customStyle={{wordBreak: 'break-all', wordWrap: 'break-word', whiteSpace: 'pre-wrap'}}
				>{props.keys.x509pub ? props.keys.x509pub : ''}</SyntaxHighlighter>
			<Button size="large" color="light" fullwidth onClick={props.copyToClipboard('pub')}>{props.t('key_display.copy')}</Button>
		</Columns.Column>
	) : null;

	const x509priv = props.keys.x509priv ? (
		<Columns.Column size='one-third'>
			<p>{props.t('key_display.x509priv')}</p>
			<SyntaxHighlighter language='text' 
				customStyle={{wordBreak: 'break-all', wordWrap: 'break-word', whiteSpace: 'pre-wrap'}}
				>{props.keys.x509priv ? props.keys.x509priv : ''}</SyntaxHighlighter>
			<Button size="large" color="warning" fullwidth onClick={props.copyToClipboard('pub')}>{props.t('key_display.copy')}</Button>
		</Columns.Column>
	) : null;

	const cert = props.keys.cert ? (
		<Columns.Column size='one-third'>
			<p>{props.t('key_display.cert')}</p>
			<SyntaxHighlighter language='text' 
				customStyle={{wordBreak: 'break-all', wordWrap: 'break-word', whiteSpace: 'pre-wrap'}}
				>{props.keys.cert ? props.keys.cert : ''}</SyntaxHighlighter>
			<Button size="large" color="success" fullwidth onClick={props.copyToClipboard('pub')}>{props.t('key_display.copy')}</Button>
		</Columns.Column>
	) : null;
	
	return (
		<>
			<Columns>
				{jwk}
				{jwks}
				{pub}
			</Columns>
			<Columns>
				{x509priv}
				{cert}
				{x509pub}
			</Columns>
		</>
	);
	
}

const About = ({...props}) => {
	return (
		<>
			<p className="is-size-4" dangerouslySetInnerHTML={{__html: props.t('about.what')}}>
			</p>
			<br/>
			<p className="is-size-4" dangerouslySetInnerHTML={{__html: props.t('about.never')}}>
			</p>
		</>
	);
}

const Footer = ({...props}) => {
	return (
		<Content className='has-text-centered'>
			<p dangerouslySetInnerHTML={{__html: props.t('footer')}}>
			</p>
		</Content>
	);
}

class LanguageSwitch extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			language: 'en'
		};
		
		if (props.lang) {
			this.selectTab(props.lang)();
		}
	}
	
	selectTab = (lang) => () => {
		// short circuit out if it's not changing
		if (lang == this.state.language) {
			return;
		}
		
		var _self = this;
		
		i18n.changeLanguage(lang).then((t) => {
			_self.setState({
				language: lang
			});
		});
	}
	
	render = () => {
		return (
			<Tabs type='toggle' className='has-background-dark'>
				<Tabs.Tab active={this.state.language == 'en'} onClick={this.selectTab('en')}>
				English
				</Tabs.Tab>
				<Tabs.Tab active={this.state.language == 'ja'} onClick={this.selectTab('ja')}>
				日本語
			</Tabs.Tab>
	</Tabs>
);
	}
}

const urlObject = new URL(window.location);
const lang = urlObject.searchParams.get('lang')

ReactDOM.render((
	<LanguageSwitch lang={lang} />
	), 
	document.getElementById('languageSwitch')
);

ReactDOM.render((
	<Translation i18n={i18n}>
		{
			(t, { i18n }) => <MkJwk t={t} />
		}
	</Translation>
	),
	document.getElementById('react')
);

ReactDOM.render((
	<Translation i18n={i18n}>
		{
			(t, { i18n }) => <Footer t={t} />
		}
	</Translation>
	),
	document.getElementById('footer')
);

ReactDOM.render((
	<Translation i18n={i18n}>
		{
			(t, { i18n }) => <About t={t} />
		}
	</Translation>
	),
	document.getElementById('about')
);
