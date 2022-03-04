import Header from './Header'
import Instruction from './Instruction'
import Question from './Question'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

import XMLData from './xml/mc.xml'
import './mcstyle.css'

/*
Need Updates:
  <br /> TAG
  <br /> Tag parsing has a problem in displaying questions

  <images/ >
  image tag could not be displayed

  Have to implement Last page after complete all questions
  //review correct answer => display all correct answer

  Additional features
    1. Transition from feedback block:none to block:display
    2. hide feedback (correct/ uncorrect) in chrome dev tools
    3. (For self entertainment) Save individual's score to database
*/

const App = () => {

  const [questionsList, setQuestionsList] = useState([])
  const [questionNum, setQuestionNum] = useState(-1) //0 to total no. of question-1, 0 is the first question
  const [answersList, setAnswersList] = useState([])
  const [selectedAnswer, setSelectedAnswer] = useState(-1)
  const [correct, setCorrect] = useState(null)
  const [pressSubmit, setPressSubmit] = useState(0) // = 1 when submit button is press, use to show message when press submit but no answer is selected

  const resetSelected = () => {
    setCorrect(null)
    setSelectedAnswer(-1)
    setPressSubmit(0)
  }

  const goToNextQuestion = () => {
    setQuestionNum(questionNum + 1)
    setCorrect(null)
    setSelectedAnswer(-1)
    setPressSubmit(0)
  }

  const goToPrevQuestion = () => {
    setQuestionNum(questionNum - 1)
    setCorrect(null)
    setSelectedAnswer(-1)
    setPressSubmit(0)
  }

  const selectAnswer = (answer) => {
    setSelectedAnswer(answer)
    setPressSubmit(0)
  }

  useEffect(() => {
    axios.get(XMLData, { "Content-Type": "application/xml; charset=utf-8" }).then((response) => {
      const parser = new DOMParser()
      var xml = parser.parseFromString(response.data,"text/xml")
      var questionsList = Array.from(xml.getElementsByTagName("question"))
      //shuffle elements in an array
      const shuffle = (array) => {
        var currentIndex = array.length, randomIndex;
        // While there remain elements to shuffle...
        while (currentIndex != 0) {
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
          // And swap it with the current element.
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
        return array;
      }
      var answersList = []
      for (var i = 0; i < questionsList.length; i++) {
        var answers = Array.from(questionsList[i].getElementsByTagName("answer"))
        if (questionsList[i].getAttribute("randomanswer").localeCompare("true") == 0) {
          shuffle(answers)
        }
        answersList.push(answers)
      }
      setQuestionsList(questionsList)
      setAnswersList(answersList)
    }).catch(e => { console.log(e) })
  })

  return (
    <div className="App">
      <Header />
      <div id="wrapper" data-role="content">
        <Instruction
          questionNum={questionNum}
          goToNextQuestion={goToNextQuestion} />
        <Question
          questionNum={questionNum}
          questionsList={questionsList}
          choices={answersList[questionNum]}
          totalQuestions={answersList.length}
          selectedAnswer={selectedAnswer}
          correct={correct}
          pressSubmit={pressSubmit}

          goToNextQuestion={goToNextQuestion}
          goToPrevQuestion={goToPrevQuestion}
          selectAnswer={selectAnswer}
          setCorrect={setCorrect}
          setPressSubmit={setPressSubmit}
          resetSelected={resetSelected}
        />
      </div>
    </div>
  )
}

export default App;
