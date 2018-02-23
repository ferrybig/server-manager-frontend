<template>
	<ol>
		<li
			v-for="(value, key) in list"
			:key="key"
		>
			<property-text-field
				:value="value"
				@input="e=>updated(key, e)"
			/>
			<button @click.prevent="del(key)">
				X
			</button>
		</li>
		<li>
			<button @click.prevent="add()">
				Add
			</button>
		</li>
	</ol>

</template>

<script>
import PropertyTextField from './PropertyTextField';

export default {
	name: 'PropertyList',
	components: {
		PropertyTextField,
	},
	model: {
		prop: 'value',
		event: 'input',
	},

	props: {
		value: {
			type: String,
			required: true,
		},
	},
	computed: {
		list() {
			return this.value.split('\0');
		},
	},
	// Methods
	methods: {
		updated(key, value) {
			const array = this.list;
			array[key] = value;
			this.$emit('input', array.join('\0'));
		},
		del(key) {
			const array = this.list;
			array.splice(key, 1);
			this.$emit('input', array.join('\0'));
		},
		add() {
			const array = this.list;
			array.push('');
			this.$emit('input', array.join('\0'));
		},
	},
};
</script>

