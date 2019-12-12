<template>
  <div>
    <div>
      <form @submit.prevent="createPost" style=" text ">
        Post Title <input type="text" v-model="post.title"/>
        Post Description <input type="text" v-model="post.description"/>
        <div><input type="submit" /></div>
      </form>
    </div>
    <br/><br/><br/>
    <div class="container">
      <div class="row" v-for="post in readPosts"
        :key="post.id">
        <div class="card">
          <h2><a :href="'/#/post/'+ post.id">{{ post.title }}</a></h2>
          <h5>{{ post.description }}</h5>
          <div class="card" v-if="post.comments.length">
            <h3>Comments</h3>
            <div class="fakeimg" v-for="comment in post.comments" :key="comment.id">
              {{ comment.content }} 
            </div>
          </div>
        </div>
        <hr>
      </div>
    </div>
  </div>
</template>

<script>

import gql from 'graphql-tag'

const READ_POSTS = gql`query ReadPosts {
        readPosts
        {
            title,
            id,
            description,
            comments {
              content
            }
        }
    }`;

const CREATE_POST = gql`mutation CREATEPOST_MUTATION($title: String!, $description: String!, $user: ID!) {
        createPost(
            title: $title,
            description: $description,
            user: $user
        ) {
          title,
          description,
        }
    }`;

export default {
  name: 'PostsComponent',
  data () {
    return {
      readPosts: [],
      userDetails: {},
      post: {
        title: null,
        user: null,
        description: null
      },
      comment: {
        content: null,
        user: null,
        post: null
      }
    }
  },
  async created() {
    this.userDetails = JSON.parse(localStorage.getItem('useDetails'));
    this.$apollo.query({
      query: READ_POSTS
    }).then(res=> {
      this.readPosts = res.data.readPosts
    })
    .catch(err => {
      // console.log("err =>", err);
      this.$router.push('login')
    });
  },
  methods: {
    createPost() {
      this.post.user = this.userDetails.userId;
      this.$apollo.mutate({
          mutation: CREATE_POST,
          variables: {
            title: this.post.title,
            description: this.post.description,
            user: this.post.user,
          }
      }).then(res=>{
        this.readPosts.push(res.data.createPost);
        this.clearPostFields();
      });
    },
    clearPostFields() {
      this.post.title = '';
      this.post.description = '';
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

body {
  font-family: Arial;
  padding: 20px;
  background: #f1f1f1;
}

.container {
  height: auto;
  height: 700px;
  overflow: scroll;
  border: solid 1px;
}

/* Header/Blog Title */
.header {
  padding: 30px;
  font-size: 40px;
  text-align: center;
  background: white;
}

/* Create two unequal columns that floats next to each other */
/* Left column */
.leftcolumn {
  float: left;
  width: 75%;
}

/* Right column */
.rightcolumn {
  float: left;
  width: 25%;
  padding-left: 20px;
}

/* Fake image */
.fakeimg {
  background-color: #aaa;
  width: 100%;
  padding: 20px;
}

/* Add a card effect for articles */
.card {
  background-color: white;
  padding: 20px;
  margin-top: 20px;
}

/* Clear floats after the columns */
.row:after {
  content: "";
  display: table;
  clear: both;
}

/* Footer */
.footer {
  padding: 20px;
  text-align: center;
  background: #ddd;
  margin-top: 20px;
}

/* Responsive layout - when the screen is less than 800px wide, make the two columns stack on top of each other instead of next to each other */
@media screen and (max-width: 800px) {
  .leftcolumn, .rightcolumn {
    width: 100%;
    padding: 0;
  }
}

</style>
