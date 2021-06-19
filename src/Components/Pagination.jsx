import React,{Component} from "react"
// pageNumberArr
// pageNo
// function->showMovie

export default class Pagination extends Component{
    render(){
        let {numberOfPages,pageNo,showMovies}=this.props;
        let pageNumberArr=[];
        for(let i=0;i<numberOfPages;i++){
            pageNumberArr.push(i+1);
        }
        return(
            <nav  aria-label="..." className="col-2" >
                <ul className="pagination">
                    {
                        pageNumberArr.map((pageNumber)=>{
                            let additional = pageNumber == pageNo ? "page-item active" : "page-item";
                            return(
                                <li className={additional} aria-current="page" onClick={()=>{showMovies(pageNumber)}}>
                                    <span className="page-link" >{pageNumber}</span>
                                    {/* this.showMovies(pageNumber) we are doing this so that which ever page we are clicking only those movies according to limit should be shown on ui  */}
                                </li>
                            )
                        })
                    }
                </ul>
            </nav>
        )
    }   
}