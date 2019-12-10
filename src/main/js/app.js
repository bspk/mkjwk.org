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
		this.setState({use: e.target.value});
	}
	
	setAlg = (e) => {
		this.setState({alg: e.target.value});
	}
	
	setCrv = (e) => {
		this.setState({crv: e.target.value});
	}
	
	setKid = (e) => {
		e.target.value;
		this.setState({kid: e.target.value});
	}
	
	generate = (e) => {
		const url = new URL('jwk/' + this.state.kty, window.location.href);
		
		
		this.appendParam(url, 'alg', this.state.alg);
		this.appendParam(url, 'use', this.state.use);
		this.appendParam(url, 'kid', this.state.kid);
		
		if (this.state.kty == 'rsa' || this.state.kty == 'oct') {
			this.appendParam(url, 'size', this.state.size);
		}
		
		if (this.state.kty == 'ec') {
			this.appendParam(url, 'crv', this.state.crv);
		}
		
		fetch(url).then(res => {
			res.json().then(data => {
				this.setState({keys: data});
			});
		});
	}
	
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
				</Tabs>
				<KeyProps kty={this.state.kty} crv={this.state.crv} size={this.state.size} use={this.state.use} kid={this.state.kid} alg={this.state.alg}
					setSize={this.setSize} setUse={this.setUse} setAlg={this.setAlg} setCrv={this.setCrv} setKid={this.setKid} generate={this.generate} t={this.props.t} />
				<KeyDisplay kty={this.state.kty} keys={this.state.keys} t={this.props.t} copyToClipboard={this.copyToClipboard} />
			</Container>
		</Section>
		);
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
					<Form.Field>
						<Form.Label>{props.t('key_props.alg')}</Form.Label>
						<Form.Control>
							<Form.Select onChange={props.setAlg} value={props.alg || ''}  className='is-fullwidth'>
								<option value=''></option>
								<option value='RS256'>{props.t('key_props.signing_alg.RS256')}</option>
								<option value='RS384'>{props.t('key_props.signing_alg.RS384')}</option>
								<option value='RS512'>{props.t('key_props.signing_alg.RS512')}</option>
								<option value='PS256'>{props.t('key_props.signing_alg.PS256')}</option>
								<option value='PS384'>{props.t('key_props.signing_alg.PS384')}</option>
								<option value='PS512'>{props.t('key_props.signing_alg.PS512')}</option>
							</Form.Select>
						</Form.Control>
						</Form.Field>
				</Columns.Column>
				<Columns.Column>
						<Form.Field>
							<Form.Label>{props.t('key_props.kid')}</Form.Label>
							<Form.Control>
								<Form.Input type='text' onChange={props.setKid} value={props.kid || ''} />
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
								<Form.Select onChange={props.setCrv} value={props.crv || 'P-256'} className='is-fullwidth'>
									<option value='P-256'>{props.t('key_props.ec_crv.P256')}</option>
									<option value='P-384'>{props.t('key_props.ec_crv.P384')}</option>
									<option value='P-521'>{props.t('key_props.ec_crv.P521')}</option>
									<option value='P-256K'>{props.t('key_props.ec_crv.P256K')}</option>
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
					<Form.Field>
						<Form.Label>{props.t('key_props.alg')}</Form.Label>
						<Form.Control>
							<Form.Select onChange={props.setAlg} value={props.alg || ''}  className='is-fullwidth'>
								<option value=''></option>
								<option value='ES256'>{props.t('key_props.signing_alg.ES256')}</option>
								<option value='ES384'>{props.t('key_props.signing_alg.ES384')}</option>
								<option value='ES512'>{props.t('key_props.signing_alg.ES512')}</option>
								<option value='EdDSA'>{props.t('key_props.signing_alg.EdDSA')}</option>
								<option value='ES256K'>{props.t('key_props.signing_alg.ES256K')}</option>
							</Form.Select>
						</Form.Control>
						</Form.Field>
					</Columns.Column>
					<Columns.Column>
						<Form.Field>
							<Form.Label>{props.t('key_props.kid')}</Form.Label>
							<Form.Control>
								<Form.Input type='text' onChange={props.setKid} value={props.kid || ''} />
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
					<Form.Field>
						<Form.Label>{props.t('key_props.alg')}</Form.Label>
						<Form.Control>
							<Form.Select onChange={props.setAlg} value={props.alg || ''}  className='is-fullwidth'>
								<option value=''></option>
								<option value='HS256'>{props.t('key_props.signing_alg.HS256')}</option>
								<option value='HS384'>{props.t('key_props.signing_alg.HS384')}</option>
								<option value='HS512'>{props.t('key_props.signing_alg.HS512')}</option>
							</Form.Select>
						</Form.Control>
						</Form.Field>
					</Columns.Column>
					<Columns.Column>
						<Form.Field>
							<Form.Label>{props.t('key_props.kid')}</Form.Label>
							<Form.Control>
								<Form.Input type='text' onChange={props.setKid} value={props.kid || ''} />
							</Form.Control>
						</Form.Field>
					</Columns.Column>
					<Columns.Column>
						<GenerateButton generate={props.generate} t={props.t} />
					</Columns.Column>
				</Columns>
		);
	}
}

const GenerateButton = ({...props}) => {
	return (
		<Button onClick={props.generate} fullwidth color='primary' size='large'>{props.t('key_props.generate')}</Button>
	);
}

const KeyDisplay = ({...props}) => {
	if (props.kty == 'rsa' || props.kty == 'ec') {
		return (
			<Columns>
				<Columns.Column size='one-third'>
					<p>{props.t('key_display.jwk')}</p>
					<SyntaxHighlighter language='json'
						customStyle={{wordBreak: 'break-all', wordWrap: 'break-word', whiteSpace: 'pre-wrap'}}
						>{props.keys.jwk ? JSON.stringify(props.keys.jwk, null, 4) : ''}</SyntaxHighlighter>
					<Button size="large" color="primary" fullwidth onClick={props.copyToClipboard('jwk')}>{props.t('key_display.copy')}</Button>
				</Columns.Column>
				<Columns.Column size='one-third'>
					<p>{props.t('key_display.jwks')}</p>
					<SyntaxHighlighter language='json' 
						customStyle={{wordBreak: 'break-all', wordWrap: 'break-word', whiteSpace: 'pre-wrap'}}
						>{props.keys.jwks ? JSON.stringify(props.keys.jwks, null, 4) : ''}</SyntaxHighlighter>
					<Button size="large" color="info" fullwidth onClick={props.copyToClipboard('jwks')}>{props.t('key_display.copy')}</Button>
				</Columns.Column>
				<Columns.Column size='one-third'>
					<p>{props.t('key_display.pub')}</p>
					<SyntaxHighlighter language='json' 
						customStyle={{wordBreak: 'break-all', wordWrap: 'break-word', whiteSpace: 'pre-wrap'}}
						>{props.keys.pub ? JSON.stringify(props.keys.pub, null, 4) : ''}</SyntaxHighlighter>
					<Button size="large" color="link" fullwidth onClick={props.copyToClipboard('pub')}>{props.t('key_display.copy')}</Button>
				</Columns.Column>
			</Columns>
		);
	} else {
		return (
			<Columns>
				<Columns.Column size='half'>
					<p>{props.t('key_display.shared_jwk')}</p>
					<SyntaxHighlighter language='json' 
						customStyle={{wordBreak: 'break-all', wordWrap: 'break-word', whiteSpace: 'pre-wrap'}}
						>{props.keys.jwk ? JSON.stringify(props.keys.jwk, null, 4) : ''}</SyntaxHighlighter>
					<Button size="large" color="primary" fullwidth onClick={props.copyToClipboard('jwk')}>{props.t('key_display.copy')}</Button>
				</Columns.Column>
				<Columns.Column size='half'>
					<p>{props.t('key_display.shared_jwks')}</p>
					<SyntaxHighlighter language='json' 
						customStyle={{wordBreak: 'break-all', wordWrap: 'break-word', whiteSpace: 'pre-wrap'}}
						>{props.keys.jwks ? JSON.stringify(props.keys.jwks, null, 4) : ''}</SyntaxHighlighter>
					<Button size="large" color="info" fullwidth onClick={props.copyToClipboard('jwks')}>{props.t('key_display.copy')}</Button>
				</Columns.Column>
			</Columns>
		);
	}
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
console.log(lang)

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
