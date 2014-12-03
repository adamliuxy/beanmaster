/**
 * Created by Bossa on 2/12/14.
 */

//todo: put in utility
function highlightElement(element) {
	element.css('background-color', '');

	var color = element.css('background-color');

	element.css({
		'background-color': '#afa'
	}).animate({
			'background-color': color
		}, 500);
}

//todo: put in utility
function updateCellValue(cell, value) {
	cell.text(value);
	highlightElement(cell);
}

function tabulateTubeInfo(tube_info) {
	var cells = $('#tube_table > tbody > tr').find('td');
	var tube_name = cells.eq(0).text();

	if (tube_info) {
		//check cells content
		var column = 0;
		for (var key in tube_info) {
			if (tube_info.hasOwnProperty(key)) {
				//skip tube name checking
				var cell = cells.eq(column);
				if (column > 0) {
					if (parseInt(tube_info[key]) !== parseInt(cell.text())) {
						updateCellValue(cell, tube_info[key]);
					}
				} else {
					cell.text(tube_info[key]);
				}
				column++;
			}
		}
	} else {
		//row on table did not exists anymore in the info from server
	}
}

function tabulateStats(stats) {
	for (var key in stats) {
		if (stats.hasOwnProperty(key)) {

			var container = $('#' + key).find('.detail');

			if (stats[key]) {
				container.show().removeClass('hide');

				var tbody = container.find('table > tbody');

				var rows = tbody.find('tr');
				var stat_key = null;

				if (rows.length == 0) {
					for (stat_key in stats[key].stat) {
						if (stats[key].stat.hasOwnProperty(stat_key)) {
							tbody.append(
								$(document.createElement('tr'))
									.append(
										$(document.createElement('td'))
											.html(stat_key)
									)
									.append(
										$(document.createElement('td'))
											.html(stats[key].stat[stat_key])
									)
							)
						}
					}
				} else {
					for (var i = 0; i < rows.length; i++) {
						var cells = $(rows[i]).find('td');
						stat_key = cells.eq(0).text();
						var new_value = stats[key].stat[stat_key];
						var existing_value = cells.eq(1).text();

						if (!isNaN(parseInt(new_value))) {
							new_value = parseInt(new_value);
							existing_value = parseInt(existing_value);
						}

						if (new_value !== existing_value) {
							updateCellValue(cells.eq(1), stats[key].stat[stat_key]);
						}
					}
				}

				container.find('code').html(stats[key].payload);

			} else {
				container.hide();
			}
		}
	}
}

function hideTube() {
	$('#not_found').show().removeClass('hide');
	$('#tube_table').hide();
}

function showTube() {
	$('#not_found').hide();
	$('#tube_table').show().removeClass('hide');
}

function refreshTubeInfo() {

	$.ajax({
		url: '/' + encodeURIComponent($('#host').val()) + ':' + $('#port').val() + '/' + $('#tube').val() + '/refresh',
		method: 'get',
		dataType: 'json',
		beforeSend: function() {
		},
		complete: function() {
		},
		success: function(data) {

			if (data.err === 'NOT_FOUND') {
				hideTube();
			} else {
				showTube();
				tabulateTubeInfo(data.tube_info);
				tabulateStats(data.stats);
			}

			setTimeout(function() {
				refreshTubeInfo();
			}, 1000);
		},
		error: function(err) {
			console.log(err);
		}
	});

}

function promptAddJob() {
	$('#add_job').modal({
		backdrop: 'static'
	}).find('input,textarea').val('');

	$('#tube_name').val($('#tube').val());
}

function blockForm() {
	$('#add_job').find('input,button,textarea').attr('disabled', 'disabled');
	$('.preloader').show();
}

function unblockForm() {
	$('#add_job').find('input,button,textarea').removeAttr('disabled');
	$('.preloader').hide();
}

function addJob() {

	var fields = ['tube_name', 'payload', 'priority', 'delay', 'ttr'];

	var valid = true;

	var data = {
		_csrf: $('#_csrf').val()
	};

	for (var i = 0; i < fields.length; i++) {
		var element = $('#' + fields[i]);
		element.parent().parent().removeClass('has-warning');
		if (element.hasClass('required') && element.val() === '') {
			valid = false;
			element.parent().parent().addClass('has-warning');
		}
		data[fields[i]] = element.val();
	}

	if (valid) {
		$.ajax({
			url: '/' + encodeURIComponent($('#host').val()) + ':' + $('#port').val() + '/' + $('#tube').val() + '/add-job',
			method: 'post',
			data: data,
			dataType: 'json',
			beforeSend: function() {
				blockForm();
			},
			complete: function() {
				unblockForm();
			},
			success: function(data) {
				if (data.err) {
					//todo: show error
					console.log(data.err);
				} else {
					$('#add_job').modal('hide');
				}
			},
			error: function() {
				console.log(err);
			}
		});
	}
}

$(function() {

	$('#test_btn').click(function() {
		refreshTubeInfo();
	});

	setTimeout(function() {
		refreshTubeInfo();
	}, 1000);

	$('#btn_add_job').click(function() {
		promptAddJob();
	});

	$('#btn_add_job_confirm').click(function() {
		addJob();
	});
});