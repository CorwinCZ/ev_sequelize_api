let Sequelize = require('sequelize');
let models  = require('./models');

var { 
	GraphQLSchema, 
	GraphQLObjectType,
	GraphQLString,
	GraphQLList,
	GraphQLInt,
} = require('graphql');


const PersonType = new GraphQLObjectType({
	name: 'Person',
	description: 'Somebody that you used to know',
	fields: () => ({
		id: {
			type: GraphQLString,
			description: 'Idčko',
			resolve: obj => obj.id,
		},
		first_name: {
			type: GraphQLString,
			description: 'What you yell at me',
			resolve: obj => obj.first_name,
		},
		last_name: {
			type: GraphQLString,
			description: 'What you yell at me when I\'ve been bad',
			resolve: obj => obj.last_name,
		},
		email: {
			type: GraphQLString,
			description: 'Where to send junk mail',
		},
		height: {
			type: GraphQLString,
			description: 'Log in as this',
		},
		createdAt: {type: GraphQLString},
		updatedAt: {type: GraphQLString},
		additional_data: {type: GraphQLString},
		pets: {
			type: new GraphQLList(PetType),
			description: 'Pets of this person',
			resolve(root, args) {
				let where = {
					personId: root.id,
				}
				args.id !== undefined ? where.id = args.id : ''
				
				return models.Pet.findAll({
						raw: true,
						where: where
					}).then(dbData => dbData)
			} 
		}





	/*
	friends: {
	  type: new GraphQLList(PersonType),
	  description: 'People who lent you money',
	  resolve: (obj, args, {loaders}) =>
		loaders.person.loadManyByURL(obj.friends),
	},*/
  }),
});

const PetType = new GraphQLObjectType({
	name: 'Pet',
	description: 'Mazlici!',
	fields: () => ({
		id: {type: GraphQLString},
		name: {type: GraphQLString},
		type: {type: GraphQLString},
		// id: {type: GraphQLString},
	}),
});


const QueryType = new GraphQLObjectType({
	name: 'Query',
	description: 'The root of all Queries!',

	fields: () => ({
		person: {
			type: GraphQLString,
			resolve() {
				return 'poky doky inside response';
			}
		},

		allPets: {
			type: new GraphQLList(PetType),
			description: 'Nějaký breberky co se nedají žrát',
			args: {
				id: {type: GraphQLString},
			},
			resolve(root, args) {
				let where = {}
				args.id !== undefined ? where.id = args.id : ''
				
				return models.Pet.findAll({
						raw: true,
						where: where
					}).then(dbData => dbData)
			}
		},

		allPeople: {
			type: new GraphQLList(PersonType),
			// type: PersonType,
			description: 'Everyone, everywhere',
			args: {
				id: {type: GraphQLString},
			},
			resolve(root, args) {
				console.log('Vypisuji lidi');
				let where = {}
				args.id !== undefined ? where.id = args.id : ''
				
				return models.Person.findAll({
						raw: true,
						where: where
					}).then(dbData => dbData)
			}
		},
	})
})

/*
models.Person.findAll({
		raw: true,
		/*include: [{
			model: models.Pet,
			where: { personId: Sequelize.col('Person.id') }
		}]*/
/*	}).then(function(dbData) {
		// console.log('data jsou', dbData)
		res.send(dbData)
	})

*/

module.exports = new GraphQLSchema({
	query: QueryType,
})



/*

import fetch from 'node-fetch';
import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';
import {
  fromGlobalId,
  globalIdField,
  nodeDefinitions,
} from 'graphql-relay';

const {
  nodeField,
  nodeInterface,
} = nodeDefinitions(
  // A method that maps from a global id to an object
  (globalId, {loaders}) => {
	const {id, type} = fromGlobalId(globalId);
	if (type === 'Person') {
	  return loaders.person.load(id);
	}
  },
  // A method that maps from an object to a type
  (obj) => {
	if (obj.hasOwnProperty('username')) {
	  return PersonType;
	}
  }
);

const PersonType = new GraphQLObjectType({
  name: 'Person',
  description: 'Somebody that you used to know',
  fields: () => ({
	id: globalIdField('Person'),
	firstName: {
	  type: GraphQLString,
	  description: 'What you yell at me',
	  resolve: obj => obj.first_name,
	},
	lastName: {
	  type: GraphQLString,
	  description: 'What you yell at me when I\'ve been bad',
	  resolve: obj => obj.last_name,
	},
	fullName: {
	  type: GraphQLString,
	  description: 'A name sandwich',
	  resolve: obj => `${obj.first_name} ${obj.last_name}`,
	},
	email: {
	  type: GraphQLString,
	  description: 'Where to send junk mail',
	},
	username: {
	  type: GraphQLString,
	  description: 'Log in as this',
	},
	friends: {
	  type: new GraphQLList(PersonType),
	  description: 'People who lent you money',
	  resolve: (obj, args, {loaders}) =>
		loaders.person.loadManyByURL(obj.friends),
	},
  }),
  interfaces: [nodeInterface],
});

const QueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'The root of all... queries',
  fields: () => ({
	allPeople: {
	  type: new GraphQLList(PersonType),
	  description: 'Everyone, everywhere',
	  resolve: (root, args, {loaders}) => loaders.person.loadAll(),
	},
	/*
	node: nodeField,
	person: {
	  type: PersonType,
	  args: {
		id: {type: new GraphQLNonNull(GraphQLID)},
	  },
	  resolve: (root, args, {loaders}) => loaders.person.load(args.id),
	},
	*//*
  }),
});

export default new GraphQLSchema({
  query: QueryType,
});*/