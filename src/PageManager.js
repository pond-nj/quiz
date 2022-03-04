import Instruction from "./Instruction"
import Question from "./Question"

const PageManager = (props) => {
    return(<>
        <Instruction props={props}/>
        <Question props={props}/>
    </>)
}

export default PageManager