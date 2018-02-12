import Vuex from 'vuex';
import Vue from 'vue';
import * as getters from './getters';
import * as actions from './actions';
import mutations from './mutations';

const state = {
	messages: {

	},
	state: {

	},
	lastId: 0,
	serverStates: {},
	pendingOperations: {},
};


Vue.use(Vuex);

const store = new Vuex.Store({
	state,
	getters,
	actions,
	mutations,
	plugins: [],
	strict: process.env.NODE_ENV !== 'production',
});

export default store;
// store.dispatch('enableListener');
