<template>
  <v-container>
    <v-layout row align-center justify-center fill-height>
      <v-flex shrink>
        <v-card>
          <v-card-text>
            <v-container>
              <form @submit.prevent="onSignup">   
                <v-layout row>
                  <v-flex xs12>
                  <span class="headline">Register</span>
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
                    <v-text-field
                      name="confirmPassword"
                      label="Confirm Password"
                      id="confirmPassword"
                      v-model="confirmPassword"
                      type="password"
                      :rules="[comparePasswords]"></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field
                      name="regToken"
                      label="Invite Token"
                      id="regToken"
                      v-model="regToken"
                      type="password"
                      required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-btn type="submit">Sign up</v-btn>
                  </v-flex>
                </v-layout>
              </form>
                <br>
      <span class="register">Already have an account?<a class="cursor" v-on:click="login()"> Login</a></span>
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    
  </v-container>
</template>

<script>
import { VUEX_POST_USER_REGISTER_REQUEST } from '../store/constants/authentication'
import { mapActions } from 'vuex'

export default {
  data () {
    return { 
      username: '',
      password: '',
      confirmPassword: '',
      regToken: '',
    }
  },
  computed: {
    comparePasswords () {
      return this.password !== this.confirmPassword ? 'Passwords do not match' : ''
    },
  },
  methods: {
    ...mapActions({
      vuexSignup: VUEX_POST_USER_REGISTER_REQUEST
    }),
    onSignup () {
      this.vuexSignup({username: this.username, password: this.password, regToken: this.regToken })
    },
    login() {
            this.$router.push("/login")
    }
  }
}

</script>