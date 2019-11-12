<template>
  <v-container>
    <v-layout align-center justify-center row fill-height>
      <v-flex shrink align-self-center>
        <v-card>
          <v-card-text>
            <v-container>
              <form @submit.prevent="onSignIn">
                <v-layout row>
                  <v-flex xs12>
                    <span class="headline">Member Login</span>
                    <v-text-field
                      name="username"
                      label="username"
                      id="username"
                      v-model="username"
                      type="username"
                      required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field
                      name="password"
                      label="Password"
                      id="password"
                      v-model="password"
                      type="password"
                      required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-btn type="submit">Sign In</v-btn>
                  </v-flex>
                </v-layout>
              </form>
              <br>
              <span class="register">No account?<a class="cursor" v-on:click="register()"> Register</a></span>
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

import { VUEX_POST_USER_LOGIN_REQUEST } from '../store/constants/authentication'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Login',
  data() {
    return {
      username: null,
      password: null,
    }
  },
    methods: {
    ...mapActions({
      login: VUEX_POST_USER_LOGIN_REQUEST
    }),

    onSignIn() {
      this.login({username: this.username, password: this.password})
    },

    register() {
      this.$router.push("/register")
    },
  },

}

</script>
<style scoped>
.cursor {
  cursor: pointer;
}
.register {
  color: white;
}
</style>