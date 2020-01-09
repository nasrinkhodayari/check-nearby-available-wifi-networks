var arrowNavigate = {
	inputs: '',
	observer: '',
	
	onStart: function()	{
		//This sets up the Mutation observer so that findFocusableElements() can be re-run when the DOM changes (i.e. add extra elements).
		if(window.MutationObserver || window.WebKitMutationObserver) { //Unfortunately MotoWebKit currently doesnt support either of these.
			MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
			arrowNavigate.observer = new MutationObserver(arrowNavigate.findFocusableElements);
			arrowNavigate.observer.observe(document, {
				subtree: true,
				childList: true,
				attributes: true
			});
		}
		else {
			/* This is the older DOM Mutation Event methodology */
			document.addEventListener('DOMSubtreeModified', arrowNavigate.findFocusableElements);
		}
		
		arrowNavigate.findFocusableElements();
		document.addEventListener('keydown', arrowNavigate.onKeyDown);
	},
	
	/**
	 *	Finds all the focusable input elements. If there are some elements not selectable, then the element type will need to be added to the jQuery string.
	 *	Currently finds:
	 *		input
	 *		button
	 *		textarea
	 *		select
	 *		option
	 */
	findFocusableElements: function() {
		arrowNavigate.inputs = $('input:visible,button:visible,textarea:visible,select:visible,option:visible').filter(function(){
			//Filters out those that arent selectable (disabled or invisible elements)
			return (this.style.visibility != 'hidden' && this.style.opacity != '0' && !this.disabled);
		}).toArray();
	},
	
	/**
	 *	On up key press, select the previous focusable element; on down key press, select the next focusable element
	 */
	onKeyDown: function(event) {
		if(event.keyCode == 38) { //up
			var index = arrowNavigate.inputs.indexOf(document.activeElement);
			if(index > 0)
			{
				arrowNavigate.inputs[index - 1].focus();
			}
		}
		else if(event.keyCode == 40) { //down
			var index = arrowNavigate.inputs.indexOf(document.activeElement);
			if(index >= 0 && index < arrowNavigate.inputs.length -1)
			{
				arrowNavigate.inputs[index + 1].focus();
			}
		}
	}
};
$(arrowNavigate.onStart); //Runs findFocusableElements() when DOM is ready