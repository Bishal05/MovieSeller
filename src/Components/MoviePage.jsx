import React,{Component} from "react"
import {getMovies} from "../temp/movieService"


export default class MoviePage extends Component{
    state={
        movies:getMovies(),
        genres: [{ id: 1, name: "All Genres" }],
        currSearchText:"",
        pageNo:1,
        limit:4,
        currentGener:"All Genres"
        // filterMovie:getMovies() source of the input should be only one
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
        let {movies}=this.state;

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

        this.setState({
            movies:sortedMovie
        })
    }

    sortByPrice=(e)=>{
        let className=e.target.className.trim();
        let sortedMovie;
        let {movies}=this.state;

        if(className=="fas fa-sort-up"){
            sortedMovie=movies.sort((movieObjA,movieObjB)=>{
                return movieObjA.dailyRentalRate-movieObjB.dailyRentalRate;
            });
        }else{
            sortedMovie=movies.sort((movieObjA,movieObjB)=>{
                return movieObjB.dailyRentalRate-movieObjA.dailyRentalRate;
            });
        }

        this.setState({
            movies:sortedMovie
        })
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
        let resp = await fetch("https://react-backend101.herokuapp.com/movies");
        let jsonMovies = await resp.json();
        this.setState({
            movies: jsonMovies.movies
        });
        resp = await fetch("https://react-backend101.herokuapp.com/genres");
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
        let {movies,currSearchText,pageNo,limit,genres,currentGener}=this.state;
        // rather adding a new State we did everything here because whenever our state changes because of input(search) our render function will be called again
        // and we will print the changes in the filterMovieArr
        
        let filterMovieArr=movies;
        
        if(currentGener!="All Genres"){
            filterMovieArr=filterMovieArr.filter((movieObj)=>{
                return movieObj.genre.name==currentGener;
            })
        }
        
        if(currSearchText!=""){
            filterMovieArr=filterMovieArr.filter((movieObj)=>{
                let title=movieObj.title.trim().toLowerCase();
                return title.includes(currSearchText.toLowerCase());
            })
        }

        let numberOfPages=Math.ceil(filterMovieArr.length/limit);
        let pageNumberArr=[];
        for(let i=0;i<numberOfPages;i++){
            pageNumberArr.push(i+1);
        }

        let si=(pageNo-1)*limit;
        let ei=si+limit
        filterMovieArr=movies.slice(si,ei);

        // filterMovieArr=filterMovieArr.filter((movieObj)=>{
        //     return movieObj.genre.name==currentGener;
        // })

        // if(filterMovieArr.length==0){
        //     filterMovieArr= movies;
        // }

        return(
            
            <div className="row">
                <div className="col-3">
                    <ul className="list-group">
                        {
                            genres.map((generObj)=>{
                                let activeGener=(generObj==currentGener ? "list-group-item active" : "list-group-item")
                                return(
                                    <li className={activeGener} key={generObj.id} onClick={()=>{this.filterMovieAccToGener(generObj.name)}}>{generObj.name}</li>
                                )
                            })
                        }
                    </ul>
                </div>
                <div className="col-9">
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
                            {filterMovieArr.map((movieObj)=>{
                                return(
                                    <tr scope="row" key={movieObj._id}>
                                        <td >{movieObj.title}</td>
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
                    <nav  aria-label="..." className="col-2" >
                        <ul className="pagination">
                            {
                                pageNumberArr.map((pageNumber)=>{
                                    let additional = pageNumber == pageNo ? "page-item active" : "page-item";
                                    return(
                                        <li className={additional} aria-current="page" onClick={()=>{this.showMovies(pageNumber)}}>
                                            <span className="page-link" >{pageNumber}</span>
                                            {/* this.showMovies(pageNumber) we are doing this so that which ever page we are clicking only those movies according to limit should be shown on ui  */}
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </nav>
                </div>
            </div>
        )
    }
}