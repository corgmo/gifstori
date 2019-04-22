(function($) {

	$.fn.searchGiphy = function ( min, max, number, text ) {
		
		// First check if this is a 'Search again' request
		if (search_again) {
			number = search_again_row_number;
		}
		
		// Create object to hold the images and text
		if (typeof images_and_text != "undefined") {
			// Object exists
		} else {
			images_and_text = {};
		};

		key = 'data_' + number;

		// Set element
		var element = $(this);

		// Set search query
		var q = $(this).attr('class').replace('giphyInsert ', '').replace(' ', '+');
		
		// Send request to Giphy API
		var request = new XMLHttpRequest;
		request.open('GET', 'https://api.giphy.com/v1/gifs/search?api_key=l41YAy919Bm9LySic&limit=' + max + '&q=' + q, true);
		
		request.onload = function() {
			if (request.status >= 200 && request.status < 400){
				
				// Loop through results, then output images
				for (var i = min; i < max; i++) {
					
					// Get urls
					var giphy_image_fixed_width_small = JSON.parse(request.responseText).data[i].images.fixed_height_small.url;
					var giphy_image_original = JSON.parse(request.responseText).data[i].images.original.url;

					// Insert image into element
					var image = '<div class=" pure-u-1-2 pure-u-sm-1-4"><a class="choose_image" style="background-image: url(' + giphy_image_fixed_width_small + ')" href="#" data-number="' + number + '" data-image-url="' + giphy_image_original + '"></a></div>';
					
					$(image).hide().appendTo(element).fadeIn(500);
				
				}


				// Insert chosen image
				$('.choose_image').one( 'click', function(e){
						
					e.preventDefault();
					
					// Get some data
					data_number = $(this).attr('data-number');
					chosen_image = $(this).attr('data-image-url');

					// Create HTML to append
					var insert_image_html = '<a href="#" class="search_again"><i class="fa fa-search"></i> Search again?</a><img class="chosen_image" src="' + chosen_image + '">';
					
					if (search_again) {
						$('#row_' + data_number + ' img, #row_' + data_number + ' .search_again').remove();
					}

					$('#row_' + data_number).prepend(insert_image_html);

					//$('#giphy_' + data_number).html('<img src="' + chosen_image + '">');

					// Don't need these any more so hide them
					$('#giphyContainer_' + data_number).hide();
					$('a[data-number=' + data_number + '], .load_more_wrapper, .giphyInsert .pure-u-1-2, .default_image' ).remove();

					// Add data to images_and_text object
					images_and_text['data_' + number ] = { text: text, image: chosen_image };

					// Show the textarea again
					$('.text_container textarea, .text_container .save_text_button').val('').attr('placeholder', 'Add some more text...').fadeIn();

					// Fade out the gif search box, and tweak its placeholder text
					$('#giphy_search_container').fadeOut();
					$('#giphy_search').val('').attr('placeholder', 'Search for a GIF...');

					// Get ready for more text
					$('.text_lines').focus();

					// Show the 'Create gifstori' button
					$('#share').fadeIn();

					// Image has been chosen, so reset previous_search and seach_again
					previous_search = false;
					search_again = false;

					// Reset .row classes
					$('.story.container > .row').removeClass( 'inactive_row' ).removeClass( 'active_row' );
					$('.story.container > .row').removeClass( 'pure-u-5-5' ).addClass( 'pure-u-1-2' ).show();

					// Scroll to new image
					$('html, body').animate({
						scrollTop: $('#row_' + data_number).offset().top - 50
					}, 500);
				
				});			
					
			} else {
					console.log('Query is ' + q + ', reached giphy, but API returned an error');
			}
			
		};
		request.onerror = function() {
			console.log('connection error');
		};

		request.send();
		
	};

}( jQuery ));