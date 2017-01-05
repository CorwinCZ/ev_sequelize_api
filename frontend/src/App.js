import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

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
		return (
			<div>
				<button onClick={this.toogleShow.bind(this)}>{this.state.show ? 'Skrýt formulář' : 'Zobrazit formulář pro přidání person'}</button>
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
			<div >
				<div>
					<label>Křestní</label>
					<input value={this.state.first_name} onChange={this.handleChangeFirstName} />
				</div>
				<div>
					<label>Příjmení</label>
					<input value={this.state.last_name} onChange={this.handleChangeLastName} />
				</div>
				<div>
					<label>Email</label>
					<input value={this.state.email} onChange={this.handleChangeEmail} />
				</div>
				<div>
					<label>Výška</label>
					<input value={this.state.height} onChange={this.handleChangeHeight} />
				</div>
				<button onClick={this.submitData.bind(this)}>Odeslat data</button>
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

		return (
			<div>
				<table>
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
				</table>
				<button onClick={this.reloadData.bind(this)}>Reload table</button>
			</div>
		)
	}
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
			<div className="App">
				<div className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<h2>Test react + express</h2>
				</div>
				<AddPerson />
				<PersonTable />
			</div>
		);
	}
}

export default App;
