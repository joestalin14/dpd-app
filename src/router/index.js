import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

const originalReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace(location, onComplete, onAbort) {
	const result = originalReplace.call(
		this,
		location,
		onComplete,
		onAbort
	);
	if (result) {
		return result.catch(err => {
			if (err.name !== 'NavigationDuplicated') {
				throw err
			}
		})
	}
	return result
}

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		name: 'home',
		component: HomeView
	}
]

const router = new VueRouter({
	history: true,
	mode: 'history',
	routes
})

export default router
