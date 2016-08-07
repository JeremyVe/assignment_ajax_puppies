$(document).ready(function() {

	$("#update-list").on('click', function(event) {
		event.preventDefault();
		$.ajax({
			url: "https://ajax-puppies.herokuapp.com/puppies.json",
			success: function(data, status, obj) {

				updatePuppyList(data);				
				
			}
		})

		var updatePuppyList = function(data) {
			var $list = $('#puppy-list');
			$list.html("");

			for (var i = 0; i < data.length; i++) {

				var puppy = data[i];
				console.log(puppy);

				var li = $('<li>')
				li.html( puppy.name + ", (" + puppy.breed.name + "), " + puppy.created_at );
				$('#puppy-list').append(li);
			}
		}
	})

	var createBreedList = function() {
		$.ajax({
			url: "https://ajax-puppies.herokuapp.com/breeds.json",
			success: function(data, status, obj) {
				updateSelectList(data);
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

		formData = JSON.stringify(formData);

		$.ajax({
			url: "https://ajax-puppies.herokuapp.com/puppies.json",
			type: "POST",
			contentType: 'application/json',
			data: formData,
			dataType: 'json',
			success: function(data, status, obj) {
				console.log(data);
			},
			error: function(data) {
				console.log(data);
			}	
		})
		
	});

})