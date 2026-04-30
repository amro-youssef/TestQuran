import "./Circle.css";

export default function Circle({number=null, colour="green", handleClick=()=>{}, active=false}) {
    return (
        <button onClick={handleClick} className={active ? "circle highlighted" : "circle"}  style={{backgroundColor: colour}}>
            {number ? <>{number}</> : <></>}
        </button>
    )
}