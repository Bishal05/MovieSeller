import React, { Component } from 'react'
import './App.css';
import MoviePage from "./Components/MoviePage"
import {Route,Switch} from "react-router-dom"
import New from './Components/New';
import NavBar from './Components/NavBar';
export default class App extends Component {
  state={
    movies:[]
  }

  deleteEntry=(id)=>{
    let filterMovie=this.state.movies.filter((movieObj)=>{
        return movieObj._id!=id;
    })
    this.setState({
        movies:filterMovie
    })
  }

  addMovie=(obj)=>{

    let {title,genre,stock,rate}=obj;

    let generObj=[{ _id: "5b21ca3eeb7f6fbccd471818", name: "Action" },
    { _id: "5b21ca3eeb7f6fbccd471820", name: "Thriller" },
    { _id: "5b21ca3eeb7f6fbccd471814", name: "Comedy" }]

    for(let i=0;i<generObj.length;i++){
      if(generObj[i].name==genre){
        genre=generObj[i];
      }
    }

    let movieObj={
      _id:Date.now(),
      title,
      genre,
      dailyRentalRate:rate,
      numberInStock:stock
    }
    let copyOfMovies=[...this.state.movies,movieObj];

    this.setState({
      movies:copyOfMovies
    })
  }
  async componentDidMount() {
    // console.log(2);
    let resp = await fetch("https://react-backend101.herokuapp.com/movies");
    let jsonMovies = await resp.json();
    this.setState({
        movies: jsonMovies.movies
    });
  }

  render() {
    return (
      <>
        <NavBar></NavBar>
        <Switch>
          <Route path="/new" render={
            (props)=>{
            return(<New {...props} addMovie={this.addMovie}></New>
            )
          }}></Route>
          <Route path="/" exact render={(props)=>{
            return(<MoviePage {...props} movies={this.state.movies} deleteEntry={this.deleteEntry}></MoviePage>
            )
          }}></Route>
        </Switch>
        </>    
    )
  }
}

