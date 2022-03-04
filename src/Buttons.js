
const Previous = ({props}) => {
    return(<button
            name="control"
            className="controlBtn ui-btn-right ui-btn ui-btn-b ui-btn-inline ui-mini ui-corner-all"
            id="controlBtn-prev"
            value="prev"
            onClick={props.goToPrevQuestion}>
            Previous
        </button>
    )}

const Next = ({props}) => {
    return(<button
            name="control"
            className="controlBtn ui-btn-right ui-btn ui-btn-b ui-btn-inline ui-corner-all ui-mini"
            id="controlBtn-next"
            value="next"
            onClick={ () => {
                if(props.correct){ props.goToNextQuestion()
                }else { console.log("wrong answer!") }
            }}>
            Next
        </button>
    )}

const Submit = ({props}) => {
    return(<button
            name="control"
            className="controlBtn cf ui-btn-right ui-btn ui-btn-b ui-btn-inline ui-corner-all ui-mini"
            id="controlBtn-submit"
            value="submit"
            onClick={() => {
                props.setSubmit(1)
                console.log("he")
                console.log(props.correctAnswer)
                if( props.selectedAnswer == props.correctAnswer ){ props.setCorrect(true) }
                else { props.setCorrect(false) }}
            }>
            Submit
        </button>
    )}

const Retry = ({props}) => {
    return(<button name="control"
            className="controlBtn ui-btn-right ui-btn ui-btn-b ui-btn-inline ui-corner-all ui-mini"
            id="controlBtn-retry"
            value="retry"
            onClick={props.resetSelected}
            >
            Retry
        </button>
    )}

//For Debugging
const Log = ({props}) => {
    return(<button name="control"
            className="controlBtn ui-btn-right ui-btn ui-btn-b ui-btn-inline ui-corner-all ui-mini"
            onClick={()=>{
                console.log( props)
                console.log( props.selectedAnswer )
                console.log( props.questionsList )
            }}
            >Log</button>
        )}

const ReviewCorrectAnswer = ({props}) => {
    return(<button name="control"
            className="controlBtn ui-btn-right ui-btn ui-btn-b ui-btn-inline ui-corner-all ui-mini"
            onClick={()=>{
                props.setStartReview(1)
                props.goToQuestion(0)
            }}
            >Review Correct Answer</button>
        )}

const NextReview = ({props}) => {
    return(<button name="control"
    className="controlBtn ui-btn-right ui-btn ui-btn-b ui-btn-inline ui-corner-all ui-mini"
    onClick={()=>{
        props.goToQuestion(props.questionNum+1)
    }}
    >{"Next>>"}</button>
    )}




const Buttons = ({props}) => {
    //console.log( props )

    const showButton = () => {
        if( props.questionNum < props.questionsList.length && props.startReview == -1 ){
            if(props.correct){ return <Next props={props} />
            } else if( props.correct == false && props.selectedAnswer != - 1){ return <Retry props={props}/>
            } else { return <Submit props={props}/> }
        } else if (props.questionNum == props.questionsList.length ){
            return <ReviewCorrectAnswer props={props}/>
        } else if (props.startReview == 1){
            return <NextReview props={props}/>
        }
    }
    
    return(
        <div
            id="footer"
            data-role="footer"
            className="cf ui-footer ui-bar-inherit"
            role="contentinfo">

			{showButton()}
            
            {/*
            For Debugging
            <Log props={props}/>*
            <Previous props={props}/>
            */}

            {/*
            <button
                name="control"
                className="controlBtn ui-btn-right ui-btn ui-btn-b ui-btn-inline ui-mini ui-corner-all ui-btn-icon-right"
                id="controlBtn-review"
                value="review">
                Review Correct Answer
            </button>
            */}

            {/*
			<button
                name="control"
                className="controlBtn ui-btn-right ui-btn ui-btn-b ui-btn-inline ui-mini ui-corner-all ui-btn-icon-right"
                id="controlBtn-close"
                value="close">
                Close
            </button>*/}


            {/*
			<button
                name="control"
                className="controlBtn ui-btn-right ui-btn ui-btn-b ui-btn-inline ui-mini ui-corner-all ui-btn-icon-right"
                id="controlBtn-send-result"
                value="send-result">
                Send result
            </button>*/}

            {/*
			<button
                name="control"
                className="controlBtn ui-btn-right ui-btn ui-btn-b ui-btn-inline ui-mini ui-corner-all ui-btn-icon-right"
                id="controlBtn-finish"
                value="finish">
                Finish
            </button> */}

            {/*
			<button
                name="control"
                className="controlBtn ui-btn-right ui-btn ui-btn-b ui-btn-inline ui-mini ui-corner-all ui-btn-icon-right"
                id="controlBtn-redo"
                value="redo">
                Redo
            </button> */}

            {/*
			<button
                name="control"
                className="controlBtn ui-btn-right ui-btn ui-btn-b ui-btn-inline ui-mini ui-corner-all ui-btn-icon-right"
                id="controlBtn-retry"
                value="retry">
            Retry</button>
            */}
        </div>
    )
}

export default Buttons