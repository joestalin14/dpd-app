<template>
	<div class="table-component">
		<div class="table-component__search">
			<input
				type="text"
				placeholder="Search..."
				v-model="searchStringInput"
			>
			<Transition name="fade" mode="out-in">
				<span
					v-if="searchStringInput.length"
					class="clear-icon"
					@click="clearSearch()"
				/>
			</Transition>
		</div>

		<div class="table-component__table">
			<div class="table-component__table__head">
				<div
					v-for="item in tableHeadData"
					:key="`tableHeadItem${item.id}`"
					class="table-component__table__head__item"
					:class="`${item.name}`"
					@click="item.inSort ? setActiveSortField(item.name) : () => {}"
				>
					<span class="table-component__table__head__item__text">
						{{ item.title }}
					</span>
					<span
						v-if="item.inSort"
						class="sort-type"
					>
						<span
							class="sort-type__up"
							:class="{'active': sortType === 'ASC' && activeSortField === item.name}"
						/>
						<span
							class="sort-type__down"
							:class="{'active': sortType === 'DESC' && activeSortField === item.name}"
						/>
					</span>
				</div>
			</div>

			<div
				v-if="loadTableData"
				class="table-component__table__preloader"
			>
				Loading data...
			</div>

			<div
				v-if="!loadTableData"
				class="table-component__table__body"
			>
				<Transition name="fade-list" mode="out-in">
					<div
						:key="`page${activePage}${activeSortField}${sortType}`"
						class="table-component__table__body__list"
					>
						<div
							v-for="item in resultData"
							:key="item.id"
							class="table-component__table__body__list__item"
						>
							<div class="table-component__table__body__list__item__cell image">
								<img
									:src="item.image"
									alt=""
								>
							</div>
							<div class="table-component__table__body__list__item__cell name">
								{{ item.name }}
							</div>
							<div class="table-component__table__body__list__item__cell gender">
								{{ item.gender }}
							</div>
							<div class="table-component__table__body__list__item__cell country">
								{{ item.country }}
							</div>
							<div class="table-component__table__body__list__item__cell birth">
								{{ item.birth }}
							</div>
							<div class="table-component__table__body__list__item__cell email">
								{{ item.email }}
							</div>
							<div class="table-component__table__body__list__item__cell phone">
								{{ item.phone }}
							</div>
						</div>
					</div>
				</Transition>
			</div>

			<div
				v-if="!loadTableData && !resultData.length"
				class="table-component__table__empty"
			>
				Have no results
			</div>
		</div>

		<div class="table-component__pagination">
			<PaginationComponent
				:active-page="activePage"
				:quantity="pagesQuantity"
				:set-active-page="setActivePage"
			/>
		</div>
	</div>
</template>

<script>
import PaginationComponent from '@/components/PaginationComponent'

export default {
	name: 'TableComponent',
	components: {
		PaginationComponent
	},
	data: () => ({
		tableHeadData: [
			{
				id: 1,
				name: 'image',
				title: 'Photo',
				inSort: false
			},
			{
				id: 2,
				name: 'name',
				title: 'Name',
				inSort: true
			},
			{
				id: 3,
				name: 'gender',
				title: 'Gender',
				inSort: true
			},
			{
				id: 4,
				name: 'country',
				title: 'Country',
				inSort: true
			},
			{
				id: 5,
				name: 'birth',
				title: 'Birth date',
				inSort: true
			},
			{
				id: 6,
				name: 'email',
				title: 'Email',
				inSort: true
			},
			{
				id: 7,
				name: 'phone',
				title: 'Phone',
				inSort: false
			}
		],
		loadTableData: true,
		tableData: [],
		activePage: 1,
		searchString: '',
		activeSortField: null,
		sortType: null
	}),
	computed: {
		searchStringInput: {
			get () {
				return this.searchString
			},
			set (newValue) {
				this.searchString = newValue
				const query = {}
				for (const key in this.$route.query) {
					query[key] = this.$route.query[key]
				}
				if (newValue.length) {
					query.searching = newValue
				} else {
					delete query.searching
				}
				console.log(query)

				this.$router.push({
					path: this.$route.path,
					query
				})
			}
		},
		clearData () {
			return this.tableData.map((item) => {
				return {
					id: item.id.value,
					image: item.picture.medium,
					name: `${item.name.title} ${item.name.first} ${item.name.last}`,
					gender: item.gender,
					country: item.location.country,
					birth: this.calculateDateFromString(item.dob.date),
					sortBirthDate: new Date(item.dob.date),
					email: item.email,
					phone: item.phone
				}
			})
		},
		filteredData () {
			if (this.searchString.length) {
				return this.clearData.filter((item) => {
					return item.name.toLowerCase().includes(this.searchString.toLowerCase()) ||
						item.gender.toLowerCase().indexOf(this.searchString.toLowerCase()) === 0 ||
						item.country.toLowerCase().includes(this.searchString.toLowerCase()) ||
						item.birth.toLowerCase().includes(this.searchString.toLowerCase()) ||
						item.email.toLowerCase().includes(this.searchString.toLowerCase()) ||
						item.phone.toLowerCase().includes(this.searchString.toLowerCase())
				})
			}
			return this.clearData
		},
		sortedData () {
			if (!this.activeSortField) {
				return this.filteredData
			}
			const result = [...this.filteredData]
			return result.sort((itemA, itemB) => {
				if (this.sortType === 'ASC') {
					if (this.activeSortField === 'birth') {
						return itemA.sortBirthDate < itemB.sortBirthDate ? 1 : -1
					}
					return itemA[this.activeSortField] < itemB[this.activeSortField] ? 1 : -1
				}
				if (this.sortType === 'DESC') {
					if (this.activeSortField === 'birth') {
						return itemA.sortBirthDate > itemB.sortBirthDate ? 1 : -1
					}
					return itemA[this.activeSortField] > itemB[this.activeSortField] ? 1 : -1
				}
				return true
			})
		},
		pagesQuantity () {
			return Math.ceil(this.filteredData.length / 20)
		},
		resultData () {
			return this.sortedData.slice((this.activePage - 1) * 20, this.activePage * 20)
		}
	},
	watch: {
		sortType (newVal) {
			const query = {}
			for (const key in this.$route.query) {
				query[key] = this.$route.query[key]
			}

			if (newVal) {
				query.sort = `${this.activeSortField},${newVal}`
			} else {
				delete query.sort
			}

			this.$router.replace({
				path: this.$route.path,
				query
			})
		},
		pagesQuantity (newVal) {
			if (newVal < this.activePage) {
				newVal ? this.setActivePage(newVal) : this.setActivePage(1)
			}
		}
	},
	async mounted () {
		await this.fetchTableData()
		if (this.$route.query.searching) {
			this.searchString = this.$route.query.searching
		}
		if (this.$route.query.page && !isNaN(+this.$route.query.page)) {
			this.activePage = +this.$route.query.page > this.pagesQuantity ? this.activePage = 1 : this.activePage = +this.$route.query.page
		}
		if (this.$route.query.sort && this.$route.query.sort.split(',').length === 2) {
			this.activeSortField = this.$route.query.sort.split(',')[0]
			this.sortType = this.$route.query.sort.split(',')[1]
		}
	},
	methods: {
		async fetchTableData () {
			await fetch('./data/api.json')
				.then(response => response.json())
				.then((json) => {
					this.tableData = json?.results
					this.loadTableData = false
				})
				.catch((error) => {
					console.error('FETCH TABLE DATA ERROR', error)
				})
		},
		clearSearch () {
			this.searchStringInput = ''
		},
		setActiveSortField (field) {
			if (this.activeSortField !== field) {
				this.activeSortField = field
				this.sortType = 'ASC'
				return true
			}
			if (this.activeSortField === field && this.sortType === 'ASC') {
				this.sortType = 'DESC'
			} else {
				this.activeSortField = null
				this.sortType = null
			}
		},
		setActivePage (num) {
			this.activePage = num
			const query = {}
			for (const key in this.$route.query) {
				query[key] = this.$route.query[key]
			}
			if (num === 1) {
				delete query.page
			} else {
				query.page = num
			}
			this.$router.replace({
				path: this.$route.path,
				query
			})
		},
		calculateDateFromString (string) {
			const date = new Date(string)
			let result = ''
			date.getDate() < 10 ? result += `0${date.getDate()}` : result += date.getDate()
			date.getMonth() + 1 < 10 ? result += `.0${date.getMonth() + 1}` : result += `.${date.getMonth() + 1}`
			result += `.${date.getFullYear()}`
			return result
		}
	}
}
</script>

<style lang="scss" scoped>
.table-component {
	position: relative;
	&__search {
		margin: 30px 0;
		width: 100%;
		max-width: 450px;
		position: relative;
		input[type=text] {
			width: 100%;
			font-size: 14px;
			padding: 10px 15px;
			border: 1px solid #e4e4e4;
			border-radius: 8px;
			outline: none !important;
			transition: .3s ease;
			&:hover, &:focus, &:active {
				border: 1px solid #959595;
			}
		}
		.clear-icon {
			position: absolute;
			right: -20px;
			top: 10px;
			width: 20px;
			height: 20px;
			cursor: pointer;
			&:before {
				position: absolute;
				left: 7px;
				content: '';
				display: inline-block;
				width: 2px;
				height: 20px;
				background-color: #959595;
				transform: rotate(-45deg);
			}
			&:after {
				position: absolute;
				left: 7px;
				content: '';
				display: inline-block;
				width: 2px;
				height: 20px;
				background-color: #959595;
				transform: rotate(45deg);
			}
		}
	}
	&__table {
		overflow-x: auto;
		&__head {
			width: 100%;
			min-width: 840px;
			display: flex;
			align-items: center;
			margin-bottom: 30px;
			padding: 15px 10px;
			background-color: #FFFFFF;
			border-radius: 8px;
			box-shadow: 0 0 15px rgba(#000, .15);
			box-sizing: border-box;
			&__item {
				padding: 5px;
				flex-basis: calc(16.66% - 12.83px);
				font-size: 14px;
				font-weight: 600;
				position: relative;
				color: #333;
				.sort-type {
					display: inline-flex;
					flex-direction: column;
					position: absolute;
					top: 7px;
					margin-left: 10px;
					&__up {
						margin: 2px 0;
						width: 0;
						height: 0;
						border-left: 5px solid transparent;
						border-right: 5px solid transparent;
						border-bottom: 5px solid #808080;
						transition: .3s ease;
					}
					&__down {
						margin: 2px 0;
						width: 0;
						height: 0;
						border-left: 5px solid transparent;
						border-right: 5px solid transparent;
						border-top: 5px solid #808080;
						transition: .3s ease;
					}
					&__up.active {
						border-bottom: 5px solid #000;
					}
					&__down.active {
						border-top: 5px solid #000;
					}

				}
			}
			&__item.image {
				flex-basis: 77px;
				padding: 5px 5px 5px 0;
				text-align: center;
			}
			&__item.name {
				flex-basis: calc(18.66% - 12.83px);
			}
			&__item.gender {
				flex-basis: calc(8.66% - 12.83px);
			}
			&__item.country {
				text-align: center;
			}
			&__item.birth {
				text-align: center;
				flex-basis: calc(14.66% - 12.83px);
			}
			&__item.email {
				word-break: break-word;
				flex-basis: calc(22.66% - 12.83px);
				text-align: center;
			}
			&__item.phone {
				flex-basis: calc(18.66% - 12.83px);
				text-align: center;
			}
			&__item.name, &__item.gender, &__item.country, &__item.birth, &__item.email {
				cursor: pointer;
			}
		}
		&__body {
			min-width: 840px;
			&__list {
				&__item {
					display: flex;
					align-items: center;
					width: 100%;
					padding: 2px 10px;
					border-bottom: 1px solid #e4e4e4;
					box-sizing: border-box;
					&:last-child {
						border-bottom: none;
					}
					&__cell {
						padding: 5px;
						flex-basis: calc(16.66% - 12.83px);
						font-size: 14px;
					}
					&__cell.image {
						flex-basis: 77px;
						padding: 5px 5px 5px 0;
						text-align: center;
						img {
							border-radius: 50%;
							width: 60px;
						}
					}
					&__cell.name {
						flex-basis: calc(18.66% - 12.83px);
						font-weight: 500;
					}
					&__cell.gender {
						flex-basis: calc(8.66% - 12.83px);
					}
					&__cell.country {
						text-align: center;
					}
					&__cell.birth {
						text-align: center;
						flex-basis: calc(14.66% - 12.83px);
					}
					&__cell.email {
						word-break: break-word;
						flex-basis: calc(22.66% - 12.83px);
						text-align: center;
					}
					&__cell.phone {
						flex-basis: calc(18.66% - 12.83px);
						text-align: center;
					}
				}
			}
		}
		&__empty {
			padding: 30px 10px;
			font-size: 14px;
		}
		&__preloader {
			padding: 30px 10px;
			font-size: 14px;
		}
		&::-webkit-scrollbar {
			width: 8px;
		}
		&::-webkit-scrollbar-track {
			background: #FFFFFF
		}
		&::-webkit-scrollbar-thumb {
			background-color: #808080;
			border-radius: 10px;
			border: 3px solid #FFFFFF;
		}
	}
	&__pagination {
		margin: 30px 0;
	}
}
// transitions styles
.fade-enter-active,
.fade-leave-active {
	transition: opacity .3s;
}
.fade-enter,
.fade-leave-to {
	opacity: 0;
}

.fade-list-enter,
.fade-list-leave-to {
	opacity: 0;
	transform: translateY(-50px);
}
.fade-list-enter-active,
.fade-list-leave-active {
	transition: opacity 0.5s, transform 0.5s;
}
</style>
