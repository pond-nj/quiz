// Global variables
var $xml, questionNum = 1, maxQuestionNum, drawedQuestions, numOfChoices;
var questionSeq = []; // question sequence
var questionptr = -1; // pointer of questionSeq[]
var answerSeq = [];
var branch = false;
var review = false;	// review mode
// after html, type ?a=xml/ var then can get the value 
var fadeInSpeed = 400;	//ms
// Messages
var farewellMsg = 'This is the end of the exercise. Thank you! \<br\> \<br\> Close the window to go back to the course.';
var defaultFeedback = '';
var readyMsg = 'Please press \"start\" to begin.';
var reviewMsg = 'The exericise is completed. You are reviewing your answer only.';

// Email result
var subject = '[OGE Questions Bank][Testing]';		
var receipent = 'eva@cuhk';

$(document).ready(function() {
	var url_string = window.location.href;
	var url = new URL(url_string);
	var c = url.searchParams.get("xmlfile");
	console.log(c);
	xmlfile = c;
	//var xmlfile = 

	console.log(xmlfile);

	$('.hover').bind('touchstart touchend', function(e) {
        e.preventDefault();
        $(this).toggleClass('hover_effect');
    });

	// Load the xml file using ajax
	$.ajax({
		type: "GET",
		url: xmlfile,
		dataType: "xml",
		success: function (xml) {
			// Parse the xml file and get data
			$xml = $(xml);			
			
			// Initialse variables
			var random = ($xml.find('questions').attr('randomquestion') === "true");
			var version = parseFloat($xml.find('questions').attr('version')).toFixed(2) || 0;
			branch = ($xml.find('questions').attr('branch') === "true");
			maxQuestionNum = $xml.find("question").size();	//***TO-DO: check whether these nodes exist
			console.log( maxQuestionNum )
			numOfAllChoices = $xml.find("answer").size();
			/*if(numOfChoices !== parseInt(numOfChoices)){
				console.log('[DEBUG] Incorrect number of choices');
				alert('Incorrect number of choices in xml');
			}*/
		  numOfChoices = 4;
			// Generate question sequence
			for(i = 1; i <= maxQuestionNum; i++){
				questionSeq.push(i);
			}
			
			// Check whether there is question branching
			if(branch == true){
				random = false;
				drawedQuestions = maxQuestionNum;
				console.log('[DEBUG] Branching questions');
			} else {
				drawedQuestions = parseInt($xml.find('questions').attr('number')) || 1;
			}
			
			// Generate random question sequence
			if(random == true){				
				for( i = maxQuestionNum-1; i > 0; i--){
					var j = Math.floor(Math.random() * (maxQuestionNum-1 - 0 + 1)) + 0;
					var tmp = questionSeq[i];
					questionSeq[i] = questionSeq[j];
					questionSeq[j] = tmp;
				}
				console.log('[DEBUG] Random question sequenece');
			}
			
			questionSeq = questionSeq.slice(0, drawedQuestions);
			console.log('[DEBUG] questionSeq: ' + questionSeq + '; drawed: ' + drawedQuestions);
			
			initializeInstruction();
			//initializeMcForm();
			
		},
		error: function(){
			console.log("[DEBUG] ajax error");
			$("section.instruction p.status").fadeIn().html('Error: Cannot get questions. Please inform the author.');
		}
	});

	/* Called when a control button is clicked */
	$("button.controlBtn").click(function(e){
		e.preventDefault();
		if($(this).attr("value") == 'next'){
			if(review){
				showReview("questions");
			} else {
				if(branch){
					nextBranchQuestion();
				} else {
					nextQuestion(1);
				}
			}			
		/*} else if ($(this).attr("value") == 'prev'){
			if(branch == false){
				nextQuestion(0);
			}*/
		} else if ($(this).attr("value") == 'submit'){
			if(branch == false){
				checkAns();
			}
			showFeedback();
		} else if ($(this).attr("value") == 'finish'){
			if(branch == false && checkAns()){
				checkAllAns();
				endQuestions();
			} else if (branch == true){
				endBranchQuestions();
			}			
		} else if ($(this).attr("value") == 'close'){
			window.close();
		} else if ($(this).attr("value") == 'send-result'){
			sendResult();
		} else if ($(this).attr("value") == 'start'){
			initializeMcForm();
		} else if ($(this).attr("value") == 'review'){
			showReview("questions");
			//New added, retry button fuction
		} else if ($(this).attr("value") == 'retry'){
				nextQuestion(2);
		}
		else if ($(this).attr("value") == 'redo'){

			nextQuestion(2);
	}
		else {
			console.log('Error: Undefined action');
		}
	});	
	
	/* Initialize instruction */
	function initializeInstruction(){
		$("section.question").hide();
		$("section.instruction p.status").fadeIn().html(readyMsg);
		$("button#controlBtn-start").show();
	}
	
	/* Initialize MC form */
	function initializeMcForm(){
		// Clear local storage
		localStorage.clear();
		
		// Print instruction
		$("section.question p.instruction").fadeIn().html($xml.find("instruction").text());
		
		// Print question
		if(branch){			
			printQuestion(questionNum);
		} else {
			nextQuestion(1);
		}
		
		$("section.instruction").hide();
		$("section.question").show();
	}
	
	/* Disable MC form */
	function disableMcForm(){
		$('form.mc input:radio').attr('disabled', true);
		$(".ui-checkbox-off:after").css('opacity', 0);
		$(".ui-btn.ui-radio-off:after").css('opacity', 0);
		$("section.question form.mc label.hovereffect").removeClass('hovereffect');		
	}
	/* Enable MC form */
	function enableMcForm(){
		$('form.mc input:radio').attr('disabled', false);
		$("section.question form.mc label").addClass('hovereffect');
	}
	
	/* Store answer to local storage */
	/* And ask for answer if it is not provided */
	function storeAns(store, ptr){
		var ans = $("section.question input[name='question[" + questionNum + "]']:checked").val();
		ptr = parseInt(ptr);
		store = String(store);

		// Check the question is answered
		if(ans){		
			// Fetch previous answers from local storage
			var storage = JSON.parse(localStorage[store] || null);			
			if(storage == null){
				storage = new Array();
			}
			
			// Prepare to store answer
			storage[parseInt(ptr-1)] = ans;
			// Store answer into local storage
			localStorage[store] = JSON.stringify(storage);
			
			$("section.question form.mc").removeClass("required");
			$("section.question p.messages").html('');
			
			return ans;
		} else {
			// When the question is not answered
			$("section.question form.mc").removeClass("required");
			$("section.question p.messages").html('');
			$("section.question form.mc").addClass("required");
			$("section.question p.messages").html('Please answer the above question.');
		
			return false;
		}
	}
	/* Print question based on xml */
	/* It won't redraw UI for the last question */
	function printQuestion(questionNum){
 	// Reset form
            $("section.question input#answer-2").show();
         	$("section.question input#answer-3").show();
            $("section.question label[for='answer-2").show();
            $("section.question label[for='answer-3").show();
        	$("section.question input[type='radio']").prop('checked', false);
			$("section.question input[type='radio']").checkboxradio("refresh");
			$("section.question form.mc").removeClass("required");
			$("section.question img.questionImg").remove();	
			$("section.question form.mc div label").removeClass('correct');
			$("section.question form.mc div label").removeClass('incorrect');
			
			$('section.question p.feedback').hide();
			$("section.question p.messages").html('');
        
		questionNum = parseInt(questionNum);
		
		// Print the question
		$xml.find('question[number="' + questionNum + '"]').each(function(){
            						
			// Generate answer sequence
			answerSeq = [];
			for(i = 0; i < numOfChoices; i++){
				answerSeq.push(i);
			}
			var random = ($(this).attr('randomanswer') === "true");
			if(random == true){
				
				for(i = numOfChoices-1; i > 0; i--){
					var j = Math.floor(Math.random() * (numOfChoices-1 - 0 + 1)) + 0;
					var tmp = answerSeq[i];
					answerSeq[i] = answerSeq[j];
					answerSeq[j] = tmp;
				}
			}
			console.log('[DEBUG] answerSeq: ' + answerSeq + answerSeq.length);
			
            
			for(i = 0; i < numOfChoices; i++){
                	var answertext ='';
				$(this).children("answer").eq(answerSeq[i]).children("text").each(function(){
					var answertext = $(this).text();

					// Print choices             
					answertext = answertext.replace(/[\t\n]?/g, '');
                    	
					$("section.question input[type='radio']").attr( "name", "question["+ questionNum +"]");
					$("section.question input#answer-"+ i).attr( "value", answertext );
					$("section.question label[for='answer-"+ i +"']").html($(this).text());
            	
            if (answertext=='false'){
             
              	 $("section.question input#answer-2").hide();
         	      $("section.question input#answer-3").hide();
                $("section.question label[for='answer-2").hide();
                $("section.question label[for='answer-3").hide();
                     
            };
				});	
			}

			// Reset control buttons			
			$("button#controlBtn-send-result").hide();
			$("button#controlBtn-close").hide();
			$("button#controlBtn-next").hide();
			$("button#controlBtn-prev").hide();
			$("button#controlBtn-finish").hide();
			$("button#controlBtn-retry").hide();
			$("button#controlBtn-submit").show();
			
			// Animation
			$("section.question").css("opacity", 0);
			$("section.question").animate({opacity: 1}, fadeInSpeed);
			
			// Print text
			$("section.question p.question").fadeIn().html($(this).find("questiontext").text());
			// Print Images
			$(this).find("image").each(function(){
				var imgTag = "<img class=\"questionImg\" alt=\"Image of the question\" title=\"Image of the question\"";
				var close = ">";
				var src;
				
				if($(this).text() != ""){
					src = "src=\"" + $(this).text() + "\"";				
					$("section.question form.mc").before(imgTag + src + close);
				}
			});
			
			// Update question number shown
			if(branch == true){
				$("section.question p.question-number").html('Question ' + questionNum + ' out of ' + drawedQuestions);
			} else {
				$("section.question p.question-number").html('Question ' + (questionptr+1) + ' out of ' + drawedQuestions);
			}
			
			enableMcForm();
		});
	}
	var glob_corr =0;
	/* Check the current question */
	function checkAns(){
		var ans = storeAns("questions", questionNum);
		var radioButtons = $("section.question input[name='question[" + questionNum + "]']");
		var checkedNum = radioButtons.index(radioButtons.filter(':checked'));
		var correctNum = 0;
		var flag =0;
		if(ans){
			// When the question is answered
			var correct = 0;			
			
			disableMcForm();
			
			// Check answer for the question
			$xml.find('question[number="' + questionNum + '"]').each(function(){//Need refine: check whether an element is found
				$(this).find('answer').find('text').each(function(index){
					// Find out the correct answer from xml
					correct = $(this).parent().attr('fraction');
					correct = parseInt(correct);
					
					// Find out the position of the correct choice in the list of choices
					if(correct == 1){
						//correctNum = index+1;
						var answer = $(this).text();
						radioButtons.each(function(i){
							if(answer == $(this).val()){
								correctNum = i + 1;
							}
						});
					}
					
					// Check whether the answer is correct
					if($(this).text() == ans && correct == 1){
						$('section.question form.mc div label[for="answer-' + (correctNum-1) +'"]').addClass('correct');	
						$("section.question p.messages").html('Correct answer!');
						
						console.log('[DEBUG] The answer of question ' + questionNum + ' is correct.');
						return false;	// Break .each()
					}
				});	
				console.log('[DEBUG] checkedNum: ' + checkedNum + '; correctNum: ' + correctNum);
			
				// When the answer is wrong
				if(correct != 1){
					$('section.question form.mc div label[for="answer-' + checkedNum +'"]').addClass('incorrect');

					//deleted the label
							
				/*	$("section.question p.messages").html('Wrong answer.');*/
				//here set button? flag1
				}
				// Allow user to proceed
				//In the first condition, which is not the last question
				if(questionptr != drawedQuestions-1){
					// $("section.question p.messages").append(" ");
					// $("button#controlBtn-next").show();
					// $("button#controlBtn-submit").hide();
					// //added 
					// $("button#controlBtn-retry").show();
					glob_corr = correct;
					if(glob_corr == 1){
						console.log("retry last 3" + correct);

						$("section.question p.messages").append(" ");
						$("button#controlBtn-next").show();
						$("button#controlBtn-submit").hide();
					//added the retry button
						$("button#controlBtn-retry").hide();

					}else{	
						console.log("next last3" + correct);

						$("section.question p.messages").append(" ");
						$("button#controlBtn-next").hide();
						$("button#controlBtn-submit").hide();
					//added retry button
						$("button#controlBtn-retry").show();
					}
				}else{
					//condition for last questions

					glob_corr = correct;
					if(glob_corr == 1){
						console.log("retry last 3" + correct);
						$("section.question p.messages").append(" ");
						$("button#controlBtn-next").hide();
						$("button#controlBtn-submit").hide();
					//added retry button, shows the finish button after the answer is correct 
						$("button#controlBtn-retry").hide();
						$("button#controlBtn-finish").show();
					}else{	
						console.log("next last3" + correct);

						$("section.question p.messages").append(" ");
						$("button#controlBtn-next").hide();
						$("button#controlBtn-submit").hide();
					//added the retry buttom, retry button shows up for non-final question if the answer enter is incorrect.
						$("button#controlBtn-retry").show();
						$("button#controlBtn-finish").hide();
					}
				}
			});				
			return true;
		} 	
		return false;
	}
	/* Check all questions */
	function checkAllAns(){
		var score = 0, pointer = 0, correct = 0;
		var ans;
		var n = SCOGetValue("cmi.interactions._count") || 0;
		
		// Complete the test
		disableMcForm();
		SCOSetValue("cmi.core.lesson_status", "completed");		
		
		// Fetch previous answers from local storage
		var storage = JSON.parse(localStorage["questions"] || null);
		var results = new Array();
		if(storage != null){			
			// Get answers
			$xml.find('question').each(function(){
				ans = storage[pointer];
				SCOSetValue("cmi.interactions."+n+".type_interaction", "choice");
				SCOSetValue("cmi.interactions."+n+".id", 'Question'+(pointer+1));
				if(ans != null){
					SCOSetValue("cmi.interactions."+n+".student_response", ans);
				} else {
					SCOSetValue("cmi.interactions."+n+".student_response", 'Not drawed');
					storage[pointer] = 'Not drawed';
				}
				
				// Check answer
				$(this).find('answer').find('text').each(function(){
					correct = $(this).parent().attr('fraction');
					correct = parseInt(correct);
					if($(this).text() == ans && correct == 1){
						// Calculate score
						score++;
						SCOSetValue("cmi.interactions."+n+".result", "correct");
						results[pointer] = "correct";
						return false;	// Break .each()
					}
				});
				// When the answer is wrong
				if(correct != 1){
					SCOSetValue("cmi.interactions."+n+".result", "wrong");
					results[pointer] = "wrong";
				}
								
				// Move pointers
				pointer++;
				n++;
			});
			// Store answer into local storage
			localStorage["questions"] = JSON.stringify(storage);
			localStorage["results"] = JSON.stringify(results);
		}		
		
		$("button#controlBtn-finish").hide();
		// Send the score


		//removed since all answer must be correct!

        totalscore=score*10;
		SCOSetValue("cmi.core.score.raw", totalscore);	

		// alert("Your score is: " + totalscore +"/100");

        SCOFinish();


	}
	// 1 == ++
	// 0 = --
	// 2 == normal
	/* Find out the next/previous question */

	function nextQuestion(next){
		// Identify the command and move the pointer
		next = parseInt(next);		
		
		if(questionptr < drawedQuestions-1 && next == 1){
			questionptr++;

		} else if (	questionptr >= 0 && next == 0 ) {
			questionptr--;

		} else {
			//set back to its own ptr
			questionptr = questionptr; 
		}
		
		if(!questionSeq[questionptr]){
			return false;
		} else {
			questionNum = questionSeq[questionptr];
		}
		console.log('[DEBUG] questionSeq[questionptr]: ' + questionSeq[questionptr] + '; ptr:' + questionptr);
		
		// Print the question
		printQuestion(questionNum);
		
		// Redraw UI for the last question
		
		if(questionptr == drawedQuestions-1 && branch == false){
			$("button#controlBtn-next").hide();
			$("button#controlBtn-submit").show();
			$("button#controlBtn-finish").hide();			
		}		
		
		return true;
	}	
	/* Find out the next/previous branch question */
	function nextBranchQuestion(){	
		var ans = storeAns("questions", questionNum);
		var radioButtons = $("section.question input[name='question[" + questionNum + "]']");
		if(ans){		
			// Check answer for the question
			$xml.find('question[number="' + questionNum + '"]').each(function(){//Need refine: check whether an element is found
				$(this).find('answer').find('text').each(function(index){					
					// Find out the next question
					if($(this).text() == ans){					
						$("section.question p.messages").html('');
						// Get the number of next question
						var next = $(this).parent().attr('next') || null;						
						if(next != null){
							questionNum = parseInt(next);
						} else {
							questionNum++;
						}	
						return false;	// Break .each()
					}
				});	
				console.log('[DEBUG] Next question is: ' + questionNum);				
			});
		
			// Print the question
			printQuestion(questionNum);					
			if(questionNum > maxQuestionNum || questionNum < 0){
				questionNum = maxQuestionNum;
			}				
			return true;
		}	
		return false;
	}
	/* Show feedback of that question */
	function showFeedback(){
		var ans = storeAns("questions", questionNum);
		var radioButtons = $("section.question input[name='question[" + questionNum + "]']");
		var checkedNum = radioButtons.index(radioButtons.filter(':checked'))+1;
		var ending = false;
		
		if(ans){
			disableMcForm();
			// Fetch the feedback from xml
			$xml.find('question[number="' + questionNum + '"]').each(function(){//Need refine: check whether an element is found
				$(this).find('answer').find('text').each(function(index){
					if($(this).text() == ans){
						
						// Fetch feedback
						$(this).parent().find('feedback').each(function(index){
							var text = $(this).text().replace(/(\r\n|\n|\r)/gm, '<br>');
							$('section.question p#feedback-' + (checkedNum-1)).html(text);
						});
						$('section.question p#feedback-' + (checkedNum-1)).slideDown();					
						
						// Check whether it is the ending answer
						next = $(this).parent().attr('next');
						if(next == 'end'){
							ending = true;
						}
					}			
				});	
				// Allow user to proceed
				//added ?
				if((questionNum < maxQuestionNum && ending == false)
				|| (questionptr != drawedQuestions-1 && branch == false)){
					$("section.question p.messages").append(" ");
					if(questionptr == drawedQuestions-1){
						if(glob_corr == 1){
							console.log("retry last2" + checkAns().correct);
							$("button#controlBtn-retry").hide();
							$("button#controlBtn-next").hide();
							$("button#controlBtn-finish").show();
						}else{
							console.log("next last2" + checkAns().correct);
							$("button#controlBtn-retry").show();
							$("button#controlBtn-next").hide();
						}
					}else{
					if(glob_corr == 1){
						console.log("retry last2" + checkAns().correct);
						$("button#controlBtn-retry").hide();
						$("button#controlBtn-next").show();
					}else{
						console.log("next last2" + checkAns().correct);	
						$("button#controlBtn-retry").show();
						$("button#controlBtn-next").hide();
					}
				}
					$("button#controlBtn-submit").hide();
				} else if(glob_corr == 1){
					$("button#controlBtn-next").hide();
					$("button#controlBtn-submit").hide();
					$("button#controlBtn-finish").show();
				}else{
					$("button#controlBtn-retry").show();
					$("button#controlBtn-next").hide();
					$("button#controlBtn-submit").hide();
					$("button#controlBtn-finish").hide();
				}
			});				
			return true;
		}
		return false;
	}	

	//no need edit0
	/* Show review of answered questions */
	function showReview(store){
		console.log("[DEBUG] Show question review");
		// Fetch previous answers from local storage
		var storage = JSON.parse(localStorage[store] || null);	
		
		if(storage == null){
			console.log("[ERROR] Empty localStorage[\"questions\"]");
			$("button#controlBtn-review").hide();
		} else {
			console.log('[DEBUG] questionptr: ' + questionptr);
			console.dir(storage);
			console.dir(questionSeq);
			
			// Print answered question
			questionNum = questionSeq[questionptr];
			while(branch && storage[questionNum-1] == 'Not Answered'){
				questionptr++;
				questionNum = questionSeq[questionptr];
			}
			$("section.question p.instruction").nextAll().show();
			printQuestion(questionNum);			
			$("section.question p.instruction").html(reviewMsg);
			
			// Print the selected choice
			$("section.question input[name='question[" + questionNum + "]']").each(function() {
				if($(this).val() == storage[questionNum-1]){
					var id = $(this).attr('id');					
					$("section.question label[for='" + id + "']").removeClass('ui-radio-off');
					$("section.question label[for='" + id + "']").addClass('ui-radio-on');
					disableMcForm();
					return false;
				}
			});
			
			// Redraw UI
			$("button#controlBtn-submit").hide();
			$("button#controlBtn-review").hide();
			$("button#controlBtn-next").show();


			// if(questionNum +1 ==){
			// 	$("button#controlBtn-next").hide();
			// 	$("button#controlBtn-finish").show();
			// }else{ 
			// 	$("button#controlBtn-next").show();
			// 	$("button#controlBtn-finish").hide();
			// }
			//add
			// if(glob_corr == 1){
			// 	console.log("retry last");
			// 	$("button#controlBtn-retry").hide();
			// 	$("button#controlBtn-next").show();

			// }else{
			// 	console.log("next last");
			// 	$("button#controlBtn-next").hide();
			// 	$("button#controlBtn-retry").show();
			// }
			// Check whether it is the end of review
			if(questionptr >= questionSeq.length){
				$("button#controlBtn-next").hide();
				endQuestions();
			}		
			questionptr++;
		}
	}
	/* Send test result via email */
	function sendResult(){		
		var body = "Test result:\n";
		var url = 'mailto:' + receipent + '?';
		
		// Fetch previous answers from local storage
		var storage = JSON.parse(localStorage["questions"] || null);
		var results = JSON.parse(localStorage["results"] || null);		
		if(storage != null){
			if(results != null){
				body += 'Question number|Answer|Result\n';
			} else {
				body += 'Question number|Answer\n';
			}
			for(var i = 0; storage[i] != null; i++){
				body += 'Question' + (i+1) + '|' + storage[i];
				if(results != null){
					body += '|' + results[i];
				}
				body += "\n";
			}
		} else {
			body += '[ERROR] Cannot record answers\n';
		}
		
		url += 'subject=' + encodeURIComponent(subject);
		url += '&body=' + encodeURIComponent(body);
		window.location.href = url;
	}
	/* End of test */
	function endBranchQuestions(){
		var pointer = 0;
		var ans = storeAns("questions", questionNum);
		var n = SCOGetValue("cmi.interactions._count") || 0;
		
		if(ans){
			// Complete the test
			disableMcForm();
			SCOSetValue("cmi.core.lesson_status", "completed");		
			
			// Fetch previous answers from local storage
			var storage = JSON.parse(localStorage["questions"] || null);			
			if(storage != null){			
				// Get answers
				$xml.find('question').each(function(){
					ans = storage[pointer];
					SCOSetValue("cmi.interactions."+n+".type_interaction", "choice");
					SCOSetValue("cmi.interactions."+n+".id", 'Question'+(pointer+1));
					if(ans != null){
						SCOSetValue("cmi.interactions."+n+".student_response", ans);
					} else {
						SCOSetValue("cmi.interactions."+n+".student_response", 'Not Answered');
						storage[pointer] = 'Not Answered';
					}	
					// Store answer into local storage
					localStorage["questions"] = JSON.stringify(storage);
					
					// Move pointers
					pointer++;
					n++;
				});
				// Send the score
				SCOSetValue("cmi.core.score.raw", 1);
				// Store answer into local storage
				localStorage["questions"] = JSON.stringify(storage);
			}
			
			$("button#controlBtn-finish").hide();
		
			endQuestions();		
		}
		
		return false;
	}
	/* It must be called at the end of test */
	/* End of test */
	function endQuestions(){
		// Redraw UI
		$("section.question p.instruction").nextAll().hide();
		$("section.question p.instruction").html(farewellMsg );
       
		//$("button#controlBtn-close").show();
	/*	$("button#controlBtn-send-result").show();*/	
		// Enable review
		questionptr = 0;		
		review = true;
		$("button#controlBtn-review").show();	
		return true;
	}
});