<template>
  <v-card rounded="lg">

    <!-- HEADER -->
    <div class="text-button font-weight-bold mx-2 pt-1">
      {{ $t('password.header') }}
    </div>
    
    <v-form 
      ref="form"
      v-model="valid"
      lazy-validation
    >

      <v-card-text>
        <v-text-field
          autocomplete="current-user"
          label="user"
          type="text"
          style="display: none"
        ></v-text-field>

        <v-text-field
          v-model="newPassword"
          autocomplete="current-password"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :rules="[rules.required, rules.password]"
          :type="showPassword ? 'text' : 'password'"
          :label="$t('password.pwd.label')"
          :hint="$tc('password.pwd.hint', minLetter, { n : minLetter })"
          persistent-hint
          counter
          required
          @keyup.enter="submit"
          @click:append="showPassword = !showPassword"
        ></v-text-field>
      </v-card-text>
    
      <v-card-actions>
        <v-btn
          text
          rounded
          @click="back()"
        >
          {{ $t('common.back') }}
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn
          rounded
          color="primary"
          class="px-2"
          @click="submit"
        >
          {{ $t('password.btn') }}
        </v-btn>  
      </v-card-actions>
    </v-form>

  </v-card>
</template>

<script>
import { mapActions } from 'vuex'
/*
|---------------------------------------------------------------------
| Change pwd
|---------------------------------------------------------------------
*/
export default {
  data() {
    return {
      valid: true,
      newPassword: '',
      showPassword: false,
      minLetter: 6,

      // input rules
      rules: {
        required: (value) => !!value || this.$t('scene.valid.required'),
        password: (value) => {
          const pattern = /^(?=.*[a-z])(?=.*[0-9])(?=.{6,})/

          return (
            pattern.test(value) || this.$tc('password.pwd.hint', this.minLetter, { n : this.minLetter })
          )
        }
      }
    }
  },
  methods: {
    ...mapActions('cargo', ['postConfigProfile']),
    ...mapActions('app', ['showSuccess', 'showError']),

    submit() {
      if (!this.$refs.form.validate()) return

      this.postConfigProfile({ pass: this.newPassword })
        .then(() => this.showSuccess(this.$tc('password.success')))
    },

    back() {
      return this.$router.go(-1)
    }
  }
}
</script>