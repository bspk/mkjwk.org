import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Tabs, Container, Section, Level, Form, Columns } from 'react-bulma-components';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';


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
	
	render() {
		return (
		<Section>
			<Container>
				<Tabs type='boxed'>
					<Tabs.Tab active={this.state.kty == 'rsa'} onClick={this.selectTab('rsa')}>
					RSA
					</Tabs.Tab>
					<Tabs.Tab active={this.state.kty == 'ec'} onClick={this.selectTab('ec')}>
					EC
					</Tabs.Tab>
					<Tabs.Tab active={this.state.kty == 'oct'} onClick={this.selectTab('oct')}>
					oct
					</Tabs.Tab>
				</Tabs>
				<KeyProps kty={this.state.kty} crv={this.state.crv} size={this.state.size} use={this.state.use} kid={this.state.kid} alg={this.state.alg}
					setSize={this.setSize} setUse={this.setUse} setAlg={this.setAlg} setCrv={this.setCrv} setKid={this.setKid} generate={this.generate} />
				<KeyDisplay kty={this.state.kty} keys={this.state.keys} />
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
							<Form.Label>Key Size</Form.Label>
							<Form.Control>
								<Form.Input type='number' onChange={props.setSize} value={props.size || 0} min='0' step='8' />
							</Form.Control>
						</Form.Field>
				</Columns.Column>
				<Columns.Column>
						<Form.Field>
							<Form.Label>Key Use</Form.Label>
							<Form.Control>
								<Form.Select onChange={props.setUse} value={props.use || ''}>
									<option value=''></option>
									<option value='sig'>Signature</option>
									<option value='enc'>Encryption</option>
								</Form.Select>
							</Form.Control>
						</Form.Field>
				</Columns.Column>
				<Columns.Column>
					<Form.Field>
						<Form.Label>Algorithm</Form.Label>
						<Form.Control>
							<Form.Select onChange={props.setAlg} value={props.alg || ''}>
								<option value=''></option>
								<option value='RS256'>RS256</option>
								<option value='RS384'>RS384</option>
								<option value='RS512'>RS512</option>
								<option value='PS256'>PS256</option>
								<option value='PS384'>PS384</option>
								<option value='PS512'>PS512</option>
							</Form.Select>
						</Form.Control>
						</Form.Field>
				</Columns.Column>
				<Columns.Column>
						<Form.Field>
							<Form.Label>Key ID</Form.Label>
							<Form.Control>
								<Form.Input type='text' onChange={props.setKid} value={props.kid || ''} />
							</Form.Control>
						</Form.Field>
					</Columns.Column>
					<Columns.Column>
						<Button onClick={props.generate}>Generate</Button>
					</Columns.Column>
				</Columns>
		);
	} else if (props.kty == 'ec') {
		return (
				<Columns>
					<Columns.Column>
						<Form.Field>
							<Form.Label>Curve</Form.Label>
							<Form.Control>
								<Form.Select onChange={props.setCrv} value={props.crv || 'P-256'}>
									<option value='P-256'>P-256</option>
									<option value='P-384'>P-384</option>
									<option value='P-521'>P-521</option>
									<option value='P-256K'>P-256K</option>
									<option value='Ed25519'>Ed25519</option>
									<option value='Ed448'>Ed448</option>
									<option value='X25519'>X25519</option>
									<option value='X448'>X448</option>
								</Form.Select>
							</Form.Control>
						</Form.Field>
					</Columns.Column>
					<Columns.Column>
						<Form.Field>
							<Form.Label>Key Use</Form.Label>
							<Form.Control>
								<Form.Select onChange={props.setUse} value={props.use || ''}>
									<option value=''></option>
									<option value='sig'>Signature</option>
									<option value='enc'>Encryption</option>
								</Form.Select>
							</Form.Control>
							</Form.Field>
					</Columns.Column>
					<Columns.Column>
					<Form.Field>
						<Form.Label>Algorithm</Form.Label>
						<Form.Control>
							<Form.Select onChange={props.setAlg} value={props.alg || ''}>
								<option value=''></option>
								<option value='ES256'>ES256</option>
								<option value='ES384'>ES384</option>
								<option value='ES512'>ES512</option>
								<option value='EdDSA'>EdDSA</option>
								<option value='ES256K'>ES256K</option>
							</Form.Select>
						</Form.Control>
						</Form.Field>
					</Columns.Column>
					<Columns.Column>
						<Form.Field>
							<Form.Label>Key ID</Form.Label>
							<Form.Control>
								<Form.Input type='text' onChange={props.setKid} value={props.kid || ''} />
							</Form.Control>
						</Form.Field>
					</Columns.Column>
					<Columns.Column>
					<Button onClick={props.generate}>Generate</Button>
				</Columns.Column>
				</Columns>
		);
	} else if (props.kty == 'oct') {
		return (
				<Columns>
					<Columns.Column>
						<Form.Field>
							<Form.Label>Key Size</Form.Label>
							<Form.Control>
								<Form.Input type='number' onChange={props.setSize} value={props.size || 2048} min='0' step='8' />
							</Form.Control>
						</Form.Field>
					</Columns.Column>
					<Columns.Column>
						<Form.Field>
							<Form.Label>Key Use</Form.Label>
							<Form.Control>
								<Form.Select onChange={props.setUse} value={props.use || ''}>
									<option value=''></option>
									<option value='sig'>Signature</option>
									<option value='enc'>Encryption</option>
								</Form.Select>
							</Form.Control>
							</Form.Field>
					</Columns.Column>
					<Columns.Column>
					<Form.Field>
						<Form.Label>Algorithm</Form.Label>
						<Form.Control>
							<Form.Select onChange={props.setAlg} value={props.alg || ''}>
								<option value=''></option>
								<option value='HS256'>HS256</option>
								<option value='HS384'>HS384</option>
								<option value='HS512'>HS512</option>
							</Form.Select>
						</Form.Control>
						</Form.Field>
					</Columns.Column>
					<Columns.Column>
						<Form.Field>
							<Form.Label>Key ID</Form.Label>
							<Form.Control>
								<Form.Input type='text' onChange={props.setKid} value={props.kid || ''} />
							</Form.Control>
						</Form.Field>
					</Columns.Column>
					<Columns.Column>
					<Button onClick={props.generate}>Generate</Button>
				</Columns.Column>
				</Columns>
		);
	}
}

const KeyDisplay = ({...props}) => {
	if (props.kty == 'rsa' || props.kty == 'ec') {
		return (
			<Columns>
				<Columns.Column size='one-third'>
					<p>Public and Private Keypair</p>
					<SyntaxHighlighter language='json'
						customStyle={{wordBreak: 'break-all', wordWrap: 'break-word', whiteSpace: 'pre-wrap'}}
						>{props.keys.jwk ? JSON.stringify(props.keys.jwk, null, 4) : ''}</SyntaxHighlighter>
				</Columns.Column>
				<Columns.Column size='one-third'>
					<p>Public and Private Keypair Set</p>
					<SyntaxHighlighter language='json' 
						customStyle={{wordBreak: 'break-all', wordWrap: 'break-word', whiteSpace: 'pre-wrap'}}
						>{props.keys.jwks ? JSON.stringify(props.keys.jwks, null, 4) : ''}</SyntaxHighlighter>
				</Columns.Column>
				<Columns.Column size='one-third'>
					<p>Public Key</p>
					<SyntaxHighlighter language='json' 
						customStyle={{wordBreak: 'break-all', wordWrap: 'break-word', whiteSpace: 'pre-wrap'}}
						>{props.keys.pub ? JSON.stringify(props.keys.pub, null, 4) : ''}</SyntaxHighlighter>
				</Columns.Column>
			</Columns>
		);
	} else {
		return (
			<Columns>
			<Columns.Column size='half'>
					<SyntaxHighlighter language='json' 
						customStyle={{wordBreak: 'break-all', wordWrap: 'break-word', whiteSpace: 'pre-wrap'}}
						>{props.keys.jwk ? JSON.stringify(props.keys.jwk, null, 4) : ''}</SyntaxHighlighter>
				</Columns.Column>
				<Columns.Column size='half'>
					<SyntaxHighlighter language='json' 
						customStyle={{wordBreak: 'break-all', wordWrap: 'break-word', whiteSpace: 'pre-wrap'}}
						>{props.keys.jwks ? JSON.stringify(props.keys.jwks, null, 4) : ''}</SyntaxHighlighter>
				</Columns.Column>
			</Columns>
		);
	}
}


ReactDOM.render((
		<MkJwk />
	),
	document.getElementById('react')
);
