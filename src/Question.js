import React, { useState } from "react"
import Buttons from "./Buttons"

//contain question text
const QuestionText = ({props}) => {
    const showQuestionText = () => {
        const text = props.questionsList[props.questionNum].getElementsByTagName("questiontext")[0].childNodes[0].textContent
        var br = "<br/ >";
        // console.log(text.split(regex))
        const textArr = text.split(br)
        return textArr.map((line, index) => {
            if( index != textArr.length-1 ) return  (<> {line} <br key={"key_" + index} /> </>)
            else return (<>{line}</>)
        })

    }

    const showImage = () => {
        const imgArr = props.questionsList[props.questionNum].getElementsByTagName("questiontext")[0].getElementsByTagName("image")
        if( imgArr.length == 1 ) return <img src={imgArr[0].textContent}/>
        else return <></>
    }

    if( props.questionNum != -1 ){ //-1 is start menu
        return (<>
            <p className="question-number">Question {props.questionNum + 1} out of {props.totalQuestions}</p>
            {/* {console.log(props.questionsList[props.questionNum].childNodes[1])} */}
            <p className="question">{showQuestionText()}</p>
            {showImage()}
        </>)

    } else { return <></> }
}

//display choices
const ChoiceList = ({props}) => {
    // console.log( props.choices )

    const ChoicesJSX = props.choices.map( (choice, index) => {
        // console.log(props.selectedAnswer)
        console.log(props.correctAnswer)
        return(
            <>
                <div className="ui-radio">
                <label
                    htmlFor={"answer-"+index}
                    className={
                        "hovereffect ui-btn ui-corner-all ui-btn-inherit ui-btn-icon-left "+
                        ((props.startReview == 1)? ((index==props.correctAnswer)? "ui-radio-on":"ui-radio-off") : ((index==props.selectedAnswer)? "ui-radio-on":"ui-radio-off"))
                    }
                        >
                {choice.childNodes[1].textContent}
                </label>
                <input
                    type="radio"
                    name={"answer-"+props.questionNum}
                    index={index}
                    id={"answer-"+index}
                    value={choice.childNodes[1].textContent}/>
                </div>
                <p
                    className="feedback"
                    id={"feedback-"+index}
                    style={{display: ( (props.selectedAnswer == index) && (props.correct != null )) ? "block" : "none"}}>
                {choice.childNodes[3].textContent}
                </p>
            </>)
    })

    return(
        <form className="mc cf" 
            onClick={(event) => {
                props.setCorrect(null)
                props.setSelectedAnswer(event.target.getAttribute("index"))}
            }
            >
        {ChoicesJSX}
        </form>
    )
}

const Messages = ({props}) => {
    // console.log(props.selectedAnswer)
    const Message = (props.pressSubmit == 1 && props.selectedAnswer == -1)? "Please answer the above question." : ""

    return (<p className="messages">{Message}</p>)
}

const Question = ({props}) => {
    console.log(props.questionNum)
    if( props.questionNum != - 1 && props.questionNum != props.questionsList.length ){
        return(<>
            <section className="question cf">
                <QuestionText props={props} />
                <ChoiceList props={{...props,
                correctAnswer:props.choices.map( ( choice, _ ) => { return( choice.getAttribute("fraction") == 1 )}).indexOf(true) }}/>
                <Messages props = {props}/>
            </section>

            <Buttons props={{...props,
                correctAnswer:props.choices.map( ( choice, _ ) => { return( choice.getAttribute("fraction") == 1 )}).indexOf(true) }} />
        </>)
    }else if( props.questionNum == props.questionsList.length ){
        return(<>
            <section className="question cf">
                <p className="instruction">This is the end of the exercise. Thank you!
                <br/> <br/> Close the window to go back to the course.</p>
            </section>
            <Buttons props={props} />
        </>)
    }else { return(<></>)}
}

export default Question