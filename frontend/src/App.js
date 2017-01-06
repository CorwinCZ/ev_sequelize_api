import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import {Tabs, Tab} from 'material-ui/Tabs';


import injectTapEventPlugin from 'react-tap-event-plugin';
 
// Needed for onTouchTap 
// http://stackoverflow.com/a/34015469/988941 
injectTapEventPlugin();

class AddPerson extends Component {
	constructor() {
		super();
		this.state = {
			show: false,
		}
	}

	toogleShow(event) {
		this.setState({
			show: !this.state.show,
		})
	}

	render() {
		let form_elem = this.state.show ? 
				<PersonForm />
				: '';
		return <PersonForm />

		return (
			<div>
				{/*<button onClick={this.toogleShow.bind(this)}>{this.state.show ? 'Skrýt formulář' : 'Zobrazit formulář pro přidání person'}</button>*/}

				<RaisedButton onClick={this.toogleShow.bind(this)} label={this.state.show ? 'Skrýt formulář' : 'Zobrazit formulář pro přidání person'} />

				{form_elem}
			</div>
		)
	}
}

class PersonForm extends Component {
	constructor() {
		super();
		this.state = {
			first_name: '',
			last_name: '',
			email: '',
			height: '',
		}
		this.handleChangeFirstName = this.handleChangeFirstName.bind(this);
		this.handleChangeLastName = this.handleChangeLastName.bind(this);
		this.handleChangeEmail = this.handleChangeEmail.bind(this);
		this.handleChangeHeight = this.handleChangeHeight.bind(this);
	}

	submitData(event) {
		let myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");

		let request_data = {
			method: 'post',
			headers: myHeaders,
			body: JSON.stringify(this.state),
		}

		fetch('http://localhost:3000/api/insert_person', request_data)
		.then((response) => response.json())
		.then(function(finData) {
			console.log('výsledek odeslání je', finData);
		}.bind(this)); 
	}

	handleChangeFirstName(event) {
		this.setState({first_name: event.target.value});
	}

	handleChangeLastName(event) {
		this.setState({last_name: event.target.value});
	}

	handleChangeEmail(event) {
		this.setState({email: event.target.value});
	}

	handleChangeHeight(event) {
		this.setState({height: event.target.value});
	}

	render() {
		return (
			<div className="addPerson">
				<TextField 
					floatingLabelText="Křestní jméno"
					defaultValue={this.state.first_name}
					onChange={this.handleChangeFirstName}
				/><br />
				<TextField 
					floatingLabelText="Příjmení"
					defaultValue={this.state.last_name}
					onChange={this.handleChangeLastName}
				/><br />
				<TextField 
					floatingLabelText="Email"
					defaultValue={this.state.email}
					onChange={this.handleChangeEmail}
				/><br />
				<TextField 
					floatingLabelText="Výška"
					defaultValue={this.state.height}
					onChange={this.handleChangeHeight}
				/><br />
				<RaisedButton onClick={this.submitData.bind(this)} label="Odeslat data" />
				{/*<button onClick={this.submitData.bind(this)}>Odeslat data</button>*/}
			</div>
		)
	}
}

class PersonTable extends Component {
	constructor() {
		super();
		this.state = {
			data: false,
		}
	}

	componentDidMount() {
		this.reloadData();
	}

	reloadData() {
		let myHeaders = new Headers();
		myHeaders.append('Content-Type', 'application/json');

		let query = {
			query: `{
				allPeople {
					id
					last_name
					first_name
					email
					height
					createdAt
					updatedAt
					additional_data
				}
			}`
		}

		let request_data = {
			method: 'post',
			headers: myHeaders,
			body: JSON.stringify(query),
		}

		fetch('http://localhost:3000/graph_hot', request_data)
		.then((response) => response.json())
		.then(function(modData) {
			this.setState({'data': modData.data.allPeople})
		}.bind(this));

/*
		fetch('http://localhost:3000/api/person', {method: 'post'})
		.then((response) => response.json())
		.then(function(modData) {
			this.setState({'data': modData})
		}.bind(this));
*/
	}

	render() {
		console.log('Data person table jsou', this.state.data);
		if(this.state.data === false) {
			return <LoadingData />
		}

		let dataRowList = this.state.data.map((row, index) =>
			<PersonTableRow data={row} key={index} />
		);
		let dataRowListMaterial = this.state.data.map((row, index) =>
			<PersonTableRowMaterial data={row} key={index} />
		);

		return (
			<div>
				<Table selectable={false}>
					<TableHeader adjustForCheckbox={false} displaySelectAll={false}>
						<TableRow>
							<TableHeaderColumn>ID</TableHeaderColumn>
							<TableHeaderColumn>Křestní</TableHeaderColumn>
							<TableHeaderColumn>Příjmení</TableHeaderColumn>
							<TableHeaderColumn>Email</TableHeaderColumn>
							<TableHeaderColumn>Výška</TableHeaderColumn>
							<TableHeaderColumn>Datum Založení</TableHeaderColumn>
							<TableHeaderColumn>Poslední editace</TableHeaderColumn>
							<TableHeaderColumn>Další data</TableHeaderColumn>
						</TableRow>
					</TableHeader>
					<TableBody displayRowCheckbox={false}>
						{dataRowListMaterial}
					</TableBody>
				</Table>
				{/*<table>
					<thead>
						<tr>
							<th>ID</th>
							<th>Křestní</th>
							<th>Příjmení</th>
							<th>Email</th>
							<th>Výška</th>
							<th>Datum Založení</th>
							<th>Poslední editace</th>
							<th>Další data</th>
						</tr>
					</thead>
					<tbody>
						{dataRowList}
					</tbody>
				</table>*/}
				<RaisedButton onClick={this.reloadData.bind(this)} label="Reload table" />
				{/*<button onClick={this.reloadData.bind(this)}>Reload table</button>*/}
			</div>
		)
	}
}

const PersonTableRowMaterial = function(props) {
	return (
		<TableRow>
			<TableRowColumn>{props.data.id}</TableRowColumn>
			<TableRowColumn>{props.data.first_name}</TableRowColumn>
			<TableRowColumn>{props.data.last_name}</TableRowColumn>
			<TableRowColumn>{props.data.email}</TableRowColumn>
			<TableRowColumn>{props.data.height}</TableRowColumn>
			<TableRowColumn>{props.data.createdAt}</TableRowColumn>
			<TableRowColumn>{props.data.updatedAt}</TableRowColumn>
			<TableRowColumn>{props.data.additional_data}</TableRowColumn>
		</TableRow>
	)
}

const PersonTableRow = function(props) {
	return (
		<tr>
			<td>{props.data.id}</td>
			<td>{props.data.first_name}</td>
			<td>{props.data.last_name}</td>
			<td>{props.data.email}</td>
			<td>{props.data.height}</td>
			<td>{props.data.createdAt}</td>
			<td>{props.data.updatedAt}</td>
			<td>{props.data.additional_data}</td>
		</tr>
	)
}

const LoadingData = function(props) {
	return (
		<div>
			Načítám data, tak vydrž prťka!
		</div>
	)
}

class App extends Component {
	render() {
		return (
			<MuiThemeProvider>
				<div className="App">
					
					<div className="App-header">
						<img src={logo} className="App-logo" alt="logo" />
						<h2>Test react + express</h2>
					</div>
					<Tabs>
						<Tab label="Přehled dat">
							<PersonTable />
						</Tab>
						<Tab label="Přidat kontakt">
							<AddPerson />
						</Tab>
					</Tabs>
				</div>
			</MuiThemeProvider>
		);
	}
}

export default App;
