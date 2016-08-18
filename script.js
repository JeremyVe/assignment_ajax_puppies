$(document).ready(function() {

	var $list = $('#puppy-list');

	var errors = [];

	var breedList;

	var $notification = $('.notification');

	$notification.hide();

	$(document).ajaxSuccess(function() {
		$notification.html("Waiting...");
		$notification.addClass("waiting");
		$notification.show();

		setTimeout(function() {
			if ($notification.html() === "Waiting...") {
				$notification.html("Still Waiting...")
			}
		}, 1000);
	})


	$(document).ajaxComplete(function() {
		if (errors.length > 0) {
			$notification.show();
			$notification.html(errors[0]);
			$notification.removeClass("waiting").addClass("error");
			errors = [];
		} else {
			$notification.html("success");
			$notification.removeClass("waiting").addClass("success");
		}
		setTimeout(function() {
			$notification.fadeOut();
		}, 2000);
	})



	$("#update-list").on('click', function(event) {
		event.preventDefault();
		$.ajax({
			url: "https://ajax-puppies.herokuapp.com/puppies.json",
			success: function(data) {
				updatePuppyList(data);					
			},
			error: function() {
				errors.push("Could not update the list");
			}
		})
	})

	var createPuppyItem = function(puppy) {
		var li = $('<li>')
			.attr("id", puppy.id)
			.html( puppy.name + ", (" + puppy.breed.name + "), " + puppy.created_at );

		return li;
			
	}


	var updatePuppyList = function(data) {
		$list.html("");

		for (var i = 0; i < data.length; i++) {

			var puppy = data[i];


			var li = createPuppyItem(puppy);

			var adoptLink = createAdoptLink(puppy.id);


			$('#puppy-list').append(li);
			$('#puppy-list').append(adoptLink);
		}
	}


	var createBreedList = function() {
		$.ajax({
			global: false,
			url: "https://ajax-puppies.herokuapp.com/breeds.json",
			success: function(data) {
				updateSelectList(data);
				breedList = data;
			}
		})
	}


	var updateSelectList = function(data) {
		var $selectList = $('select');

		for (var i = 0; i < data.length; i++) {
			var option = $('<option>')
						 .attr("value", data[i].id);

			option.html(data[i].name);
			$selectList.append(option);
		}
	}

	createBreedList();


	$('input[type="button"]').on('click', function(event) {

		var formData = {
			name: $('input[type="text"]').val(),
			breed_id: $('select').val()
		}

		if (formData.name.length < 1 ) {
			errors.push("This puppy needs a name !");
		} else if (formData.breed_id === undefined) {
			errors.push("This puppy needs a breed !")

		} else {

			formData = JSON.stringify(formData);

			$.ajax({
				url: "https://ajax-puppies.herokuapp.com/puppies.json",
				type: "POST",
				contentType: 'application/json',
				data: formData,
				dataType: 'json',
				success: function(data) {

					var breed = breedList[data.breed_id - 1].name;
					data.breed = {};
					data.breed.name = breed;
					var li = createPuppyItem(data);

					$list.prepend(li)
				},
				error: function(data) {
					alert("New puppy not create");
				}	
			})
		}
		
	});

	var createAdoptLink = function(id) {
		var link = $('<a>')
				   .addClass("adopt")
				   .attr('id', id)
				   .attr("href", "#")
				   .html('Adopt Me!');
		return link;
	}

	$('ul').on('click', '.adopt', function(event) {
		var $el = $(event.target);
		event.preventDefault();

		var id = $el.attr('id');
		$.ajax({
			url: "https://ajax-puppies.herokuapp.com/puppies/" + id + ".json",
			type: "DELETE",
			success: function(data) {
				alert("success", data);
				removePuppyList(id);
			},
			error: function(data) {
				alert("Puppy not adopted");
			}	

		})
	})

	var removePuppyList = function(id) {
		$('ul').find("[id=" + id + "]").remove();
	}

})