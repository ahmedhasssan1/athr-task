<template>
  <div class="select-username">
    <form @submit.prevent="onSubmit">
      <input v-model="username" placeholder="Your username..." />
      <input v-model="password" type="password" placeholder="Your password..." />
      <button :disabled="!isValid">Send</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "SelectUsername",
  data() {
    return {
      username: "",
      password: "",
    };
  },
  computed: {
    isValid() {
      return this.username.length > 2 && this.password.length > 2;
    },
  },
  methods: {
    onSubmit() {
      this.$emit("input", { username: this.username, password: this.password });
    },
  },
};
</script>

<style scoped>
.select-username {
  width: 300px;
  margin: 200px auto 0;
}
</style>