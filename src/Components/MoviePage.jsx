import React,{Component} from "react"
import {getMovies} from "../temp/movieService"


export default class MoviePage extends Component{
    state={
        movies:getMovies(),
        currSearchText:"",
        filterMovie:getMovies()
    }

    deleteEntry=(id)=>{
        let filterMovie=this.state.movies.filter((movieObj)=>{
            return movieObj._id!=id;
        })
        this.setState({
            movies:filterMovie
        })
    }

    setCurrentText=(e)=>{
        let task=e.target.value;
        let filterMovieArr=this.state.movies.filter((movieObj)=>{
            let title=movieObj.title.trim().toLowerCase();
            return title.includes(task);
        })

        if(task==""){
            filterMovieArr=this.state.movies
        }

        this.setState({
            currSearchText:task,
            filterMovie:filterMovieArr
        })
    }

    render(){
        // console.log(this.state.movies);
        let {movies,currSearchText,filterMovie}=this.state;
        return(
            
            <div className="row">
                <div className="col-3"></div>
                <div className="col-9">
                    <input type="search" value={currSearchText} onChange={this.setCurrentText} />
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="row">Title</th>
                                <th scope="row">Gener</th>
                                <th scope="row">Stock</th>
                                <th scope="row">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filterMovie.map((movieObj)=>{
                                return(
                                    <tr scope="row" key={movieObj._id}>
                                        <td>{movieObj.title}</td>
                                        <td>{movieObj.genre.name}</td>
                                        <td>{movieObj.numberInStock}</td>
                                        <td>{movieObj.dailyRentalRate}</td>
                                        <td><button type="button" className="btn btn-danger" 
                                        onClick={()=>{
                                           this.deleteEntry(movieObj._id);
                                        }}>Delete</button></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}