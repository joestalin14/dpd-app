<template>
	<div class="home-page">
		<h1 class="home-page__title">DPD Table</h1>
		<div class="home-page__inner">
			<TableComponent />
		</div>
	</div>
</template>

<script>
import TableComponent from '@/components/TableComponent'

export default {
	name: 'HomeView',
	components: {
		TableComponent
	}
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
body, html {
	margin: 0;
	padding: 0;
}
h1, h2, h3, h4, h5, h6 {
	font-family: 'Manrope', sans-serif;
}
p, li, a, span, div, section, input, textarea, button {
	font-family: 'Manrope', sans-serif;
}
.home-page {
	display: block;
	margin: auto;
	padding: 0 15px;
	width: 1200px;
	max-width: 100%;
	box-sizing: border-box;
	&__title {
		font-size: 30px;
	}
	&__inner {
		overflow-x: auto;
	}
}
</style>
