<template>
	<div class="pagination-component">
		<div
			v-if="quantity < 6"
			class="pagination-component__list"
		>
			<div
				v-for="n in quantity"
				:key="`paginationItem${n}`"
				class="pagination-component__list__item"
				:class="{'active': n === activePage}"
				@click="setActivePage(n)"
			>
				{{ n }}
			</div>
		</div>
		<div
			v-else
			class="pagination-component__list"
		>
			<div
				class="pagination-component__list__item"
				:class="{'active': 1 === activePage}"
				@click="setActivePage(1)"
			>
				1
			</div>
			<div
				v-if="[1, 2, 3].includes(activePage)"
				class="pagination-component__list__item"
				:class="{'active': 2 === activePage}"
				@click="setActivePage(2)"
			>
				2
			</div>
			<div
				v-if="[1, 2, 3].includes(activePage)"
				class="pagination-component__list__item"
				:class="{'active': activePage === 3}"
				@click="setActivePage(3)"
			>
				3
			</div>
			<div
				v-if="activePage === 3"
				class="pagination-component__list__item"
				@click="setActivePage(4)"
			>
				4
			</div>
			<div
				v-if="activePage > 3"
				class="pagination-component__list__separator"
			>
				...
			</div>
			<div
				v-if="activePage > 3"
				class="pagination-component__list__item"
				@click="setActivePage(activePage - 1)"
			>
				{{ activePage - 1 }}
			</div>
			<div
				v-if="activePage > 3"
				class="pagination-component__list__item"
				:class="{'active': activePage}"
				@click="setActivePage(activePage)"
			>
				{{ activePage }}
			</div>
			<div
				v-if="activePage > 3 && activePage < quantity"
				class="pagination-component__list__item"
				@click="setActivePage(activePage + 1)"
			>
				{{ activePage + 1 }}
			</div>
			<div
				v-if="activePage < quantity - 2"
				class="pagination-component__list__separator"
			>
				...
			</div>
			<div
				v-if="activePage < quantity - 1"
				class="pagination-component__list__item"
				@click="setActivePage(quantity)"
			>
				{{ quantity }}
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		activePage: {
			type: Number,
			default: 1
		},
		quantity: {
			type: Number,
			default: 0
		},
		setActivePage: {
			type: Function,
			default: () => {}
		}
	}
}
</script>

<style lang="scss" scoped>
.pagination-component {
	&__list {
		display: flex;
		&__item {
			font-size: 14px;
			padding: 7px 15px;
			cursor: pointer;
			background-color: #EDEDED;
			border-radius: 5px;
			margin-right: 5px;
			transition: .3s ease;
		}
		&__item.active {
			background-color: #C4C4C4;
		}
	}
}
</style>
