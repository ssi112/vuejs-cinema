// have to use this command to run the correct version of webpack
//  node_modules/.bin/webpack

import './style.scss';
import Vue from 'vue';
import genres from './util/genres'

new Vue({
  el: '#app',
  data: {
    genre: [],
    time: []
  },
  methods: {
    checkFilter(category, title, checked) {
      // console.log(category, title, checked);
      if (checked) {
        this[category].push(title);
      } else {
        let index = this[category].indexOf(title); // -1 if not found
        if (index > -1) {
          this[category].splice(index, 1); // remove 1 item from array
        }
      }
    }
  },
  components: {
    'movie-list': {
      template: `<div id="movie-list">
                    <div v-for="movie in filteredMovies" class="movie">{{ movie.title }}</div
                 </div>`,
      data() {
        return {
          movies: [
            {title: 'Pulp Fiction', genre: genres.CRIME},
            {title: 'Home Alone', genre: genres.COMEDY},
            {title: 'Barbarians at the Gate', genre: genres.DRAMA}
          ]
        };
      },
      props: ['genre', 'time'],
      methods: {
        moviePassesGenreFilter(movie) {
          if(!this.genre.length) {
            return true;  // no filter, show all movies
          } else {
            return this.genre.find(genre => movie.genre === genre);
          }
        }
      },
      computed: {
        filteredMovies() {
          return this.movies.filter(this.moviePassesGenreFilter);
        }
      }
    },
    'movie-filter': {
      data() {
        return {
          genres
        };
      },
      template: `<div id="movie-filter">
                    <h2>Filter Results</h2>
                    <div class="filter-group">
                      <check-filter v-for="genre in genres" v-bind:title="genre" v-on:check-filter="checkFilter"></check-filter>
                    </div>
                 </div>`,
      methods: {
        checkFilter(category, title, checked) {
          // pass it up the chain to it's parent
         this.$emit('check-filter', category, title, checked);
        }
      },
      components: {
        'check-filter': {
          data() {
            return {
              checked: false
            }
          },
          props: ['title'],
          template: `<div v-bind:class="{'check-filter': true, active: checked}" v-on:click="checkFilter">
                      <span class="checkbox"></span>
                      <span class="check-filter-title">{{title}}</span>
                    </div>`,
          methods: {
            checkFilter() {
              this.checked = !this.checked;
              // can pass mulitple parms - first must be name
              // follow with category (genre), the genre name and checked state
              // this is emitted to it's parent component
              this.$emit('check-filter', 'genre', this.title, this.checked);
            }
          }
        }
      }
    }
  }
});
