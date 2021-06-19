import React,{Component} from "react"
import {getMovies} from "../temp/movieService"
import Geners from "./Geners"
import Pagination from "./Pagination"
import {Link} from "react-router-dom"


export default class MoviePage extends Component{
    state={
        genres: [{ id: 1, name: "All Genres" }],
        currSearchText:"",
        pageNo:1,
        limit:4,
        currentGener:"All Genres"
        // filterMovie:getMovies() source of the input should be only one
    }

    setCurrentText=(e)=>{
        let task=e.target.value;

        // We cannot create state for everything
        // let filterMovieArr=this.state.movies.filter((movieObj)=>{
        //     let title=movieObj.title.trim().toLowerCase();
        //     return title.includes(task);
        // })

        // if(task==""){
        //     filterMovieArr=this.state.movies
        // }

        this.setState({
            currSearchText:task,
        })
    }

    sortByStock=(e)=>{
        let className=e.target.className.trim();
        let sortedMovie;
        let {movies}=this.props;

        if(className=="fas fa-sort-up"){
            sortedMovie=movies.sort((movieObjA,movieObjB)=>{
                return movieObjA.numberInStock-movieObjB.numberInStock;
            })
        }else
        {
            sortedMovie=movies.sort((movieObjA,movieObjB)=>{
                return movieObjB.numberInStock-movieObjA.numberInStock;
            })
        }

    }

    sortByPrice=(e)=>{
        let className=e.target.className.trim();
        let sortedMovie;
        let {movies}=this.props;

        if(className=="fas fa-sort-up"){
            sortedMovie=movies.sort((movieObjA,movieObjB)=>{
                return movieObjA.dailyRentalRate-movieObjB.dailyRentalRate;
            });
        }else{
            sortedMovie=movies.sort((movieObjA,movieObjB)=>{
                return movieObjB.dailyRentalRate-movieObjA.dailyRentalRate;
            });
        }
    }

    setPageNo=(e)=>{
        let pageNo=e.target.value;
        this.setState({
            pageNo:pageNo
        })
    }

    setLimit=(e)=>{
        let currentLimit=e.target.value;

        this.setState({
            limit:currentLimit
        })
    }

    showMovies=(pageNumber)=>{

        this.setState({
            pageNo:pageNumber
        })


    }

    async componentDidMount() {
        // console.log(2);
        let resp = await fetch("https://react-backend101.herokuapp.com/genres");
        let jsonGenres = await resp.json();
        this.setState({
            genres: [...this.state.genres, ...jsonGenres.genres]
        });
    }

    filterMovieAccToGener=(generName)=>{
        this.setState({
            currentGener:generName
        })
    }

    render(){
        // console.log(this.state.movies);
        let {currSearchText,pageNo,limit,genres,currentGener}=this.state;
        
        let {movies,deleteEntry}=this.props
        // rather adding a new State we did everything here because whenever our state changes because of input(search) our render function will be called again
        // and we will print the changes in the filterMovieArr
        
        let filterMovieArr=movies;
        // console.log(filterMovieArr);
        if(currentGener!="All Genres"){
            filterMovieArr=filterMovieArr.filter((movieObj)=>{
                return movieObj.genre.name==currentGener;
            })
            console.log(filterMovieArr,"genre");
        }
        
        if(currSearchText!=""){
            filterMovieArr=filterMovieArr.filter((movieObj)=>{
                let title=movieObj.title.trim().toLowerCase();
                return title.includes(currSearchText.toLowerCase());
            })
            console.log(filterMovieArr,"search");
        }
        
        let numberOfPages=Math.ceil(filterMovieArr.length/limit);

        let si=(pageNo-1)*limit;
        let ei=si+limit
        filterMovieArr=movies.slice(si,ei);
        console.log(filterMovieArr);

        // filterMovieArr=filterMovieArr.filter((movieObj)=>{
        //     return movieObj.genre.name==currentGener;
        // })

        // if(filterMovieArr.length==0){
        //     filterMovieArr= movies;
        // }

        return(
            
            <div className="row">
                <div className="col-3">
                    <Geners genres={genres} currentGener={currentGener} filterMovieAccToGener={this.filterMovieAccToGener}></Geners>
                </div>
                <div className="col-9">
                    <button className="btn btn-primary">
                        <Link to="/new" className="text-light" >New </Link>
                    </button><br /><br />

                    <input type="search" value={currSearchText} onChange={this.setCurrentText} />
                    <input type="Number" className="col-1" placeholder="limit" value={limit} onChange={this.setLimit} />
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Title</th>
                                <th scope="col">Gener</th>
                                <th scope="col">
                                    <i className="fas fa-sort-up" onClick={this.sortByStock}></i>
                                    Stock
                                    <i className="fas fa-sort-down" onClick={this.sortByStock}></i>
                                    </th>
                                <th scope="col">
                                    <i className="fas fa-sort-up" onClick={this.sortByPrice}></i>
                                    Price
                                    <i className="fas fa-sort-down" onClick={this.sortByPrice}></i>
                                    </th>
                            </tr>
                        </thead>
                        <tbody>
                            
                            {
                            filterMovieArr.map((movieObj)=>{
                                return(
                                    <tr scope="row" key={movieObj._id}>
                                        <td >{movieObj.title}</td>
                                        <td>{movieObj.genre.name}</td>
                                        <td>{movieObj.numberInStock}</td>
                                        <td>{movieObj.dailyRentalRate}</td>
                                        <td><button type="button" className="btn btn-danger" 
                                        onClick={()=>{
                                           deleteEntry(movieObj._id);
                                        }}>Delete</button></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    <Pagination numberOfPages={numberOfPages} showMovies={this.showMovies} pageNo={pageNo}></Pagination>
                </div>
            </div>
        )
    }
}








