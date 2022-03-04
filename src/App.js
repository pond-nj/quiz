import Header from './Header'
import React from 'react'
import axios from 'axios'

import XMLData from './xml/mc.xml'
import './mcstyle.css'
import PageManager from './PageManager'

/*
Need Updates:
  Cannot click choice yet if reply button has not been pressed

  Have to implement Last page after complete all questions
  //review correct answer => display all correct answer

  Additional features
    1. Transition from feedback block:none to block:display
    2. hide feedback (correct/ uncorrect) in chrome dev tools
    3. (For self entertainment) Save individual's score to database
*/

class App extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      questionsList: [],
      questionNum: -1, //0 to total no. of question-1, 0 is the first question
      answersList: [],
      selectedAnswer: -1,
      correct: null,
      pressSubmit: 0, // = 1 when submit button is press, use to show message when press submit but no answer is selected
      startReview: -1 // = 1 when all questions are answered
    }
  }

  setSubmit = (state) => { this.setState({
      pressSubmit: state
    })}

  setStartReview = (state) => { this.setState({
    startReview: state
    })}

  resetSelected = () => { this.setState({
      correct: null,
      selectedAnswer: -1,
      pressSubmit: 0
    })}

  goToQuestion = (num) => {this.setState({
    questionNum: num
  })}

  goToNextQuestion = () => { this.setState({
      questionNum : this.state.questionNum + 1,
      correct: null,
      selectedAnswer: -1,
      pressSubmit: 0
    })}

  goToPrevQuestion = () => { this.setState({
      questionNum : this.state.questionNum - 1, 
      correct: null,
      selectedAnswer: -1,
      pressSubmit: 0
    })}


  setCorrect = (state) => { this.setState({
      correct: state
    })}

  setSelectedAnswer = (answer) => { this.setState({
      selectedAnswer: answer,
      pressSubmit: 0
    })}

  componentDidMount(){
    this.fetchQuestionsWithAxios()
  }

  fetchQuestionsWithAxios(){
    axios.get(XMLData,
      {"Content-Type":"application/xml; charset=utf-8"
    }).then((response)=>{
      console.log(response.data)
      const parser = new DOMParser()
      var xml = parser.parseFromString(response.data,"text/xml")
    
      var questionsList = Array.from(xml.getElementsByTagName("question"))
      console.log(questionsList[3].getElementsByTagName("questiontext")[0].childNodes[0].textContent)

      //shuffle elements in an array
      const shuffle = (array) => {
        var currentIndex = array.length,  randomIndex;
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
      for( var i = 0 ; i < questionsList.length ; i++ ){
        var answers = Array.from( questionsList[i].getElementsByTagName("answer") )
        if( questionsList[i].getAttribute("randomanswer").localeCompare("true") == 0 ){
          shuffle( answers )
        }
        // console.log( answers )
        answersList.push( answers )
      }

      this.setState({
          questionsList: questionsList,
          answersList: answersList,
      })
    }).catch( e => {
      console.log(e)
    })
  }

  render(){

    return (
      <div className="App">
        <Header/>
        <div id ="wrapper" data-role="content">
          <PageManager
            questionNum={this.state.questionNum}
            questionsList={this.state.questionsList}
            choices = {this.state.answersList[this.state.questionNum]}
            totalQuestions={this.state.answersList.length}
            selectedAnswer={this.state.selectedAnswer}
            correct={this.state.correct}
            pressSubmit={this.state.pressSubmit}
            startReview={this.state.startReview}

            goToNextQuestion={this.goToNextQuestion}
            goToPrevQuestion={this.goToPrevQuestion}
            goToQuestion={this.goToQuestion}
            setSelectedAnswer={this.setSelectedAnswer}
            setCorrect={this.setCorrect}
            setSubmit={this.setSubmit}
            resetSelected={this.resetSelected}
            setStartReview={this.setStartReview}
          />
        </div>
      </div>
    )
  }
}

export default App;
