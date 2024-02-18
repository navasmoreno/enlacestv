<template>
	<div id="modal-alert" class="modal" :class="{ 'is-active': this.showModal == 1 }">
		<div class="modal-background"></div>

		<div class="modal-content" style="width: auto;min-width: 300px;">
			<div class="box my-4" style="">
				<!-- Your content -->
				<div class="container">
					<div v-if="this.title" class="columns">
						<div class="column">
							<p>{{ this.title }}</p>
						</div>
					</div>
					<hr v-if="this.title">
					<div v-if="this.content" class="columns">
						<div class="column">
							<p>{{ this.content }}</p>
						</div>
					</div>
					<hr v-if="this.content">
					<div class="columns">
						<div v-if="this.type == 'alert'" class="column">
							<div class="buttons is-justify-content-end">
								<button class="button is-info" @click="close">Aceptar</button>
							</div>
						</div>
						<div v-if="this.type == 'confirm'" class="column">
							<div class="buttons is-justify-content-end">
								<button class="button is-info" @click="response(true)">Aceptar</button>
								<button class="button is-danger" @click="close">Cancelar</button>
							</div>
						</div>
						<div v-if="this.type == 'confirm_yesno'" class="column">
							<div class="buttons is-justify-content-end">
								<button class="button is-info" @click="response(true)">Si</button>
								<button class="button is-danger" @click="response(false)">No</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	name: 'ModalAlert',
	mounted() {

	},
	async beforeMount() {
	},
	emits:['callback'],
	props: {
		type: String,
		content: String,
		title: String
	},
	data() {
		return {
			showModal: false
		}
	},
	methods: {
		close() {
			this.showModal = false;
		},
		open() {
			this.showModal = true;
		},
		response(value) {
			// if (this.callback) callback(true);
			this.$emit('callback', value);
			this.close();
		}
	}
}
</script>
<style></style>