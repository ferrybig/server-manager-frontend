import Vue from 'vue';
import Router from 'vue-router';

const SmfListing = () => import(/* webpackChunkName: "main-app" */ '@/pages/List');
const SmfServer = () => import(/* webpackChunkName: "main-app" */ '@/pages/Server');
const SmfServerConsole = () => import(/* webpackChunkName: "main-app" */ '@/pages/server/Console');
const SmfServerConfig = () => import(/* webpackChunkName: "main-app" */ '@/pages/server/Config');

Vue.use(Router);

export default new Router({
	routes: [
		{
			path: '/',
			redirect: {
				name: 'ServersList',
			},
		},
		{
			path: '/server',
			name: 'ServersList',
			component: SmfListing,
		},
		{
			path: '/server/:server',
			name: 'Server',
			component: SmfServer,
			props: true,
			children: [
				{
					path: '',
					name: 'ServerConsole',
					component: SmfServerConsole,
					props: true,
				},
				{
					path: 'config',
					name: 'ServerConfig',
					component: SmfServerConfig,
					props: true,
				},
			],
		},
	],
});
