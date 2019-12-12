<template>
  <div class="container">
    <div class="row">
      <div class="card" v-if="validatePost">
        <h2>{{ readPosts.title }}</h2>
        <h5>{{ readPosts.description }}</h5>
        <div class="card" v-if="readPosts.comments.length">
          <h3>Comments</h3>
          <div class="fakeimg" v-for="comment in readPosts.comments" :key="comment.id">
            {{ comment.content }} 
          </div>
        </div>

        <form @submit.prevent="createComment" style=" text ">
          Comment <input type="text" v-model="createPostComment.content"/>
          <div><input type="submit" /></div>
        </form>

      </div>
      <hr>
    </div>
  </div>
</template>

<script>

import gql from 'graphql-tag'

const READ_POST = gql`query ReadPosts($_id: ID!) {
        readPost(id: $_id)
        {
            title,
            id,
            description,
            comments {
              content
            }
        }
    }`;

  const CREATE_COMMENT = gql`mutation CREATEPOST_MUTATION($content: String!, $post: ID!, $user: ID!) {
        createComment(
            content: $content,
            post: $post,
            user: $user
        ) {
          content
        }
    }`;

export default {
  name: 'PostComponent',
  data () {
    return {
      readPosts: {},
      validatePost: false,
      createPostComment: {
        content: null,
      },
    }
  },
  async created() {
    this.userDetails = JSON.parse(localStorage.getItem('useDetails'));
    this.postId = this.$route.params.id;
    this.$apollo.query({
      query: READ_POST,
      variables: {
        _id: this.postId
      }
    }).then(res=> {
      this.validatePost = true;
      this.readPosts = res.data.readPost;
    })
    .catch(err => {
      this.$router.push('login')
    });
  },
  methods: {

    createComment() {
      this.$apollo.mutate({
          mutation: CREATE_COMMENT,
          variables: {
            content: this.createPostComment.content,
            post: this.postId,
            user: this.userDetails.userId
          }
      }).then(res=>{
        this.createPostComment.content = res.data.createComment.content;
        this.readPosts.comments.push(this.createPostComment);
      });
    },
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
