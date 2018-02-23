<template>
	<input
		type="text"
		v-model="data"
	>
</template>

<script>
export default {
	name: 'PropertyTextField',

	props: {
		value: {
			type: String,
			required: true,
		},
	},
	computed: {
		data: {
			get() {
				return this.value;
			},
			set(val) {
				this.$emit('input', val);
			},
		},
	},
};
</script>

