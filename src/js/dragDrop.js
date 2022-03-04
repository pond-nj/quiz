var remainingQuestion = 9; 

function respondCorrect() {
	
	remainingQuestion -= 1;
	if (remainingQuestion > 0){
		$("#result-respond").html("<h2 class='correct'>Well Done.</h2>");
	} else {
		$("#result-respond").html("<h2 class='done'>Congraduation!</h2>");
	}
}
$(function() {
  $( ".draggable" ).draggable({
	revert : function(event, ui) {
	$(this).data("uiDraggable").originalPosition = {
		top : 0,
		left : 0
	};
	
	$("#result-respond").html("<h2>Try Again.</h2>");
	
	return !event;
	}
  });

  $( "#droppable-1" ).droppable({
	accept: "#draggable-3",
	drop: function( event, ui ) {	
		respondCorrect();
		$(this).addClass( "draggable" );			
		$(this).droppable('destroy');
		$(this).html(ui.draggable.remove().html());
	}			
  });
  
  $( "#droppable-2" ).droppable({
	accept: "#draggable-1",
	drop: function( event, ui ) {
		respondCorrect();
		$(this).addClass( "draggable" );			
		$(this).droppable('destroy');
		$(this).html(ui.draggable.remove().html());
	}			
  });
  
  $( "#droppable-3" ).droppable({
	accept: "#draggable-2",
	drop: function( event, ui ) {
		respondCorrect();
		$(this).addClass( "draggable" );			
		$(this).droppable('destroy');
		$(this).html(ui.draggable.remove().html());
	}			
  });
  
  $( "#droppable-4" ).droppable({
	accept: "#draggable-8",
	drop: function( event, ui ) {
		respondCorrect();
		$(this).addClass( "draggable" );			
		$(this).droppable('destroy');
		$(this).html(ui.draggable.remove().html());
	}			
  });
  
  $( "#droppable-4" ).droppable({
	accept: "#draggable-8",
	drop: function( event, ui ) {
		respondCorrect();
		$(this).addClass( "draggable" );			
		$(this).droppable('destroy');
		$(this).html(ui.draggable.remove().html());
	}			
  });
  
  $( "#droppable-5" ).droppable({
	accept: "#draggable-6",
	drop: function( event, ui ) {
		respondCorrect();
		$(this).addClass( "draggable" );			
		$(this).droppable('destroy');
		$(this).html(ui.draggable.remove().html());
	}			
  });
  
  $( "#droppable-5" ).droppable({
	accept: "#draggable-6",
	drop: function( event, ui ) {
		respondCorrect();
		$(this).addClass( "draggable" );			
		$(this).droppable('destroy');
		$(this).html(ui.draggable.remove().html());
	}			
  });
  
  $( "#droppable-6" ).droppable({
	accept: "#draggable-7",
	drop: function( event, ui ) {
		respondCorrect();
		$(this).addClass( "draggable" );			
		$(this).droppable('destroy');
		$(this).html(ui.draggable.remove().html());
	}			
  });
  
  $( "#droppable-7" ).droppable({
	accept: "#draggable-9",
	drop: function( event, ui ) {
		respondCorrect();
		$(this).addClass( "draggable" );			
		$(this).droppable('destroy');
		$(this).html(ui.draggable.remove().html());
	}			
  });
  
  $( "#droppable-8" ).droppable({
	accept: "#draggable-4",
	drop: function( event, ui ) {
		respondCorrect();
		$(this).addClass( "draggable" );			
		$(this).droppable('destroy');
		$(this).html(ui.draggable.remove().html());
	}			
  });
  
  $( "#droppable-9" ).droppable({
	accept: "#draggable-5",
	drop: function( event, ui ) {
		respondCorrect();
		$(this).addClass( "draggable" );			
		$(this).droppable('destroy');
		$(this).html(ui.draggable.remove().html());
	}			
  });
  
});	