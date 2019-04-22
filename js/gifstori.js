 jQuery(function($) {

 	// Javascript is active
 	$('body').addClass('js').removeClass('no-js');


 	// Set some vars
	var i = 0, j = 1;
	previous_search = false;
	search_again = false;


	// Show 'Add text' button once the user starts entering text, and tweak the css
	$('.text_lines').on('click', function(){
		$('.save_text_button').fadeIn().css('display', 'block');
		$(this).css('border-radius', '10px 10px 0 0');
	});


	// Show search box after saving text
	$('.text_container').submit(function(e){
		
		e.preventDefault();

		// Clear previous classes from all .row
		$('.story.container > .row').removeClass( 'inactive_row' ).removeClass( 'active_row' );
		
		// Fade out the textarea and 'Add text' button
		$('.text_lines').fadeOut(300);
		$(this).children('.save_text_button').fadeOut(300);

		// Then show the gif search box and reset its value
		$('#giphy_search_container').delay(300).fadeIn();
		$('#giphy_search').val('');

		// Get the text the user inputted and append it to the container
		var textarea_content = $('.text_lines').val();
		$('.story.container').append('<div class="active_row row pure-u-1-2" id="row_' + (i+1) + '"><div class="default_image"><i class="fa fa-file-image-o"></i></div><textarea class="row_textarea">' + textarea_content + '</textarea></div>').hide().fadeIn();
		
		// Don't want the user to create the gifstori yet, so hide the button
		$('#share').fadeOut();

		// Grey out the other tiles, so the user can't change them until they've finished the present tile
		$('.story.container > .row:not(.active_row)').addClass( 'inactive_row' );

	});


	// Generate giphy from inputs
	$('.story-container').submit(function(e){
		
		// Check if this isn't the first search
		if( ! previous_search ) { i++; }
		
		e.preventDefault();

		// Get values
		text = $('.text_lines').val();
		giphy_q = $('input#giphy_search').val();

		if( previous_search ) {
			
			// remove content from previous search
			$('#giphyContainer_' + i).remove(); 
			$('.load_more_wrapper').remove();
			
		}

		if (!search_again) {
			// Create elements to hold text and giphy
			giphy_div = '<div id="giphyContainer_' + i + '"><div class="giphyInsert ' + giphy_q + '" id="giphy_' + i + '"></div></div>';

			// Add to the DOM
			$('.story.container').append( giphy_div );
		} else {
			$('#giphyContainer_' + search_again_row_number).show();
			$('#giphy_' + search_again_row_number).show().attr('class', 'giphyInsert ' + giphy_q);
		}
		
		// Insert Giphy search results
		if(search_again) {
			$('#giphy_' + search_again_row_number).searchGiphy(0, 12, search_again_row_number, text);
		} else {
			$('#giphy_' + i).searchGiphy(0, 12, i, text);
		}

		// Append the 'load more' link, and add functionality to load more results
		if(search_again) {
			$('.story.container').append( '<a data-number="' + search_again_row_number + '" class="load_more" href="#">Load more "' + giphy_q +  '" gifs <i class="fa fa-plus-circle"></i></a>' );
		} else {
			$('.story.container').append( '<div class="load_more_wrapper"><a data-number="' + i + '" class="load_more" href="#">Load more "' + giphy_q +  '" gifs <i class="fa fa-plus-circle"></i></a></div>' );
		}

		$('.load_more').on( 'click', function(e){
			e.preventDefault();
			number = $(this).attr('data-number');
			$('#giphy_' + number).searchGiphy( ( (12 * j) + j ), ( 12 * ( j + 1) + j ), i, text );
			j++;
		});

		// Reset the inputs
		$('#giphy_search').val('').attr('placeholder', 'Search again...');
		$(this).children('textarea').val('').fadeIn().focus();

		previous_search = true;

		// Scroll to new element
		if(search_again) {

			$('html, body').animate({
				scrollTop: $('#giphyContainer_' + search_again_row_number).offset().top
			}, 1000);

		} else {

			$('html, body').animate({
				scrollTop: $('#giphyContainer_' + i).offset().top
			}, 1000);

		}

	});


	// If text is changed update the data
	$('.story.container').on('change', '.row_textarea', function(){

		// Get the row number
		var row_number = $(this).parent('.row').next('div').attr('id');

		// Get the updated text
		var updated_text = $(this).val();

		// Update images_and_text object with new text
		if (typeof row_number != 'undefined') {
			row_number = row_number.replace('giphyContainer_', '');

			images_and_text['data_' + row_number ]['text'] = updated_text;

		} else { // A gif hasn't been added yet so just update the original textarea's value
			$('.text_lines').val(updated_text);
		}
	
	});


	// Search again for a gif
	$('body').on('click', '.search_again', function(e){

		e.preventDefault();

		// Hide the textarea
		$('.text_container textarea, .text_container .save_text_button').hide();

		// Show the gif search again
		$('#giphy_search_container').fadeIn();
		$('#giphy_search').focus();

		// Set some variables to pass through to the searchGiphy function
		search_again_textarea = $(this).siblings('textarea').val();
		parent_id = $(this).parent().attr('id');		
		search_again_row_number = parent_id.replace('row_', '');

		// Hide other rows and make this row full width
		$(this).parent().siblings( '.row' ).hide();
		$(this).parent().removeClass( 'pure-u-1-2' ).addClass( 'pure-u-5-5' );

		$('.text_lines').val(search_again_textarea);

		search_again = true;

	});


	// Share page links
	$('.share_wrapper a').on('click', function(e){
		
		e.preventDefault();
		
		var id = $(this).attr('href');

		$('.share_wrapper > div').removeClass('target');
		
		$(id).addClass('target');

	});

});











