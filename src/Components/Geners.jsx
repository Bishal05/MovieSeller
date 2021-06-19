import React,{Component} from "react"
//geners
//function ->filterMovieAccToGener(generObj.name)
//currentGener
export default class Geners extends Component {
    render() {
        let {genres,currentGener,filterMovieAccToGener}=this.props
        return (
            <ul className="list-group">
                {
                    genres.map((generObj)=>{
                        let activeGener=(generObj==currentGener ? "list-group-item active" : "list-group-item")
                        return(
                            <li className={activeGener} key={generObj.id} onClick={()=>{filterMovieAccToGener(generObj.name)}}>{generObj.name}</li>
                        )
                    })
                }
            </ul>
        )
    }
}