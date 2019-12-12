<template>
  <div>
    <div>
      <form @submit.prevent="doLogin">
        UserName <input type="text" v-model="login.username"/>
        Password <input type="text" v-model="login.password"/><br/>
        <input type="submit" />
      </form>
      <div style="color: red"> {{responseMessage}} </div>
    </div>
  </div>
</template>

<script>

import gql from 'graphql-tag'

const DO_LOGIN = gql`mutation DOLOGIN_MUTATION($username: String!, $password: String!) {
  login(
    username: $username,
    password: $password
  ) {
    username,
    token,
    userId
  }
}
`    ;
export default {
  name: 'LoginComponent',
  data () {
    return {
      responseMessage: '',
      user: {
        userId: null
      },
      login: {
        username: null,
        password: null
      }
    }
  },
  methods: {
    doLogin() {
      this.$apollo.mutate({
        mutation: DO_LOGIN,
        variables: {
          username: this.login.username,
          password: this.login.password
        }
      }).then(res => {
        res = res.data.login;
        
        let user = {
          'userId' : res.userId,
          'token' : res.token
        }

        localStorage.setItem('useDetails', JSON.stringify(user));
        this.$router.push('post')

      }).catch(err => {
        this.responseMessage = err.message;
      });
      
    },
    clearPostFields() {
        this.post.title = null;
        this.post.description = null;
    }

  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
