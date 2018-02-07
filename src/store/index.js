import Vuex from 'vuex';
import Vue from 'vue';
import * as getters from './getters';
import * as actions from './actions';
import mutations from './mutations';

const state = {
	messages: [
	],
	lastId: 0,
};


Vue.use(Vuex);

const store = new Vuex.Store({
	state,
	getters,
	actions,
	mutations,
	plugins: [],
	strict: true,
});

export default store;
// store.dispatch('enableListener');
