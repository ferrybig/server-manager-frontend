import Vue from 'vue';
import Router from 'vue-router';

const HelloWorld = () => import(/* webpackChunkName: "main-app" */ '@/components/HelloWorld');
const SmfListing = () => import(/* webpackChunkName: "main-app" */ '@/pages/List');
const SmfServer = () => import(/* webpackChunkName: "main-app" */ '@/pages/Server');

Vue.use(Router);

export default new Router({
	routes: [
		{
			path: '/',
			name: 'HelloWorld',
			component: HelloWorld,
		},
		{
			path: '/list',
			name: 'Listing',
			component: SmfListing,
		},
		{
			path: '/server/:server',
			name: 'Server',
			component: SmfServer,
			props: true,
		},
	],
});
