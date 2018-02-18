<template>
	<div>
		<template v-if="info">
			<fieldset
				v-for="(groupValue, groupKey) in info.values"
				:key="groupKey"
			>
				<legend>{{ groupKey }}</legend>
				<fieldset
					v-for="(value, key) in groupValue"
					:key="key"
				>
					<legend>{{ key }}</legend>
					<p>{{ info.format[groupKey][key].description }}</p>
					<input
						:value="value"
						@input="e => update(groupKey, key, e.currentTarget.value)"
					>
				</fieldset>
			</fieldset>
		</template>
		<div v-else>
			Loading...
		</div>
		<div>
			Last update:
			<pre>{{ updated }}</pre>
		</div>
	</div>
</template>
<script>


export default {
	props: {
		server: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			updated: undefined,
		};
	},
	computed: {

		info() {
			return this.$store.state.serverInfo[this.server];
		},
	},
	methods: {
		update(groupKey, key, value) {
			this.updated = { groupKey, key, value };
		},
	},
};
</script>
